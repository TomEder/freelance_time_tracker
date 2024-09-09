import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const BillingPeriods = () => {
  const { id } = useParams(); // Get project ID from the URL
  const [billingPeriods, setBillingPeriods] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchBillingPeriods = async () => {
      const projectDoc = doc(db, "projects", id);
      const projectSnap = await getDoc(projectDoc);

      if (projectSnap.exists()) {
        const data = projectSnap.data();
        if (data.billingPeriod && Array.isArray(data.billingPeriod)) {
          setBillingPeriods(data.billingPeriod);
        }
      } else {
        console.error("No project found");
      }
    };

    fetchBillingPeriods();
  }, [id, db]);

  return (
    <div className="min-h-screen bg-blue-950 p-4">
      <h1 className="text-white text-2xl font-bold mb-4">Billing Periods</h1>

      <div className="bg-blue-800 p-4 rounded-lg">
        {billingPeriods.length > 0 ? (
          <ul>
            {billingPeriods.map((period, index) => (
              <li key={index} className="text-white text-lg">
                Billing Period {index + 1}: {period} hours
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white text-lg">No billing periods found.</p>
        )}
      </div>

      <button
        onClick={() => window.history.back()}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Back to Project
      </button>
    </div>
  );
};

export default BillingPeriods;
