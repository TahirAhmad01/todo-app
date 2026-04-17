importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

// Using the actual values since import.meta.env doesn't work in standard Service Workers
const firebaseConfig = {
  apiKey: "AIzaSyDehQvrDcB74Xq_dK0c0m_pIxA3JxwEFwU",
  authDomain: "todo-49c81.firebaseapp.com",
  projectId: "todo-49c81",
  storageBucket: "todo-49c81.appspot.com",
  messagingSenderId: "285362981289",
  appId: "1:285362981289:web:8a49b5c4e18c86b1921cb8",
  databaseURL: "https://todo-49c81-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  
  const notificationTitle = payload?.notification?.title || payload?.data?.title || "Background Notification";
  const notificationOptions = {
    body: payload?.notification?.body || payload?.data?.body || "Tap to open",
    icon: "/vite.svg"
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
