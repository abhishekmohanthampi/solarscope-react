# ☀️ SolarScope
### Smart Rooftop Solar Potential & ROI Estimator

SolarScope is a web-based application that helps users understand the solar energy potential of their rooftops and estimate the financial and environmental benefits of installing solar panels.

By combining interactive satellite maps with solar calculations, SolarScope aims to make rooftop solar adoption easier, more accessible, and more understandable.

**Aligned with UN Sustainable Development Goals:**
- SDG 7 – Affordable and Clean Energy
- SDG 11 – Sustainable Cities and Communities

---

## 🌍 Problem Statement

Many households and building owners are interested in switching to solar energy but lack information about:

- Whether their rooftops are suitable for solar installations.
- How much electricity their rooftops could potentially generate.
- How much money they could save through solar energy.
- How long it might take to recover their initial investment.
- How solar adoption can reduce carbon emissions.

The lack of accessible and understandable solar feasibility information makes it difficult for people to make informed decisions.

## 💡 Our Solution

SolarScope provides an interactive platform where users can search for an address, view satellite imagery, select their rooftop area, and explore estimated solar energy generation, financial savings, investment recovery, and environmental benefits.

The application transforms complex solar feasibility calculations into an easy-to-understand visual experience.

## ✨ Features

- **Interactive Satellite Map:** Explore locations using Esri satellite imagery.
- **Address Search:** Find locations using address search functionality.
- **Rooftop Selection:** Draw, edit, and delete rooftop polygons directly on the map.
- **Rooftop Area Calculation:** Calculate the selected rooftop area using Turf.js.
- **Solar Energy Estimation:** Estimate potential electricity generation based on rooftop area and solar assumptions.
- **Financial Analysis:** Explore estimated electricity savings and investment costs.
- **ROI Estimation:** Calculate the estimated investment payback period.
- **Environmental Impact:** Estimate potential CO₂ emissions avoided through solar energy.
- **Interactive Controls:** Adjust investment assumptions and explore how they affect the results.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Development server and build tool |
| JavaScript | Application logic and calculations |
| Leaflet.js | Interactive map functionality |
| React Leaflet | React integration for Leaflet |
| Esri Satellite Imagery | Satellite map tiles |
| Nominatim | Address search and geocoding |
| Leaflet Draw | Drawing and editing rooftop polygons |
| Turf.js | Geospatial area calculations |
| CSS | Styling and responsive interface |

## ⚙️ How It Works

1. **Search Location:** Enter an address to locate a building.
2. **View Satellite Map:** Explore the selected location using satellite imagery.
3. **Select Rooftop:** Draw a polygon around the rooftop area.
4. **Calculate Area:** The application calculates the selected rooftop's area.
5. **Estimate Solar Potential:** Solar generation is estimated using the rooftop area and predefined assumptions.
6. **Analyze Financial Benefits:** View estimated savings, installation investment, and payback period.
7. **Explore Environmental Benefits:** Understand the potential reduction in CO₂ emissions.

## 🚀 Getting Started

Follow these steps to run SolarScope locally.

### Prerequisites

- Node.js
- npm
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

**2. Navigate to the project directory**

```bash
cd solarscope-react
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Visit the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 📊 Calculations & Assumptions

SolarScope uses rooftop area and predefined solar assumptions to estimate:

- Potential solar electricity generation.
- Estimated electricity bill savings.
- Initial installation investment.
- Return on investment and payback period.
- Potential CO₂ emissions avoided.

**Note:** The current prototype uses illustrative solar assumptions and calculations. Its estimates are not based on a live, location-specific solar irradiance API and should not be treated as professional installation or financial advice.

Actual results may vary depending on rooftop orientation, shading, weather conditions, panel efficiency, local electricity tariffs, and installation costs.

## 🔮 Future Improvements

- Integration with real-time solar irradiance and weather datasets.
- More accurate location-specific solar generation predictions.
- Rooftop shading and orientation analysis.
- Integration with PVWatts or similar solar estimation APIs.
- More detailed installation cost and financial analysis.
- User accounts and saved rooftop assessments.
- Improved mobile responsiveness and accessibility.

## 🌱 Impact

SolarScope aims to encourage renewable energy adoption by making solar feasibility information easier to understand.

By helping individuals explore their rooftops' solar potential, the project supports:

- Increased awareness of renewable energy.
- Reduced dependence on conventional energy sources.
- Potential reduction in carbon emissions.
- More sustainable residential and urban development.

## 👥 Contributors

Developed as a sustainability-focused software project under the theme **Innovate for a Better Future**.

## 📄 License

This project is developed for educational and demonstration purposes. A formal open-source license can be added to the repository if the project is intended for public reuse.

---

**SolarScope – Explore Your Rooftop. Discover Your Solar Potential. ☀️**
