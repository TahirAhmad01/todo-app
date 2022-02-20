import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import "../firebase/config";

const AuthContext = createContext();
const hasLogin = localStorage.getItem("todoList");
// const cookies = new Cookies()
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [error, setError] = useState(false);
  const [userInfo, setInfo] = useState({
    name: "",
    email: "",
    profileIco: "",
  });

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  //google auth login function
  const GoogleLogin = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const userObj = {
          name: displayName,
          email: email,
          userImg: photoURL,
          login: true,
        };
        setLogin(true);
        localStorage.setItem("todoList", JSON.stringify(userObj));
        const hasLogin2 = localStorage.getItem("todoList");
        const obj2 = JSON.parse(hasLogin2);
        setInfo({
          name: obj2.name,
          email: obj2.email,
          profileIco: obj2.userImg,
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.log(errorMessage);
      });
  };
  //login check & set userData
  useEffect(() => {
    if (hasLogin) {
      const obj = JSON.parse(hasLogin);
      if (obj.login === true) {
        setLogin(true);
        setInfo({
          name: obj.name,
          email: obj.email,
          profileIco: obj.userImg,
        });
      } else {
        return;
      }
    } else {
      return;
    }
  }, []);

  //logout function
  function logout() {
    signOut(auth)
      .then((res) => {
        // Sign-out successful.
        setLogin(false);
        localStorage.removeItem("todoList");
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
