import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Import the listener for auth state changes

// Firestore setup
const db = getFirestore();

const UserContainer = () => {
  const [user, setUser] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state for user

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });

        // Fetch project data and calculate total earnings
        const fetchTotalEarnings = async () => {
          try {
            const projectsCollection = collection(db, "projects");
            const projectSnapshot = await getDocs(projectsCollection);

            let total = 0;
            projectSnapshot.forEach((doc) => {
              const data = doc.data();
              total += data.earnings || 0; // Add earnings from each project
            });

            setTotalEarnings(total);
          } catch (err) {
            setError("Failed to fetch project earnings.");
            console.error("Firestore error:", err);
          }
        };

        fetchTotalEarnings();
      } else {
        // User is not logged in, handle this case if needed
        setUser(null);
      }
      setLoading(false); // Set loading to false after user state is determined
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  if (!user) {
    return <div>No user data available</div>; // Handle case where user is not logged in
  }

  return (
    <div className="bg-blue-600 rounded-b-lg w-full shadow-xl">
      {/* User Info Section */}
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

      {/* Earned Section */}
      <div className="bg-blue-800 rounded-lg p-4 w-full shadow-inner text-center">
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
