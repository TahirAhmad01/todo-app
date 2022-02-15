import React, { useState } from "react";
import { useAuth } from "../context/authContext";

function GoogleLoginBtn() {
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
        "loading"
      ) : login === true ? (
        <>
          <div className="userInfo">
            <div>
              <div style={{ fontWeight: "bold" }}>{userInfo.name}</div>
              <div>{userInfo.email}</div>
            </div>

            <div className="image">
              <img src={userIco} alt="userImage" />
            </div>
          </div>
          <div className="user_bar">
            <button onClick={logout}>Logout</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={handleClick}>Google Login</button>
        </>
      )}
      {error && error.errorMessage}
    </>
  );
}

export default GoogleLoginBtn;
