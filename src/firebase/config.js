import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfigOptions = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_ID,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
};
console.log("Firebase Init Config:", firebaseConfigOptions);

const firebaseApp = initializeApp(firebaseConfigOptions);

// Initialize Realtime Database and get a reference to the service
getDatabase(firebaseApp);

export const messaging = typeof window !== "undefined" ? getMessaging(firebaseApp) : null;

export const requestFCMToken = async () => {
  if (!messaging) return null;
  try {
    // Force register the new service worker explicitly
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      updateViaCache: 'none'
    });
    
    // Attempt to update immediately to clear the broken old one
    await registration.update();

    const currentToken = await getToken(messaging, {
      vapidKey: "BJmSLOGMd4ZUGYcobJ2Y3TWUcE4wXyYaifg6LSWbVWTcweyFCvcpTt0oj8ZP_Kp94PkbEwbw9dNP627iQoytfgA",
      serviceWorkerRegistration: registration
    });
    
    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
    // Extra debugging: What exactly failed?
    console.error('Check if your Firebase Config is missing values:', firebaseConfigOptions);
    return null;
  }
};

export const setupMessageListener = () => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log("🔥 Foreground message received!!!", payload);
    
    // Sometimes payload.notification is missing if sent as data-only msg
    const title = payload?.notification?.title || payload?.data?.title || "New Notification";
    const options = {
      body: payload?.notification?.body || payload?.data?.body || "You have a new message.",
      icon: "/vite.svg"
    };

    // Use Service Worker to show notification (more reliable than standard new Notification() on Chrome/MacOS)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  });
};

export default firebaseApp;
