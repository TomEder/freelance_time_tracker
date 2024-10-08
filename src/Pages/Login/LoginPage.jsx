import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signOutUser } from "../../Services/FirebaseService";
import LoginBG from "../../Images/LoginBG.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("User:", user);
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${LoginBG})` }}
    >
      <h1 className="text-3xl mb-6">FREELANCE TIME TRACKER</h1>
      <h4 className="mb-10">
        Let us keep time <br /> so you can focus <br /> on what you do best.
      </h4>
      <button
        onClick={loginWithGoogle}
        className="text-white py-2 px-4 w-72 rounded border-2 border-[#d35400] mt-32 mb-4"
      >
        LOG IN WITH GOOGLE
      </button>
      <button
        onClick={loginWithGoogle}
        className="text-white py-2 px-4 w-72 rounded border-2 border-[#d35400]"
      >
        LOG IN WITH EMAIL
      </button>
    </div>
  );
};

export default LoginPage;
