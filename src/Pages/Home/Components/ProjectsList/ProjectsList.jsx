import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "../../../../firebase"; // Ensure you're using the correct path to your firebase config

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);

  // Firestore setup
  const db = getFirestore();

  useEffect(() => {
    // Fetch projects from Firestore
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects"); // Fetch from the 'projects' collection
      const projectSnapshot = await getDocs(projectsCollection);
      const projectsList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Spread the document data to extract the fields
      }));
      setProjects(projectsList); // Set the projects in state
    };

    fetchProjects();
  }, []);

  if (projects.length === 0) {
    return <div>Loading projects...</div>;
  }

  // Map bgColor number to the corresponding color
  const getColor = (bgColor) => {
    switch (bgColor) {
      case 1:
        return "#EF812C"; // Color 1
      case 2:
        return "#33B58E"; // Color 2
      case 3:
        return "#A1299F"; // Color 3
      case 4:
        return "#BE0707"; // Color 4
      default:
        return "#333"; // Default color if no valid bgColor is found
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 mt-16">
      {projects.map((project) => (
        <div key={project.id} className="rounded-lg shadow-lg overflow-hidden">
          <div
            style={{ backgroundColor: getColor(project.bgColor) }}
            className="p-4"
          >
            <h3 className="text-white text-sm font-bold">Project</h3>
            <h2 className="text-white text-xl font-semibold">{project.name}</h2>
          </div>
          <div className="bg-blue-800 p-4 flex justify-between items-center">
            <div className="text-center">
              <h4 className="text-gray-300 text-sm">Work</h4>
              <p className="text-white text-2xl font-bold">{project.hours}h</p>
            </div>
            <div className="text-center">
              <h4 className="text-gray-300 text-sm">Earned</h4>
              <p className="text-white text-2xl font-bold">
                {project.earnings} kr
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
