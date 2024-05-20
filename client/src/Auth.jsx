import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  let isAdmin = false;
  let userId = "";
  let batchId = "";
  let username = "";
  let role = "";

  const storeTokenInLS = (serverToken) => {
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
  };

  const isLoggedIn = !!token;
  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.isAdmin;
    userId = decoded.userId;
    username = decoded.name;
    role = decoded.role;
    batchId = decoded.batchId;

    console.log(decoded);
  }

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
    isAdmin = false;
    accountType = "";
    batchId = "";
    name = "";
    userId = "";
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        userId,
        role,
        batchId,
        username,
        storeTokenInLS,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
