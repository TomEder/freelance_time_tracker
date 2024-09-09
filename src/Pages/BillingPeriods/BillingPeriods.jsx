import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase"; // Import auth for accessing current user

const BillingPeriods = () => {
  const { id } = useParams(); // Get project ID from the URL
  const [billingPeriods, setBillingPeriods] = useState([]);
  const [error, setError] = useState(null); // State to store error message
  const db = getFirestore();
  const navigate = useNavigate(); // To navigate programmatically

  useEffect(() => {
    const fetchBillingPeriods = async () => {
      try {
        // Get the current authenticated user
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError("No user is logged in.");
          return;
        }

        // Fetch the project from the user's collection
        const projectDoc = doc(db, `users/${currentUser.uid}/projects`, id);
        const projectSnap = await getDoc(projectDoc);

        if (projectSnap.exists()) {
          const data = projectSnap.data();
          if (data.billingPeriod && Array.isArray(data.billingPeriod)) {
            setBillingPeriods(data.billingPeriod);
          } else {
            setError("No billing periods found in this project.");
          }
        } else {
          setError("No project found for the given ID.");
        }
      } catch (err) {
        setError("An error occurred while fetching the project data.");
      }
    };

    fetchBillingPeriods();
  }, [id, db]);

  return (
    <div className="min-h-screen bg-blue-950 p-4">
      <h1 className="text-white text-2xl font-bold mb-4">Billing Periods</h1>

      <div className="bg-blue-800 p-4 rounded-lg">
        {error ? (
          <p className="text-red-500 text-lg">{error}</p>
        ) : billingPeriods.length > 0 ? (
          <ul>
            {billingPeriods.map((period, index) => (
              <li key={index} className="text-white text-lg">
                Billing Period {index + 1}: {period.toFixed(1)} hours
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
