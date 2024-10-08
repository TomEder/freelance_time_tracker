import React from "react";
import EditProjectForm from "./EditProjectForm/EditProjectForm"; // Import the form component

const EditProject = () => {
  return (
    <div>
      <h1 className="text-[#D35400] text-2xl font-bold mb-4">Edit Project</h1>
      {/* Render the EditProjectForm component */}
      <EditProjectForm />
    </div>
  );
};

export default EditProject;
