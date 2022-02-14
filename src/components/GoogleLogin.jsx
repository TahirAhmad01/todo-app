import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "../firebase/config";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const GoogleLogin = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log({ user });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};
