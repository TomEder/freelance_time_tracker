import React from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user); // Store user info in state if needed
      navigate("/home"); // Redirect to the Home page after successful login
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login Page</h1>
      <button
        onClick={loginWithGoogle}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Sign in with Google
      </button>

      <button
        onClick={logout}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default LoginPage;
