import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faPlay } from "@fortawesome/free-solid-svg-icons";
import { updateEarnings } from "../../../Services/FirebaseService"; // Import the service function

const ProjectData = ({ project, updateProjectTime }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // In seconds
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = Math.floor((currentTime - startTime) / 1000); // Time in seconds
        setTimeElapsed(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval); // Clean up interval on component unmount or timer stop
  }, [timerActive, startTime]);

  const handleStartTimer = () => {
    setStartTime(new Date());
    setTimerActive(true);
  };

  const handleStopTimer = async () => {
    setTimerActive(false);
    try {
      // Ensure project.id exists
      if (!project.id) {
        console.error("Project ID is missing:", project);
        return;
      }

      // Add logging for debugging purposes
      console.log("Stopping timer for project:", project.id);

      // Update the project and billing period with the elapsed time and earnings
      const { totalEarnings, billingPeriods } = await updateEarnings(
        project.id,
        timeElapsed,
        project.payPerHour
      );
      console.log("Updated total earnings:", totalEarnings);
      console.log("Updated billing periods:", billingPeriods);
      setTimeElapsed(0); // Reset the timer after stopping

      // Optionally, update the parent state (if needed)
      updateProjectTime(timeElapsed);
    } catch (error) {
      console.error("Failed to update earnings:", error);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const calculateEarnings = (timeInSeconds, hourlyRate) => {
    const hours = timeInSeconds / 3600;
    return (hours * hourlyRate).toFixed(2); // Earnings rounded to 2 decimal places
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

  return (
    <div className="p-4" style={{ backgroundColor: getColor(project.bgColor) }}>
      {/* Timer section */}
      <div className="p-4 text-white rounded-lg text-center">
        <h4 className="text-sm">This session</h4>
        <div className="flex justify-center items-center mt-2">
          {timerActive ? (
            <button
              onClick={handleStopTimer}
              className="bg-red-600 w-8 h-8 rounded-full mr-4 text-white"
            >
              <FontAwesomeIcon icon={faStop} />
            </button>
          ) : (
            <button
              onClick={handleStartTimer}
              className="bg-green-500 w-8 h-8 rounded-full mr-4 text-white"
            >
              <FontAwesomeIcon icon={faPlay} />
            </button>
          )}
          <p className="text-2xl font-bold">{formatTime(timeElapsed)}</p>
        </div>
      </div>

      {/* Project stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">Last session</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.lastSession || 0)}
          </p>
        </div>
        <div className=" p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">Today</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.todayTime || 0)}
          </p>
        </div>
        <div className=" p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">This week</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.weekTime || 0)}
          </p>
        </div>
        <div className=" p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">This month</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.monthTime || 0)}
          </p>
        </div>
        <div className="col-span-2 p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">This billing period</h4>
          <p className="text-2xl font-bold text-white">
            {calculateEarnings(project.monthTime || 0, project.payPerHour || 0)}{" "}
            kr
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-around">
        <button
          className="bg-sky-500 text-white py-2 px-4 rounded"
          onClick={() => navigate(`/project/${project.id}/billing-periods`)}
        >
          See all billing periods
        </button>
        <button
          className="bg-sky-500 text-white py-2 px-4 rounded"
          onClick={() => navigate(`/project/${project.id}/edit`)}
        >
          Edit project
        </button>
      </div>
    </div>
  );
};

export default ProjectData;
