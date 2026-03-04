
````markdown
# 🏫 Oakwood Campus Map App

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![React Version](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)  
[![Mapbox](https://img.shields.io/badge/Mapbox-GL-00bfff.svg)](https://www.mapbox.com/)  
[![Ionic](https://img.shields.io/badge/Ionic-React-5050f0.svg)](https://ionicframework.com/)  

A fully interactive, mobile-friendly map application for **Oakwood University**! Explore campus buildings, see your location in real-time, save favorites, and navigate using Google Maps or Apple Maps.

---

## 🚀 Features

- **📍 Interactive Campus Map:** Explore all campus buildings and points of interest.
- **🟠 Pulsing User Marker:** Real-time location tracking with marker always on top.
- **⭐ Favorite Locations:** Save and manage your preferred campus buildings.
- **🗺️ Multiple Map Styles:** Switch between Dark, Light, Streets, and Satellite.
- **📋 Detailed Location Modal:** View name, category, description, hours, and extra info.
- **📱 Mobile Directions:** Open Google Maps (Android) or Apple Maps (iOS) for navigation.
- **💻 Responsive Design:** Works seamlessly on desktop, tablet, and mobile.
- **♿ Accessibility:** Keyboard-friendly, high contrast, and clear UI labels.

---

## 📸 Demo

### Web Interface

![Map Demo](./screenshots/map_demo.png)

### Mobile Interface

![Mobile Demo](./screenshots/mobile_demo.png)

> Tip: On mobile, tapping **Get Directions** opens native map apps.

---

## 🛠️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/oakwood-campus-map.git
cd oakwood-campus-map
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add Mapbox API Key

Create a `.env` file in the root directory:

```env
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

### 4️⃣ Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Usage

1. Allow location access to show your position on the map.
2. Click a campus marker to view building details.
3. Tap **Save** to add to favorites.
4. Tap **Get Directions** to open Google Maps (Android) or Apple Maps (iOS).
5. Switch map styles using the **style picker** in the top-left corner.

---

## 🧩 Project Structure

```
/src
  /components
    MapView.tsx      # Main map component with markers, modals, and style picker
  /types
    data.ts          # CampusLocation type definitions
  /pages
    Home.tsx         # App entry point, loads MapView and manages state
  App.tsx            # App container and routing
```

---

## 🖥️ Technologies

* **React + TypeScript** – Frontend framework with static typing
* **Ionic React** – Mobile-ready UI components
* **Mapbox GL JS** – Interactive, high-performance maps
* **Tailwind CSS** – Utility-first styling framework
* **Geolocation API** – Real-time user location
* **Google Maps / Apple Maps** – Mobile directions integration

---

## 📱 Mobile Deployment

1. Install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

2. Add platforms:

```bash
npx cap add android
npx cap add ios
```

3. Open project in Android Studio or Xcode to build APK/IPA files.

> ⚠️ Building for iOS requires a macOS machine with Xcode.

---

## 💡 Contributing

We welcome contributions!

1. Fork the repo
2. Create a feature branch:

```bash
git checkout -b feature/my-feature
```

3. Commit changes:

```bash
git commit -m "Add my feature"
```

4. Push to your branch:

```bash
git push origin feature/my-feature
```

5. Open a pull request on the main repository.

**Tips:**

* Follow TypeScript best practices
* Keep components modular
* Use Tailwind CSS utilities for styling
* Test on both web and mobile if possible

---

## 🌟 Future Improvements

* 🔍 Search for buildings by name or category
* ✅ Filter locations by type (Library, Academic, Dormitory, etc.)
* 📶 Offline map caching for mobile
* 🔔 Push notifications for campus events
* ♿ Enhanced accessibility for screen readers

---

## 📄 License

MIT License – see [LICENSE](LICENSE)

---

## 📬 Contact

* **Author:** Ramy Daniel Campusano Volquez
* **GitHub:** [yourusername](https://github.com/yourusername)
* **Email:** [your.email@example.com](mailto:your.email@example.com)
* **LinkedIn:** [Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgements

* [Mapbox](https://www.mapbox.com/) – Interactive maps
* [Ionic Framework](https://ionicframework.com/) – Mobile components
* [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling
* Inspiration from modern campus navigation apps

---

## 🔖 Badges & Highlights

* ⚡ **Fast, interactive map experience**
* 🌙 **Dark/Light mode ready**
* 🟢 **Always-visible pulsing user marker**
* 📱 **Mobile-first design**

