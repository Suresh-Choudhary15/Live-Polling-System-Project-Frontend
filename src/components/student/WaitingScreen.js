import React, { useEffect } from "react";
import socketService from "../../services/socketService";

const WaitingScreen = ({ studentName, onPollReceived }) => {
  useEffect(() => {
    // Listen for new polls
    const handleNewPoll = (pollData) => {
      console.log("📝 New poll received:", pollData);
      if (onPollReceived) {
        onPollReceived(pollData);
      }
    };

    socketService.on("new-poll", handleNewPoll);

    return () => {
      socketService.off("new-poll", handleNewPoll);
    };
  }, [onPollReceived]);

  return (
    <div className="waiting-screen">
      <div className="badge badge-purple mb-20">Interactive Poll</div>

      <div className="waiting-icon mb-20"></div>

      <h2>Wait for the teacher to ask questions..</h2>

      {studentName && (
        <p className="mt-10">
          Welcome, <strong>{studentName}</strong>! You're ready to participate.
        </p>
      )}

      <div className="mt-30">
        <div className="flex-center gap-10">
          <div className="status-dot"></div>
          <span className="text-gray-500">Connected and ready</span>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;
