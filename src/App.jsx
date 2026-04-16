// import "placeholder-loading/dist/css/placeholder-loading.css";
import "placeholder-loading/dist/css/placeholder-loading.min.css";
import { AuthProvider } from "./context/authContext";
import Home from "./pages/home";
import "./index.css";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Home />
      </AuthProvider>
    </div>
  );
}

export default App;
