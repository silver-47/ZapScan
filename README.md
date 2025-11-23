# ⚡️ ZapScan

A fast, clean, and minimal QR code scanner built with **Expo**.
Scan QR instantly, view results clearly, and keep a tidy scan history; all in one lightweight app.

## 🚀 Features

- **Instant QR scanning** with haptic feedback
- **Auto-detect URL or text**
- **Torch mode** for low-light environments
- **In-app WebView** for URLs
- **Share scanned content**
- **History with filters (All / URL / Text)**
- **Swipe to delete** items
- **Dark & Light themes** system support

## 📦 Download the APK

⬇️ [**Download ZapScan APK**](https://github.com/silver-47/ZapScan/releases/download/v1.0.0/ZapScan.apk) _v1.0.0_

## 🎥 Demo Video

<a href="./content/DemoVideo.mp4">
  <img src="./content/DemoVideoThumbnail.png" width="128" />
</a>

## 🖼️ Screenshots

### 🌙 Dark Mode

|                                                   |                                               |                                               |
| ------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| ![No Permission Dark](./content/Screenshot1D.png) | ![Home Dark](./content/Screenshot2D.png)      | ![Result Dark](./content/Screenshot3D.png)    |
| ![History1 Dark](./content/Screenshot41D.png)     | ![History2 Dark](./content/Screenshot42D.png) | ![History3 Dark](./content/Screenshot43D.png) |

### 🌞 Light Mode

|                                                    |                                                |                                                |
| -------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| ![No Permission Light](./content/Screenshot1L.png) | ![Home Light](./content/Screenshot2L.png)      | ![Result Light](./content/Screenshot3L.png)    |
| ![History1 Light](./content/Screenshot41L.png)     | ![History2 Light](./content/Screenshot42L.png) | ![History3 Light](./content/Screenshot43L.png) |

## 🛠️ How to Run Locally

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Install & Run the app on device (Development)

```bash
npx expo run:android
```

## 📦 Building the APK

### 1️⃣ Prebuild

```bash
npx expo prebuild -p android --clean
```

### 2️⃣ Build APK (Release)

```bash
cd android && (./gradlew clean && ./gradlew assembleRelease); cd ..
```

### (OR) 2️⃣ Install & Run the app on device (Release)

```bash
npx expo run:android --variant release
```
