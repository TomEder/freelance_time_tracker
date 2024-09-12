import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the arrow icon

const ProjectHeader = ({ project }) => {
  const navigate = useNavigate();

  const getColor = (bgColor) => {
    switch (bgColor) {
      case 1:
        return "#91511F"; // Color 1
      case 2:
        return "#037C58"; // Color 2
      case 3:
        return "#721A70"; // Color 3
      case 4:
        return "#671313"; // Color 4
      default:
        return "#333"; // Default color if no valid bgColor is found
    }
  };

  return (
    <div
      className="p-4 rounded-b-lg shadow-md"
      style={{ backgroundColor: getColor(project.bgColor) }} // Use project bgColor or default
    >
      <button
        onClick={() => navigate("/home")}
        className="text-white mb-4 text-sm"
      >
        <FontAwesomeIcon icon={faArrowLeft} size="2x" /> {/* Back arrow */}
      </button>
      <h3 className="text-white text-sm font-bold">Project</h3>
      <h1 className="text-white text-3xl mb-4 font-bold">{project.name}</h1>
      <hr />
      <div className="flex justify-around">
        <div className="p-4 rounded-lg text-center">
          <h4 className="text-gray-300 text-sm">Hourly pay</h4>
          <p className="text-white text-2xl font-bold">
            {project.payPerHour}kr
          </p>
        </div>
        <div className="p-4 rounded-lg text-center">
          <h4 className="text-gray-300 text-sm">Total earnings</h4>
          <p className="text-white text-2xl font-bold">{project.earnings}kr</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
