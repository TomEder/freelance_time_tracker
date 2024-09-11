import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "../../firebase";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import ProjectData from "./ProjectData/ProjectData";

const Project = () => {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const navigate = useNavigate(); // Hook to programmatically navigate
  const db = getFirestore();

  useEffect(() => {
    const checkAuthAndFetchProject = async () => {
      // Check if user is logged in
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("No user is logged in.");
        navigate("/"); // Redirect to login if not authenticated
        return;
      }

      // Fetch project under the user's collection
      const projectDoc = doc(db, `users/${currentUser.uid}/projects`, id);
      const projectSnap = await getDoc(projectDoc);
      if (projectSnap.exists()) {
        // Attach the project ID to the project data
        setProject({ id: projectSnap.id, ...projectSnap.data() });
      } else {
        console.error("Project not found");
      }
    };

    checkAuthAndFetchProject();
  }, [id, db, navigate]);

  const updateProjectTime = async (timeElapsed) => {
    if (project) {
      // Calculate elapsed time in hours and round to the nearest half-hour (e.g., 0.5, 1.0, 1.5, etc.)
      const elapsedHours = Math.round((timeElapsed / 3600) * 2) / 2;

      const newLastSession = timeElapsed;
      const newTodayTime = (project.todayTime || 0) + timeElapsed;
      const newWeekTime = (project.weekTime || 0) + timeElapsed;
      const newMonthTime = (project.monthTime || 0) + timeElapsed;

      let billingPeriods = project.billingPeriod || [];
      let lastBillingPeriod = billingPeriods[billingPeriods.length - 1] || 0;

      lastBillingPeriod += elapsedHours;
      lastBillingPeriod = Math.round(lastBillingPeriod * 2) / 2;
      billingPeriods[billingPeriods.length - 1] = lastBillingPeriod;

      const projectRef = doc(db, `users/${auth.currentUser.uid}/projects`, id);
      await updateDoc(projectRef, {
        hours: project.hours + elapsedHours,
        lastSession: newLastSession,
        todayTime: newTodayTime,
        weekTime: newWeekTime,
        monthTime: newMonthTime,
        billingPeriod: billingPeriods,
      });

      setProject((prev) => ({
        ...prev,
        hours: prev.hours + elapsedHours,
        lastSession: newLastSession,
        todayTime: newTodayTime,
        weekTime: newWeekTime,
        monthTime: newMonthTime,
        billingPeriod: billingPeriods,
      }));
    }
  };

  if (!project) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-950">
      <ProjectHeader project={project} />
      <ProjectData project={project} updateProjectTime={updateProjectTime} />
    </div>
  );
};

export default Project;
