import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { fetchAllProjects } from "../../../../Services/FirebaseService";
import { auth } from "../../../../firebase";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const fetchProjects = async () => {
          try {
            const projectsList = await fetchAllProjects();
            setProjects(projectsList);
          } catch (error) {
            console.error("Error fetching projects: ", error);
          } finally {
            setLoading(false);
          }
        };

        fetchProjects();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (projects.length === 0) {
    return <div>No projects found.</div>;
  }

  const getColor = (bgColor) => {
    switch (bgColor) {
      case 1:
        return "#91511F";
      case 2:
        return "#037C58";
      case 3:
        return "#721A70";
      case 4:
        return "#671313";
      default:
        return "#333";
    }
  };

  const handleProjectClick = (id) => {
    navigate(`/project/${id}`);
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 mt-16"
      style={{ backgroundColor: "#171718" }}
    >
      {projects.map((project) => (
        <div
          key={project.id}
          className="rounded-lg shadow-lg overflow-hidden cursor-pointer"
          onClick={() => handleProjectClick(project.id)}
          style={{
            border: `3px solid ${getColor(project.bgColor)}`,
            backgroundColor: "#1E1E1F",
          }}
        >
          <div className="p-2 h-14">
            <h3 className="text-white text-sm font-bold">PROJECT</h3>
            <h2 className="text-white text-xl font-semibold uppercase">
              {project.name}
            </h2>
          </div>
          <div
            className="bg-[#1C1C1D] p-4 flex justify-between items-center"
            style={{
              border: `1px solid ${getColor(project.bgColor)}`,
            }}
          >
            <div className="text-center">
              <h4 className="text-gray-300 text-sm">WORK</h4>
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
