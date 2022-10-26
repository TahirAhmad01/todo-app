import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { createContext, useContext, useEffect, useState } from "react";
import "../firebase/config";

const AuthContext = createContext();

// const cookies = new Cookies()
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [todoList, setTodoList] = useState([]);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  //google auth login function
  const GoogleLogin = async () => {
    await signInWithPopup(auth, provider)
      .then((res) => {
        console.log("login success");
        setError("");
        const getTodo = localStorage.getItem("TodoList");
        const parseTodo = JSON.parse(getTodo);
        const userId = res.user.uid;

        const db = getDatabase();
        const dbRef = ref(getDatabase());

        get(child(dbRef, `todos/${userId}`))
          .then((snapshot) => {
            if (snapshot.exists() && getTodo !== null) {
              const data = [...snapshot.val(), ...parseTodo];
              set(ref(db, "todos/" + userId), data)
                .then(() => {
                  localStorage.setItem(
                    "TodoList",
                    JSON.stringify(snapshot.val())
                  );
                  setTodoList(data);
                  console.log(snapshot.val());
                })
                .catch((err) => console.log(err));
            } else if (snapshot.exists() && getTodo === null) {
              localStorage.setItem("TodoList", JSON.stringify(snapshot.val()));
              setTodoList(snapshot.val());
            } else {
              set(ref(db, "todos/" + userId), JSON.parse(getTodo));
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  //logout function
  function logout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("TodoList");
        setTodoList([]);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  }

  const value = {
    GoogleLogin,
    logout,
    error,
    currentUser,
    todoList,
    setTodoList,
  };

  return (
    <>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </>
  );
};
