import React from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "../../firebase"; // Adjust path to your Firebase setup
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore"; // For Firestore

const LoginPage = () => {
  const navigate = useNavigate();

  // Create or update the user document in Firestore
  const createUserDocument = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // If the user document doesn't exist, create it
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
      });
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User:", user);

      // Create or update the user document
      await createUserDocument(user);

      // Navigate to the home page after login
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // After logout, redirect to the login page
        navigate("/login");
      })
      .catch((error) => console.error("Logout error:", error));
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
