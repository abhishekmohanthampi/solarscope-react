# SolarScope React Interface

A React + Vite frontend prototype for a rooftop solar potential hackathon project. Includes a responsive dashboard, interactive estimate controls, Mapbox satellite map, rooftop polygon drawing, polygon area measurement with Turf.js, and a financial impact panel.

## Run locally

1. Install Node.js LTS if needed.
2. Open this folder in VS Code or a terminal.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and add a Mapbox **public** access token:

   ```env
   VITE_MAPBOX_TOKEN=pk.your_public_token_here
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Map setup

Create a public token at https://account.mapbox.com/access-tokens/. Restrict the token to your development/production URLs when possible. A token is needed for satellite imagery, address search, and drawing tools. Do not put a secret/private server token in a frontend `.env` variable.

## What works in this prototype

- Responsive React interface and dashboard
- Search for an address using Mapbox Geocoding
- Pan/zoom satellite map
- Draw, update, and delete a rooftop polygon
- Calculate drawn polygon area with Turf.js
- Adjust usable area, estimated solar yield, tariff, installation cost, on-site use, and system lifetime
- Recalculate generation, annual savings, CO₂ estimate, payback, and lifetime net savings live

## Important limitations

The solar yield (kWh/kW/year), grid emissions factor (0.65 kg CO₂/kWh), panel space assumption (8 m²/kW), tariff, and installation cost begin as editable illustrative assumptions. This app does not yet call PVWatts or a live local tariff/subsidy database. A rooftop polygon measures the map geometry; it does not automatically identify shade, structural suitability, obstructions, roof tilt, or true panel layout. The simple savings model assumes annual savings = generation × tariff × self-consumption share; add export credits, maintenance, degradation, financing, and subsidies for a production-quality ROI estimate.
