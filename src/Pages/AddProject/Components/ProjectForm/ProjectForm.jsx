import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firestore setup
const db = getFirestore();

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

    // Add project to Firestore (without currency)
    try {
      const newProject = {
        name: projectName,
        payPerHour: Number(hourlyPay),
        bgColor: selectedColor, // Save selected color
        earnings: 0, // Default earnings to 0
        hours: 0, // Default hours to 0
      };
      await addDoc(collection(db, "projects"), newProject);
      navigate("/Home"); // Redirect to Home after adding project
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center p-4">
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
