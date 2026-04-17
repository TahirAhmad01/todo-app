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
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading...
          </div>
        </div>
      )}

      {currentUser !== null ? (
        <div className="flex items-center justify-between gap-3 w-full py-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="rounded-full overflow-hidden h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName || "User"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <span
                className={
                  photoURL
                    ? "hidden"
                    : "flex w-full h-full items-center justify-center"
                }
              >
                {displayName ? displayName.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {displayName || "User"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentUser.email || ""}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogOut}
            disabled={loading2}
            title="Logout"
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200 disabled:opacity-50 shrink-0"
          >
            {loading2 ? (
              <span className="text-xs">...</span>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            )}
          </button>
        </div>
      ) : (
        <div className="w-full font-semibold">
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-3 bg-[#4285F4] hover:bg-[#3367d6] text-white px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="bg-white p-1 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            Sign in with Google
          </button>
        </div>
      )}
      {/* {error && error} */}
    </>
  );
}

export default GoogleLogin;
