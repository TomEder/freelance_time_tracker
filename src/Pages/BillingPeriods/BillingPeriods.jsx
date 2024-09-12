import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProject } from "../../Services/FirebaseService"; // Import Firebase service for fetching project

const BillingPeriods = () => {
  const { id } = useParams(); // Get project ID from the URL
  const [billingPeriods, setBillingPeriods] = useState([]);
  const [error, setError] = useState(null); // State to store error message
  const navigate = useNavigate(); // To navigate programmatically

  useEffect(() => {
    const fetchBillingPeriods = async () => {
      try {
        const projectData = await fetchProject(id); // Use Firebase service to fetch project data
        if (
          projectData &&
          projectData.billingPeriod &&
          Array.isArray(projectData.billingPeriod)
        ) {
          setBillingPeriods(projectData.billingPeriod);
        } else {
          setError("No billing periods found in this project.");
        }
      } catch (err) {
        setError("An error occurred while fetching the project data.");
        console.error("Error fetching billing periods:", err);
      }
    };

    fetchBillingPeriods();
  }, [id]);

  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month - 1];
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <h1 className="text-white text-2xl font-bold mb-4">Billing Periods</h1>

      <div className="bg-blue-800 p-4 rounded-lg">
        {error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : billingPeriods.length > 0 ? (
          <ul>
            {billingPeriods.map((period, index) => (
              <li key={index} className="text-white text-lg">
                Billing Period {getMonthName(period.month)} {period.year}:{" "}
                {(period.hours || 0).toFixed(1)} hours, Earned:{" "}
                {(period.earnings || 0).toFixed(2)} kr
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white text-lg">No billing periods found.</p>
        )}
      </div>

      <button
        onClick={() => navigate(-1)} // Navigate back to the project page
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Back to Project
      </button>
    </div>
  );
};

export default BillingPeriods;
