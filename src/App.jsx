import React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import area from '@turf/area'
import { Sun, Leaf, IndianRupee, Clock3, MapPin, Search, Crosshair, Pencil, RotateCcw, ChevronDown, Zap, ArrowUpRight, CheckCircle2, CircleHelp, Menu, X, Building2, Compass, ShieldCheck } from 'lucide-react'

const DEFAULT_CENTER = [76.2673, 9.9312]
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
const number = value => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)

export default function App() {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const drawRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)
  const [address, setAddress] = useState('Kochi, Kerala, India')
  const [searching, setSearching] = useState(false)
  const [roofArea, setRoofArea] = useState(120)
  const [usablePercent, setUsablePercent] = useState(70)
  const [yieldPerKw, setYieldPerKw] = useState(1400)
  const [tariff, setTariff] = useState(7)
  const [costPerKw, setCostPerKw] = useState(60000)
  const [selfUse, setSelfUse] = useState(80)
  const [systemLife, setSystemLife] = useState(25)
  const [drawnRoof, setDrawnRoof] = useState(false)
  const [notice, setNotice] = useState('Draw around a rooftop to calculate its area.')
  const [mobileMenu, setMobileMenu] = useState(false)

  const usableArea = roofArea * usablePercent / 100
  const capacity = usableArea / 8
  const annualEnergy = capacity * yieldPerKw
  const annualSavings = annualEnergy * tariff * selfUse / 100
  const upfrontCost = capacity * costPerKw
  const payback = annualSavings > 0 ? upfrontCost / annualSavings : 0
  const annualCarbon = annualEnergy * 0.65 / 1000
  const lifetimeSavings = annualSavings * systemLife - upfrontCost

  const setAreaFromPolygon = useCallback(feature => {
    if (!feature || !feature.geometry || feature.geometry.type !== 'Polygon') return
    const squareMetres = area(feature)
    if (Number.isFinite(squareMetres) && squareMetres > 0) {
      setRoofArea(Math.max(1, Math.round(squareMetres)))
      setUsablePercent(70)
      setDrawnRoof(true)
      setNotice(`Roof outline measured: ${number(Math.round(squareMetres))} m². Adjust usable area for obstructions.`)
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = L.map(mapContainer.current, { zoomControl: false }).setView(
      [DEFAULT_CENTER[1], DEFAULT_CENTER[0]], 16
    )

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
      }
    ).addTo(map)

    L.control.zoom({ position: 'topright' }).addTo(map)

    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)

    map.addControl(new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: false,
          shapeOptions: { color: '#d9ff83', weight: 3, fillColor: '#b8f34b', fillOpacity: 0.25 }
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: { featureGroup: drawnItems, remove: true }
    }))

    map.on(L.Draw.Event.CREATED, event => {
      drawnItems.clearLayers()
      drawnItems.addLayer(event.layer)
      setAreaFromPolygon(event.layer.toGeoJSON())
    })

    map.on(L.Draw.Event.EDITED, event => {
      event.layers.eachLayer(layer => setAreaFromPolygon(layer.toGeoJSON()))
    })

    map.on(L.Draw.Event.DELETED, () => {
      setDrawnRoof(false)
      setNotice('Roof outline cleared. Draw another rooftop to measure it.')
    })

    mapRef.current = map
    drawRef.current = drawnItems
    map.whenReady(() => setMapReady(true))

    return () => {
      map.remove()
      mapRef.current = null
      drawRef.current = null
    }
  }, [setAreaFromPolygon])

  const searchAddress = async event => {
    event?.preventDefault()
    const query = address.trim()
    if (!query || !mapRef.current) return

    setSearching(true)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Address search failed')
      const results = await response.json()
      const result = results[0]

      if (!result) {
        setNotice('No matching address found. Try a nearby landmark or full address.')
      } else {
        mapRef.current.flyTo([Number(result.lat), Number(result.lon)], 18)
        setAddress(result.display_name)
        setNotice('Location found. Zoom in and draw around the rooftop.')
      }
    } catch {
      setNotice('Address search failed. Try again later or move the map manually.')
    } finally {
      setSearching(false)
    }
  }

  const resetMap = () => {
    drawRef.current?.clearLayers()
    setRoofArea(120)
    setUsablePercent(70)
    setDrawnRoof(false)
    setNotice('Map selection reset. Draw around a rooftop to calculate its area.')
    mapRef.current?.setView([DEFAULT_CENTER[1], DEFAULT_CENTER[0]], 16)
  }

  const timeline = useMemo(() => Array.from({ length: systemLife }, (_, index) => {
    const year = index + 1
    const generationFactor = Math.pow(0.995, index)
    return { year, cumulative: annualSavings * generationFactor + (index ? 0 : 0) }
  }), [annualSavings, systemLife])

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="SolarScope home">
          <span className="brand-mark"><Sun size={23} strokeWidth={2.3} /></span>
          <span>solar<span className="brand-light">scope</span><small>ROOFTOP SOLAR PLANNER</small></span>
        </a>
        <nav className={mobileMenu ? 'nav-links nav-open' : 'nav-links'}>
          <a className="nav-active" href="#planner" onClick={() => setMobileMenu(false)}>Solar planner</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#impact" onClick={() => setMobileMenu(false)}>Our impact</a>
        </nav>
        <div className="topbar-right">
          <span className="beta-pill"><span /> HACKATHON DEMO</span>
          <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> CLEAN ENERGY, MADE CLEAR</div>
            <h1>Your roof has<br />a <span className="highlight-word">brighter</span> future.</h1>
            <p>Discover your rooftop’s solar potential, estimate your savings, and see when your investment can pay for itself.</p>
            <div className="hero-points"><span><CheckCircle2 size={16} /> Location-based estimates</span><span><CheckCircle2 size={16} /> Clear financial insights</span></div>
          </div>
          <div className="hero-art" aria-label="Solar panel illustration">
            <div className="sun-orb"><Sun size={45} strokeWidth={1.4} /></div>
            <div className="art-cloud cloud-one" /><div className="art-cloud cloud-two" />
            <div className="art-roof"><div className="roof-panels"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="art-ground" />
            <div className="floating-tag"><span className="tag-icon"><Zap size={16} /></span><span><b>Clean energy</b><small>Starts at home</small></span></div>
          </div>
        </section>

        <section className="planner-section" id="planner">
          <div className="section-heading">
            <div><div className="eyebrow"><span className="eyebrow-line" /> YOUR SOLAR SNAPSHOT</div><h2>Let’s map your potential.</h2><p>Choose a location, outline your roof, and explore the numbers.</p></div>
            <div className="step-indicator"><span className="step-current">01</span><span className="step-rule" /><span>02</span><span className="step-rule" /><span>03</span></div>
          </div>

          <div className="workspace">
            <section className="map-panel panel">
              <div className="map-panel-header">
                <div className="panel-title"><span className="panel-icon"><MapPin size={18} /></span><div><h3>Find your rooftop</h3><p>Search an address or explore the map</p></div></div>
                <button className="icon-button" onClick={resetMap} title="Reset map"><RotateCcw size={17} /></button>
              </div>
              <form className="search-form" onSubmit={searchAddress}><Search size={18} /><input aria-label="Search address" value={address} onChange={event => setAddress(event.target.value)} placeholder="Enter your address or location" /><button type="submit" disabled={searching}>{searching ? 'Searching…' : <ArrowUpRight size={18} />}</button></form>
              <div className="map-wrap">
                <div ref={mapContainer} className="map-canvas" />
                <div className="map-badge"><span className={mapReady ? 'live-dot' : 'live-dot muted'} /> {mapReady ? 'INTERACTIVE MAP' : 'MAP PREVIEW'}</div>
                <div className="map-coordinates"><Crosshair size={13} /> {drawnRoof ? 'ROOFTOP SELECTED' : '9.9312° N · 76.2673° E'}</div>
              </div>
              <div className="map-instructions"><span className="draw-icon"><Pencil size={17} /></span><div><b>Outline your roof</b><p>Choose the polygon tool on the map, click each roof corner, then click the first point to finish.</p></div></div>
              <div className={drawnRoof ? 'map-status status-success' : 'map-status'}><span className="status-dot" />{notice}</div>
            </section>

            <aside className="results-column">
              <section className="panel roof-panel">
                <div className="panel-title"><span className="panel-icon"><Building2 size={18} /></span><div><h3>Roof details</h3><p>Fine-tune the estimate</p></div></div>
                <div className="area-summary"><div><span className="field-label">TOTAL ROOF AREA</span><strong>{number(roofArea)} <small>m²</small></strong></div><span className="area-illustration"><Building2 size={26} /></span></div>
                <div className="slider-field"><div className="slider-label"><label htmlFor="usable">Usable roof area</label><b>{usablePercent}%</b></div><input id="usable" type="range" min="40" max="90" step="5" value={usablePercent} onChange={event => setUsablePercent(Number(event.target.value))} /><div className="range-labels"><span>More obstacles</span><span>Mostly clear</span></div></div>
                <div className="usable-result"><span>Estimated usable area</span><b>{number(Math.round(usableArea))} m²</b></div>
                <div className="mini-note"><CircleHelp size={14} /> Allows for setbacks, shade, access paths and obstructions.</div>
              </section>

              <section className="panel estimate-panel">
                <div className="estimate-heading"><div><span className="field-label">YOUR ESTIMATED IMPACT</span><h3>Sunshine that pays off.</h3></div><span className="sun-small"><Sun size={20} /></span></div>
                <div className="metric-grid">
                  <div className="metric-card energy-card"><span className="metric-icon"><Zap size={17} /></span><span className="metric-label">Annual generation</span><strong>{number(annualEnergy)}</strong><span className="metric-unit">kWh / year</span></div>
                  <div className="metric-card carbon-card"><span className="metric-icon"><Leaf size={17} /></span><span className="metric-label">CO₂ avoided</span><strong>{annualCarbon.toFixed(2)}</strong><span className="metric-unit">tonnes / year</span></div>
                  <div className="metric-card savings-card"><span className="metric-icon"><IndianRupee size={17} /></span><span className="metric-label">Annual savings</span><strong>{money(annualSavings)}</strong><span className="metric-unit">estimated bill savings</span></div>
                  <div className="metric-card payback-card"><span className="metric-icon"><Clock3 size={17} /></span><span className="metric-label">Payback period</span><strong>{payback.toFixed(1)} <small>yrs</small></strong><span className="metric-unit">simple payback</span></div>
                </div>
                <div className="system-summary"><div><span>Suggested system size</span><b>{capacity.toFixed(1)} kW</b></div><div><span>Estimated upfront cost</span><b>{money(upfrontCost)}</b></div></div>
              </section>
            </aside>
          </div>
        </section>

        <section className="assumptions-section" id="how-it-works">
          <div className="section-heading compact-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> MAKE IT YOURS</div><h2>Every roof. A different return.</h2><p>Adjust the assumptions to see how your solar investment could change.</p></div><div className="assumption-icon"><Compass size={24} /></div></div>
          <div className="assumption-grid">
            <section className="panel assumption-panel">
              <div className="assumption-top"><span className="assumption-number">01</span><div><h3>Local solar conditions</h3><p>Expected annual energy output</p></div></div>
              <div className="slider-field"><div className="slider-label"><label htmlFor="yield">Annual solar yield</label><b>{number(yieldPerKw)} <small>kWh/kW</small></b></div><input id="yield" type="range" min="900" max="1800" step="50" value={yieldPerKw} onChange={event => setYieldPerKw(Number(event.target.value))} /><div className="range-labels"><span>Lower sunlight</span><span>Higher sunlight</span></div></div>
              <div className="slider-field"><div className="slider-label"><label htmlFor="selfuse">Solar energy used on-site</label><b>{selfUse}%</b></div><input id="selfuse" type="range" min="20" max="100" step="5" value={selfUse} onChange={event => setSelfUse(Number(event.target.value))} /><div className="range-labels"><span>More exported</span><span>More self-used</span></div></div>
            </section>
            <section className="panel assumption-panel">
              <div className="assumption-top"><span className="assumption-number">02</span><div><h3>Your financial picture</h3><p>Tariff, installation cost and system life</p></div></div>
              <div className="slider-field"><div className="slider-label"><label htmlFor="tariff">Electricity tariff</label><b>₹{tariff.toFixed(1)} <small>/ kWh</small></b></div><input id="tariff" type="range" min="3" max="15" step="0.5" value={tariff} onChange={event => setTariff(Number(event.target.value))} /><div className="range-labels"><span>₹3</span><span>₹15</span></div></div>
              <div className="slider-field"><div className="slider-label"><label htmlFor="cost">Installation cost</label><b>{money(costPerKw)} <small>/ kW</small></b></div><input id="cost" type="range" min="40000" max="100000" step="5000" value={costPerKw} onChange={event => setCostPerKw(Number(event.target.value))} /><div className="range-labels"><span>₹40,000</span><span>₹1,00,000</span></div></div>
              <div className="slider-field"><div className="slider-label"><label htmlFor="life">System lifetime</label><b>{systemLife} years</b></div><input id="life" type="range" min="10" max="30" step="5" value={systemLife} onChange={event => setSystemLife(Number(event.target.value))} /><div className="range-labels"><span>10 years</span><span>30 years</span></div></div>
            </section>
            <section className="lifetime-card">
              <div className="lifetime-top"><span><ShieldCheck size={18} /></span><span>LONG-TERM OUTLOOK</span></div>
              <p>Estimated net savings over {systemLife} years</p><strong>{money(lifetimeSavings)}</strong><div className="lifetime-bar"><span style={{ width: `${Math.max(0, Math.min(100, (lifetimeSavings / Math.max(upfrontCost, 1)) * 10))}%` }} /></div><div className="lifetime-foot"><span>After estimated system cost</span><b>{lifetimeSavings >= 0 ? 'Positive return' : 'Cost not recovered'}</b></div><div className="lifetime-disclaimer">Illustrative estimate before maintenance, degradation, financing, subsidies and export credits.</div>
            </section>
          </div>
        </section>

        <section className="impact-strip" id="impact"><div className="impact-leaf"><Leaf size={25} /></div><div><span>SMALL ROOF. MEANINGFUL CHANGE.</span><h2>Make clean energy a clearer choice.</h2><p>Better information can help more homes and businesses consider renewable power.</p></div><div className="impact-stat"><strong>{number(annualEnergy)}</strong><span>kWh estimated each year</span></div><div className="impact-stat"><strong>{annualCarbon.toFixed(2)} t</strong><span>CO₂ avoided each year</span></div></section>

        <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Sun size={20} /></span><span>solar<span className="brand-light">scope</span><small>ROOFTOP SOLAR PLANNER</small></span></a><p>Designed for a brighter, more sustainable future.</p><span className="footer-right">SDG 7 · SDG 11</span></footer>
      </main>
    </div>
  )
}
