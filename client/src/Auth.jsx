import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();

const SECRET_KEY = import.meta.env.VITE_REACT_APP_SECRET_KEY;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const encryptedToken = localStorage.getItem("authToken");
    if (encryptedToken) {
      try {
        const decryptedToken = CryptoJS.AES.decrypt(
          encryptedToken,
          SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);
        return decryptedToken;
      } catch (error) {
        console.error("Token decryption failed:", error);
        return "";
      }
    }
    return "";
  });

  const storeTokenInLS = (serverToken) => {
    try {
      const cipherToken = CryptoJS.AES.encrypt(
        serverToken,
        SECRET_KEY
      ).toString();
      localStorage.setItem("authToken", cipherToken);
      setToken(serverToken);
    } catch (error) {
      console.error("Token encryption failed:", error);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    setToken("");
  };

  const decodedToken = token ? jwtDecode(token) : {};
  const isAdmin = decodedToken.isAdmin || false;
  const userId = decodedToken.userId || "";
  const username = decodedToken.name || "";
  const role = decodedToken.role || "";
  const batchId = decodedToken.batchId || "";

  const isLoggedIn = !!token;

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
