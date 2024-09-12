import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { fetchAllProjects } from "../../../../Services/FirebaseService"; // Use Firebase service

const UserContainer = () => {
  const [user, setUser] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });

        // Fetch all projects using the service and calculate total earnings
        const fetchEarnings = async () => {
          try {
            const projects = await fetchAllProjects();
            const total = projects.reduce(
              (acc, project) => acc + (project.earnings || 0),
              0
            );
            setTotalEarnings(total);
          } catch (err) {
            setError("Failed to fetch project earnings.");
            console.error("Error fetching earnings:", err);
          }
        };

        fetchEarnings();
      } else {
        setUser(null); // No user is logged in
      }
      setLoading(false); // Set loading to false after checking user state
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="bg-sky-700 rounded-b-lg w-full shadow-xl">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <img
          src={user.photoURL || "https://via.placeholder.com/50"}
          alt="Profile"
          className="w-12 h-12 rounded-full m-4"
        />
        <div>
          <h2 className="text-white text-lg font-semibold">
            {user.displayName || "User"}
          </h2>
          <p className="text-gray-200 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="bg-sky-800 rounded-lg p-4 w-full shadow-inner text-center">
        <h3 className="text-gray-300 text-sm">Total earnings</h3>
        {error ? (
          <p className="text-red-500 text-lg font-bold">{error}</p>
        ) : (
          <p className="text-white text-3xl font-bold">{totalEarnings} kr</p>
        )}
      </div>
    </div>
  );
};

export default UserContainer;
