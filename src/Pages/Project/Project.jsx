import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProject, updateProject } from "../../Services/FirebaseService";
import ProjectHeader from "./ProjectHeader/ProjectHeader";
import ProjectData from "./ProjectData/ProjectData";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const Project = () => {
  const { id } = useParams(); // Fetch the project ID from URL parameters
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchProject = async (user) => {
      if (!user) {
        console.error("No user is logged in.");
        navigate("/"); // Redirect to login if not authenticated
        return;
      }

      try {
        const projectData = await fetchProject(id);

        if (projectData) {
          // Add project ID to the project object before setting state
          const projectWithId = { ...projectData, id }; // Make sure ID is included

          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();

          let billingPeriods = projectData.billingPeriod || [];
          let lastBillingPeriod =
            billingPeriods[billingPeriods.length - 1] || {};

          // If it's a new month, create a new billing period
          if (
            !lastBillingPeriod ||
            lastBillingPeriod.year !== currentYear ||
            lastBillingPeriod.month !== currentMonth
          ) {
            const newBillingPeriod = {
              hours: 0,
              earnings: 0,
              month: currentMonth,
              year: currentYear,
            };

            billingPeriods.push(newBillingPeriod);

            // Update Firestore
            await updateProject(id, {
              billingPeriod: billingPeriods,
              monthTime: 0,
            });

            projectWithId.billingPeriod = billingPeriods;
            projectWithId.monthTime = 0;
          }

          setProject(projectWithId); // Set project with ID in state
        } else {
          console.error("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkAuthAndFetchProject(user);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [id, navigate]);

  const updateProjectTime = async (timeElapsed) => {
    if (project) {
      const elapsedHours = Math.round((timeElapsed / 3600) * 2) / 2;
      const newLastSession = timeElapsed;
      const newTodayTime = (project.todayTime || 0) + timeElapsed;
      const newWeekTime = (project.weekTime || 0) + timeElapsed;
      const newMonthTime = (project.monthTime || 0) + timeElapsed;

      let billingPeriods = project.billingPeriod || [];
      let lastBillingPeriod = billingPeriods[billingPeriods.length - 1];

      // Update hours and earnings for the current billing period
      lastBillingPeriod.hours += elapsedHours;
      lastBillingPeriod.earnings += elapsedHours * project.payPerHour;

      // Calculate total earnings across billing periods
      const totalEarnings = billingPeriods.reduce(
        (acc, period) => acc + period.earnings,
        0
      );

      await updateProject(id, {
        hours: project.hours + elapsedHours,
        lastSession: newLastSession,
        todayTime: newTodayTime,
        weekTime: newWeekTime,
        monthTime: newMonthTime,
        billingPeriod: billingPeriods,
        earnings: totalEarnings,
      });

      setProject((prev) => ({
        ...prev,
        hours: prev.hours + elapsedHours,
        lastSession: newLastSession,
        todayTime: newTodayTime,
        weekTime: newWeekTime,
        monthTime: newMonthTime,
        billingPeriod: billingPeriods,
        earnings: totalEarnings,
      }));
    }
  };

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: getColor(project.bgColor) }}
    >
      <ProjectHeader project={project} />
      <ProjectData
        project={project}
        updateProjectTime={updateProjectTime}
        setProject={setProject}
      />
    </div>
  );
};

export default Project;
