import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

const ProjectData = ({ project, updateProjectTime }) => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // In seconds
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate(); // Add useNavigate hook

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

  const handleStopTimer = () => {
    setTimerActive(false);
    updateProjectTime(timeElapsed); // Send timeElapsed back to update total project time
    setTimeElapsed(0); // Reset the timer
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

  return (
    <div className="p-4 bg-blue-800 rounded-lg m-4">
      {/* Timer section */}
      <div className="bg-blue-400 p-4 text-white rounded-lg text-center">
        <h4 className="text-sm">This session</h4>
        <div className="flex justify-center items-center mt-2">
          {timerActive ? (
            <button
              onClick={handleStopTimer}
              className="bg-black w-8 h-8 rounded-full mr-4"
            />
          ) : (
            <button
              onClick={handleStartTimer}
              className="bg-white w-8 h-8 rounded-full mr-4"
            />
          )}
          <p className="text-2xl font-bold">{formatTime(timeElapsed)}</p>
        </div>
      </div>

      {/* Project stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-500 p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">Last session</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.lastSession || 0)}{" "}
            {/* Default to 0 if undefined */}
          </p>
        </div>
        <div className="bg-blue-500 p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">Today</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.todayTime || 0)}{" "}
            {/* Default to 0 if undefined */}
          </p>
        </div>
        <div className="bg-blue-500 p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">This week</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.weekTime || 0)}{" "}
            {/* Default to 0 if undefined */}
          </p>
        </div>
        <div className="bg-blue-500 p-4 rounded-lg text-center">
          <h4 className="text-sm text-white">This month</h4>
          <p className="text-2xl font-bold text-white">
            {formatTime(project.monthTime || 0)}{" "}
            {/* Default to 0 if undefined */}
          </p>
        </div>
        <div className="col-span-2 bg-blue-500 p-4 rounded-lg text-center">
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
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => navigate(`/project/${project.id}/billing-periods`)} // Navigate to the billing periods page
        >
          See all billing periods
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => navigate(`/project/${project.id}/edit`)}
        >
          Edit project
        </button>
      </div>
    </div>
  );
};

export default ProjectData;
