import React from "react";
import UserContainer from "./Components/UserContainer/UserContainer";
import ProjectsList from "./Components/ProjectsList/ProjectsList";
import plusIcon from "../../Images/plus-solid.svg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const goToAddProject = () => {
    navigate("/add-project"); // Navigate to the AddProject page
  };

  return (
    <div className="bg-[#171718] min-h-screen relative">
      <UserContainer />

      {/* Plus Button */}
      <button
        className="bg-[#D35400] hover:bg-blue-700 text-white rounded-full p-4 w-14 h-14 flex items-center justify-center text-lg shadow-lg absolute mt-2 right-6"
        onClick={goToAddProject} // Navigate on click
      >
        <img src={plusIcon} alt="plus icon" />
      </button>

      <ProjectsList />
    </div>
  );
};

export default Home;
