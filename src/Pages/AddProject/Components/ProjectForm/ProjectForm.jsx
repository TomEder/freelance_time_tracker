import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addNewProject } from "../../../../Services/FirebaseService"; // Import service function
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // Import the arrow icon

const ProjectForm = () => {
  const [projectName, setProjectName] = useState("");
  const [hourlyPay, setHourlyPay] = useState("");
  const [currency, setCurrency] = useState("SEK"); // Default currency to "SEK"
  const [selectedColor, setSelectedColor] = useState(null);
  const navigate = useNavigate();

  // Available colors
  const colors = [
    { id: 1, colorCode: "#EF812C" },
    { id: 2, colorCode: "#33B58E" },
    { id: 3, colorCode: "#A1299F" },
    { id: 4, colorCode: "#BE0707" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!projectName || !hourlyPay || !selectedColor) {
      alert("Please fill in all fields and select a color.");
      return;
    }

    // Add project via service
    try {
      const newProject = {
        name: projectName,
        payPerHour: Number(hourlyPay),
        bgColor: selectedColor, // Save selected color
        earnings: 0, // Default earnings to 0
        hours: 0, // Default hours to 0
        todayTime: 0,
        weekTime: 0,
        monthTime: 0,
        lastSession: 0,
        billingPeriod: [], // Empty array for billing period by default
      };

      // Call service to add the new project
      await addNewProject(newProject);
      navigate("/home"); // Redirect to Home after adding project
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Back button using FontAwesome */}
      <button onClick={() => navigate("/home")} className="text-white mb-4">
        <FontAwesomeIcon icon={faArrowLeft} size="2x" /> {/* Back arrow */}
      </button>

      <h1 className="text-white text-2xl font-bold mb-20">Add a new project</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        {/* Project name input */}
        <input
          type="text"
          placeholder="Project name..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="p-2 rounded bg-gray-300 text-gray-700 w-72"
        />

        {/* Hourly pay input */}
        <input
          type="number"
          placeholder="Hourly pay..."
          value={hourlyPay}
          onChange={(e) => setHourlyPay(e.target.value)}
          className="p-2 rounded bg-gray-300 text-gray-700 w-72"
        />

        {/* Currency select input */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="p-2 rounded bg-gray-300 text-gray-700 w-72"
        >
          <option value="SEK">SEK</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        {/* Project color selection */}
        <div className="text-white mt-4">Project colour</div>
        <div className="flex gap-4 mt-2">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => setSelectedColor(color.id)}
              style={{
                backgroundColor: color.colorCode,
                border: selectedColor === color.id ? "2px solid #FFF" : "none",
              }}
              className="w-12 h-12 rounded-full focus:outline-none"
            />
          ))}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Add project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
