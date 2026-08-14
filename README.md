#  Weather App

A responsive weather dashboard built with **React, TypeScript, Vite, and OpenWeatherMap API**.

The application allows users to search for cities, view current weather conditions, check hourly and daily forecasts, save favourite cities, switch between light and dark themes, change temperature units, and use their current location to load local weather.

##  Features

*  Search weather by city
*  Get weather using the user's current location
*  Current temperature and feels-like temperature
*  Humidity information
*  Wind speed
*  Atmospheric pressure
*  Visibility
*  Sunrise and sunset times
*  Chance of rain
*  Hourly forecast
*  Daily forecast
*  Save favourite cities
*  Remove saved cities
*  Light and dark theme
*  Celsius / Fahrenheit toggle
*  Responsive design for desktop, tablet and mobile
* Local storage caching
*  Offline fallback using cached weather data
* Browser notification support for weather alerts
*  Current-location button
*  Loading states
*  Error handling

## Technologies

### Frontend

 **React**
 **TypeScript**
 **Vite**
 **CSS**
 **Axios**

### APIs

 **OpenWeatherMap API**

   Current weather
   5-day / 3-hour forecast
   Weather-related data

### Browser APIs

 `localStorage`
 Geolocation API
 Notifications API

##  Project Structure

```text
weather-app/
│
├── src/
│   ├── components/
│   │   ├── DailyForecast.tsx
│   │   ├── DisplayWeather.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── Loading.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── WeatherAlerts.tsx
│   │   ├── WeatherHighlights.tsx
│   │   └── WeatherInfo.tsx
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useNotification.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Lutricia-The-Coder/weather-app.git
```

### 2. Enter the project

```bash
cd weather-app
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your environment file

Create a `.env` file in the project root:

```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

Replace:

```text
your_openweathermap_api_key
```

with your OpenWeatherMap API key.

### 5. Start the development server

```bash
npm run dev
```

Vite will start the development server, normally at:

```text
http://localhost:5173
```

## Environment Variables

The application uses the following environment variable:

| Variable               | Description            |
| ---------------------- | ---------------------- |
| `VITE_WEATHER_API_KEY` | OpenWeatherMap API key |

###  Important

Do **not** commit your `.env` file to GitHub.

Make sure `.env` is included in `.gitignore`:

```gitignore
.env
.env.local
```

If an API key has already been pushed publicly, regenerate/revoke that key through your API provider.

## Temperature Units

The application supports:

 Celsius (`°C`)
 Fahrenheit (`°F`)

The selected unit is stored in `localStorage`, so the user's preference can persist between sessions.

##  Themes

The dashboard supports:

 Light mode
 Dark mode

The selected theme is also saved using `localStorage`.

##  Local Storage

The application uses a custom `useLocalStorage` hook to persist application data.

Currently stored information includes:

```text
cachedWeather
cachedForecast
savedCities
theme
unit
```

This allows the application to preserve user preferences and provide cached weather data when a request cannot be completed.

##  Location

The application uses the browser's Geolocation API when available.

When location access is available, the application attempts to load weather using the user's coordinates.

If location access is unavailable or fails, the application falls back to:

```text
Polokwane
```

Users can also manually search for another city.

##  Forecasts

The forecast interface supports two views:

### Hourly

Displays upcoming forecast entries in a horizontally scrollable layout.

### Daily

Groups forecast data by date and displays daily temperature information.

Users can switch between the two views using the forecast controls.

##  Notifications

The application includes browser notification support through the Notifications API.

Notifications are triggered when weather alert data is available and browser notification permission has been granted.

Users must allow notifications in their browser for this feature to work.

If notification permission has previously been blocked, it may need to be reset through the browser's site permissions.

##  Weather Alerts

The application includes a `WeatherAlerts` component designed to display:

 Alert event
 Issuing organization
 Start time
 End time
 Alert description

The alert section can be expanded or hidden by the user.

> Weather alert availability depends on the API data and the OpenWeatherMap services enabled for the API key.

##  Responsive Design

The dashboard includes responsive CSS for:

 Desktop
 Tablet
 Mobile
 Small mobile screens

The forecast cards and highlights grid adapt to smaller screen sizes.

##  Custom Hooks

### `useLocalStorage`

Provides React state that is synchronized with browser `localStorage`.

Example:

```tsx
const [theme, setTheme] =
  useLocalStorage<"light" | "dark">("theme", "light");
```

### `useNotification`

Handles browser weather notifications based on the current alert data.

Example:

```tsx
useNotification(alerts);
```

##  Error Handling

The application handles several failure scenarios:

 Missing API key
 Failed weather requests
 Failed forecast requests
 Geolocation failure
 Location permission denial
 API timeouts
 Offline requests
 Missing cached data

When possible, previously cached weather information is displayed instead of leaving the dashboard empty.

##  API Key Security

The API key is loaded through Vite:

```tsx
const apiKey =
  import.meta.env.VITE_WEATHER_API_KEY;
```

Never hard-code the API key directly into source files.

Also avoid committing:

```text
.env
```

to the repository.

##  Build for Production

Create a production build with:

```bash
npm run build
```

Preview the production build with:

```bash
npm run preview
```

##  Git Workflow

After making changes:

```bash
git status
```

Stage the files:

```bash
git add .
```

Create a commit:

```bash
git commit -m "Update weather dashboard"
```

Push to GitHub:

```bash
git push origin main
```

If GitHub asks for authentication, use an appropriate GitHub authentication method such as GitHub CLI, SSH, or a personal access token rather than your GitHub account password.

##  Current Status

The project currently includes the main weather dashboard functionality, responsive layout, saved cities, themes, temperature units, forecasts, caching, geolocation, and notification support.

Weather alert functionality depends on the availability and authorization of the relevant OpenWeatherMap alert service for the API account.

##  Author

**Lutricia-The-Coder**

GitHub:

https://github.com/Lutricia-The-Coder


