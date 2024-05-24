import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";

export const AuthContext = createContext();

const SECRET_KEY = import.meta.env.VITE_REACT_APP_SECRET_KEY;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  let isAdmin = false;
  let userId = "";
  let batchId = "";
  let username = "";
  let role = "";

  useEffect(() => {
    const encryptedToken = localStorage.getItem(
      "U2FsdGVkX188nvX2R3IWq6waxgAir8t97XO7cGnUvY8"
    );
    if (encryptedToken) {
      try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
        const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
        setToken(decryptedToken);
      } catch (error) {
        console.error("Failed to decrypt token:", error);
        setToken(null);
      }
    }
  }, []);

  const storeTokenInLS = (serverToken) => {
    const cipherToken = CryptoJS.AES.encrypt(serverToken, SECRET_KEY);
    localStorage.setItem(
      "U2FsdGVkX188nvX2R3IWq6waxgAir8t97XO7cGnUvY8",
      cipherToken
    );
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
  }

  const logoutUser = () => {
    localStorage.removeItem("U2FsdGVkX188nvX2R3IWq6waxgAir8t97XO7cGnUvY8");
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
