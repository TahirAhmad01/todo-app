# React Todo App 📝

A modern, feature-rich Todo application built with React, Vite, Tailwind CSS, and powered by Firebase & local storage. The app features task management, push notifications (reminders), dark mode, search functionalities, and an interactive UI utilizing Material UI components.

## ✨ Features
- **Task Management**: Add, View, Edit, and Delete tasks. 
- **Detailed Tasks**: Easily add descriptions, dates, and specific times to your routines.
- **Reminders / Push Notifications**: Set a time for an upcoming task and get notified!
- **Categorization**: Filter tasks by *Today, Upcoming, Completed, and All*.
- **Firebase Sync & Local Storage**: Automatically synchronize data to a Firebase DB when logged in, or securely rely on Local Storage if used anonymously.
- **Searchable**: Search through tasks to find exactly what you're looking for with an automated modal.
- **Dark Mode**: fully responsive Dark / Light mode toggle.
- **Responsive UI**: A fully mobile-friendly Sidebar and modern layout. 

## 🛠️ Technology Stack
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) (For ultra-fast builds)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Material UI (@mui/material)](https://mui.com/)
- **Backend & Auth**: [Firebase v12](https://firebase.google.com/)
- **Utilities**: moment.js for date-time management.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (version 18+ recommended) and npm/yarn installed. 

### Installation
Clone this repository and run the installation script in the project root:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### Environment Configuration (Firebase)
If you want to sync tests to real Firebase DB, create a `.env` file in the root configuration with your API details:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
Make sure `src/firebase/config.js` properly mirrors your variables.

### Running the App locally
To start the Vite development server:
```bash
npm start
# or npm run dev depending on custom scripts... Note: we use `npm start` which runs `vite`

# Alternatively
yarn start
```
The app should now be running at [http://localhost:5173](http://localhost:5173).

## 📦 Building for Production

Compile optimized production-ready files to a `dist` directory:

```bash
npm run build
# or
yarn build
```

### Preview the Build

You can preview the optimized build locally:
```bash
npm run preview
# or
yarn preview
```

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request
