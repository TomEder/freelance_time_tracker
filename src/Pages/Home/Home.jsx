import React from "react";
import UserContainer from "./Components/UserContainer/UserContainer";
import ProjectsList from "./Components/ProjectsList/ProjectsList";

const Home = () => {
  return (
    <div className="bg-blue-950 min-h-screen relative">
      <UserContainer />

      {/* Plus Button */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center text-5xl shadow-lg absolute mt-2 right-6">
        +
      </button>

      <ProjectsList />
    </div>
  );
};

export default Home;
