import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { fetchAllProjects } from "../../../../Services/FirebaseService"; // Use the Firebase service
import { auth } from "../../../../firebase"; // Import auth for authentication

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Fetch all projects using Firebase service
        const fetchProjects = async () => {
          try {
            const projectsList = await fetchAllProjects();
            setProjects(projectsList); // Set the fetched projects in state
          } catch (error) {
            console.error("Error fetching projects: ", error);
          } finally {
            setLoading(false); // Stop loading
          }
        };

        fetchProjects();
      } else {
        setLoading(false); // No user is logged in, stop loading
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (projects.length === 0) {
    return <div>No projects found.</div>;
  }

  // Map bgColor number to the corresponding color
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

  const handleProjectClick = (id) => {
    navigate(`/project/${id}`); // Navigate to the project page with the project ID
  };

  return (
    <div className="flex flex-col gap-4 p-4 mt-16">
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg shadow-lg overflow-hidden cursor-pointer"
          onClick={() => handleProjectClick(project.id)} // Navigate on project click
        >
          <div
            style={{ backgroundColor: getColor(project.bgColor) }}
            className="p-2 h-14"
          >
            <h3 className="text-white text-sm font-bold">Project</h3>
            <h2 className="text-white text-xl font-semibold">{project.name}</h2>
          </div>
          <div className="bg-sky-800 p-4 flex justify-between items-center">
            <div className="text-center">
              <h4 className="text-gray-300 text-sm">Work</h4>
              <p className="text-white text-2xl font-bold">{project.hours}h</p>
            </div>
            <div className="text-center">
              <h4 className="text-gray-300 text-sm">Earned</h4>
              <p className="text-white text-2xl font-bold">
                {project.earnings.toFixed(1)} kr
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
