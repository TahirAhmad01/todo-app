import React from "react";
import { useAuth } from "../context/authContext";

function GoogleLoginBtn() {
  const { GoogleLogin, login, logout, userInfo, error } = useAuth();
  const userIco = userInfo.profileIco;

  return (
    <>
      {login === true ? (
        <>
          <div className="userInfo">
            <div>
              <div style={{ fontWeight: "bold" }}>{userInfo.name}</div>
              <div>{userInfo.email}</div>
            </div>

            <div className="image">
              <img src={userIco} alt="user Image" />
            </div>
          </div>
          <div className="user_bar">
            <button onClick={logout}>Logout</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={GoogleLogin}>Google Login</button>
        </>
      )}
      {error && error.errorMessage}
    </>
  );
}

export default GoogleLoginBtn;
