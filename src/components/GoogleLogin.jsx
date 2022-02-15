import React, { useState } from "react";
import { useAuth } from "../context/authContext";

function GoogleLogin() {
  const { GoogleLogin, login, logout, userInfo, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const userIco = userInfo.profileIco;

  const handleClick = async () => {
    try {
      setLoading(true);
      await GoogleLogin();
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div class="holder">
          <div class="preloader">
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
      ) : login === true ? (
        <>
          <div className="userInfo">
            <div className="image">
              <img src={userIco} alt="userImage" />
            </div>
            <div>
              <div className="userName">{userInfo.name}</div>
            </div>

            <div className="user_bar">
              <button onClick={logout} className="logout_btn">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
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
      {error && error.errorMessage}
    </>
  );
}

export default GoogleLogin;
