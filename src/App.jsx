// import "placeholder-loading/dist/css/placeholder-loading.css";
import "placeholder-loading/dist/css/placeholder-loading.min.css";
import { useEffect } from "react";
import { AuthProvider } from "./context/authContext";
import Home from "./pages/home";
import "./index.css";
// import { requestFCMToken, setupMessageListener } from "./firebase/config";
import { subscribeToWebPush } from "./webPush";

function App() {
  useEffect(() => {
    // const initializeFCM = async () => {
    //   const token = await requestFCMToken();
    //   if (token) {
    //     console.log("🔥 YOUR FCM TOKEN FOR TESTING IS:");
    //     console.log(token);
    //   }
    //   setupMessageListener();
    // };

    // initializeFCM();

    // Using vanilla web-push API
    subscribeToWebPush();
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <Home />
      </AuthProvider>
    </div>
  );
}

export default App;
