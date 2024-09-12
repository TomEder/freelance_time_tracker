import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signOutUser } from "../../Services/FirebaseService"; // Import the correct services

const LoginPage = () => {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle(); // Use the FirebaseService function
      console.log("User:", user);

      // Navigate to the home page after login
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser(); // Use the FirebaseService function
      navigate("/login"); // After logout, redirect to the login page
    } catch (error) {
      console.error("Logout error:", error);
    }
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
        onClick={handleLogout}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default LoginPage;
