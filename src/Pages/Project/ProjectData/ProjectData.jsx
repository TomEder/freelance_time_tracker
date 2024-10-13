import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faPlay } from "@fortawesome/free-solid-svg-icons";
import {
  updateEarnings,
  deleteProject as deleteProjectService,
} from "../../../Services/FirebaseService";

const ProjectData = ({ project, setProject }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime - startTime) / 1000);
        setTimeElapsed(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, startTime]);

  const handleStartTimer = () => {
    setStartTime(new Date());
    setTimerActive(true);
  };

  const handleStopTimer = async () => {
    setTimerActive(false);
    try {
      const { totalEarnings, billingPeriods } = await updateEarnings(
        project.id,
        timeElapsed,
        project.payPerHour
      );
      console.log("Updated total earnings:", totalEarnings);
      console.log("Updated billing periods:", billingPeriods);

      const updatedProject = {
        ...project,
        earnings: totalEarnings,
        billingPeriod: billingPeriods,
        lastSession: timeElapsed,
        todayTime: (project.todayTime || 0) + timeElapsed,
        weekTime: (project.weekTime || 0) + timeElapsed,
        monthTime: (project.monthTime || 0) + timeElapsed,
      };

      setProject(updatedProject);

      setTimeElapsed(0);
    } catch (error) {
      console.error("Failed to update earnings:", error);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProjectService(project.id);
        alert("Project deleted successfully.");
        navigate("/home");
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete the project. Please try again.");
      }
    }
  };

  const getCurrentBillingPeriod = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const currentBillingPeriod = project.billingPeriod?.find(
      (period) => period.month === currentMonth && period.year === currentYear
    );

    return currentBillingPeriod || { earnings: 0 };
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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

  const currentBillingPeriod = getCurrentBillingPeriod();

  return (
    <div className="p-4 bg-[#171718]">
      <div
        className="p-4 text-white rounded-lg text-center"
        style={{ backgroundColor: getColor(project.bgColor) }}
      >
        <h4 className="text-xs">This session</h4>
        <div className="flex justify-center items-center mt-2">
          {timerActive ? (
            <button
              onClick={handleStopTimer}
              className="bg-red-500 h-10 w-10 px-2 pt-1 rounded-full mr-4 text-white"
            >
              <FontAwesomeIcon icon={faStop} />
            </button>
          ) : (
            <button
              onClick={handleStartTimer}
              className="bg-green-500 h-10 w-10 px-3 pt-1 rounded-full mr-4 text-white"
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
          )}
          <p className="text-xl font-bold">{formatTime(timeElapsed)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: getColor(project.bgColor) }}
        >
          <h4 className="text-xs mb-4 text-white">Last session</h4>
          <p className="text-md font-bold text-white">
            {formatTime(project.lastSession || 0)}
          </p>
        </div>
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: getColor(project.bgColor) }}
        >
          <h4 className="text-xs mb-4 text-white">Today</h4>
          <p className="text-md font-bold text-white">
            {formatTime(project.todayTime || 0)}
          </p>
        </div>
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: getColor(project.bgColor) }}
        >
          <h4 className="text-xs mb-4 text-white">This week</h4>
          <p className="text-md font-bold text-white">
            {formatTime(project.weekTime || 0)}
          </p>
        </div>
        <div
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: getColor(project.bgColor) }}
        >
          <h4 className="text-xs mb-4 text-white">This month</h4>
          <p className="text-md font-bold text-white">
            {formatTime(project.monthTime || 0)}
          </p>
        </div>
        <div
          className="col-span-2 p-4 rounded-lg text-center"
          style={{ backgroundColor: getColor(project.bgColor) }}
        >
          <h4 className="text-xs text-white">This billing period</h4>
          <p className="text-xl font-bold text-white">
            {currentBillingPeriod.earnings.toFixed(1)} kr
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-around">
        <button
          className="text-white text-xs py-4 px-4 rounded m-2"
          style={{ backgroundColor: getColor(project.bgColor) }}
          onClick={() => navigate(`/project/${project.id}/billing-periods`)}
        >
          BILLING PERIODS
        </button>
        <button
          className="text-white text-xs py-2 px-4 rounded m-2"
          style={{ backgroundColor: getColor(project.bgColor) }}
          onClick={() => navigate(`/project/${project.id}/edit`)}
        >
          EDIT PROJECT
        </button>
      </div>
      <div className="flex flex-col my-4 items-center">
        <button
          onClick={handleDeleteProject}
          className="text-white text-xs py-2 px-4 m-auto rounded bg-red-700"
        >
          DELETE PROJECT
        </button>
      </div>
    </div>
  );
};

export default ProjectData;
