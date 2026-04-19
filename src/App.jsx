// import "placeholder-loading/dist/css/placeholder-loading.css";
import "placeholder-loading/dist/css/placeholder-loading.min.css";
import { useEffect } from "react";
import { AuthProvider } from "./context/authContext";
import Home from "./pages/home";
import "./index.css";
import { requestFCMToken, setupMessageListener } from "./firebase/config";

// FCM code restored
function App() {
  useEffect(() => {
    const initializeFCM = async () => {
      const token = await requestFCMToken();
      if (token) {
        console.log("🔥 YOUR FCM TOKEN FOR TESTING IS:");
        console.log(token);
      }
      setupMessageListener();
    };

    initializeFCM();
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
