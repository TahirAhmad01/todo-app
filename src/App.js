// import "../node_modules/placeholder-loading/src/scss/placeholder-loading";
import "../node_modules/placeholder-loading/src/scss/placeholder-loading.scss";
import { AuthProvider } from "./context/authContext";
import Home from "./pages/home";
import "./style/style.scss";

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
