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
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
          <div className="text-sm font-medium text-slate-500">Loading...</div>
        </div>
      )}

      {currentUser !== null ? (
        <>
          <div className="flex items-center gap-3">
            <div className="rounded-full overflow-hidden h-9 w-9 border-2 border-slate-200">
              <img
                src={photoURL}
                alt="userImage"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 px-1">
                {displayName}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleLogOut}
                disabled={loading2}
                className="bg-white text-slate-700 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading2 ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={handleClick}
            className="bg-white text-slate-700 px-4 py-2.5 rounded-lg font-semibold border border-slate-200 transition-all duration-200 shadow-sm hover:cursor-pointer hover:bg-slate-50 hover:border-slate-300"
          >
            Login with google
          </button>
        </>
      )}
      {/* {error && error} */}
    </>
  );
}

export default GoogleLogin;
