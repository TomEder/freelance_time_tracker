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
    <div className="p-4 rounded-b-lg shadow-md bg-[#171718]">
      <button
        onClick={() => navigate("/home")}
        className="mb-4 text-sm"
        style={{ color: getColor(project.bgColor) }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="2x" /> {/* Back arrow */}
      </button>
      <h3
        className="text-sm font-bold"
        style={{ color: getColor(project.bgColor) }}
      >
        Project
      </h3>
      <h1
        className="text-3xl mb-4 font-bold"
        style={{ color: getColor(project.bgColor) }}
      >
        {project.name}
      </h1>
      <hr style={{ borderColor: getColor(project.bgColor) }} />
      <div className="flex justify-around">
        <div className="p-4 rounded-lg text-center">
          <h4 className="text-sm" style={{ color: getColor(project.bgColor) }}>
            Hourly pay
          </h4>
          <p
            className="text-2xl font-bold"
            style={{ color: getColor(project.bgColor) }}
          >
            {project.payPerHour}kr
          </p>
        </div>
        <div className="p-4 rounded-lg text-center">
          <h4 className="text-sm" style={{ color: getColor(project.bgColor) }}>
            Total earnings
          </h4>
          <p
            className="text-2xl font-bold"
            style={{ color: getColor(project.bgColor) }}
          >
            {project.earnings.toFixed(1)}kr
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
