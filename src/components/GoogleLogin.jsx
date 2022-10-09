import { useState } from "react";
import swal from "sweetalert";
import { useAuth } from "../context/authContext";

function GoogleLogin() {
  const { GoogleLogin, logout, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const { displayName, photoURL } = currentUser || {};

  const handleClick = async () => {
    try {
      setLoading(true);
      await GoogleLogin();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const logout_con = async () => {
    setLoading2(true);
    await logout();
    setLoading2(false);
    swal("Logout Successful", {
      icon: "success",
    });
  };

  const handleLogOut = () => {
    swal({
      title: "Are you sure?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        logout_con();
      } else {
      }
    });
  };

  return (
    <>
      {loading && (
        <div className="holder">
          <div className="preloader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {currentUser !== null ? (
        <>
          <div className="userInfo">
            <div className="image">
              <img src={photoURL} alt="userImage" />
            </div>
            <div>
              <div className="userName">{displayName}</div>
            </div>

            <div className="user_bar">
              {/* <button onClick={logout} className="logout_btn"> */}
              <button onClick={handleLogOut} className="logout_btn">
                {loading2 ? (
                  "loading"
                ) : (
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <button onClick={handleClick} className="google_btn">
            Login with google
          </button>
        </>
      )}
      {/* {error && error} */}
    </>
  );
}

export default GoogleLogin;
