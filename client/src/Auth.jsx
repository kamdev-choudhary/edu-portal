import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();
const SECRET_KEY = import.meta.env.VITE_REACT_APP_SECRET_KEY;
const cipherText = CryptoJS.AES.encrypt("token", SECRET_KEY);
const bytesText = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
const originalText = bytesText.toString(CryptoJS.enc.Utf8);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(originalText));
  let isAdmin = false;
  let userId = "";
  let batchId = "";
  let username = "";
  let role = "";

  const storeTokenInLS = (serverToken) => {
    const cipherToken = CryptoJS.AES.encrypt(serverToken, SECRET_KEY);
    localStorage.setItem(cipherText, cipherToken);
    const bytesToken = CryptoJS.AES.decrypt(cipherToken, SECRET_KEY);
    const originalToken = bytesToken.toString(CryptoJS.enc.Utf8);
    setToken(originalToken);
  };

  const isLoggedIn = !!token;
  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.isAdmin;
    userId = decoded.userId;
    username = decoded.name;
    role = decoded.role;
    batchId = decoded.batchId;
  }

  const logoutUser = () => {
    localStorage.removeItem(cipherText);
    setToken("");
    isAdmin = false;
    role = "";
    batchId = "";
    username = "";
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
