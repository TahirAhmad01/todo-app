import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useState } from "react";
import "../firebase/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [userInfo, setInfo] = useState({
    name: "",
    email: "",
    profileIco: "",
  });
  const [error, setError] = useState("");

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const GoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // console.log({ user });
        setInfo({
          name: user.displayName,
          email: user.email,
          profileIco: user.photoURL,
        });
        setLogin(true);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(errorMessage);
      });
  };

  function logout() {
    signOut(auth)
      .then((res) => {
        // Sign-out successful.
        setLogin(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(errorMessage);
      });
  }

  const value = {
    GoogleLogin,
    logout,
    login,
    userInfo,
    error,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};
