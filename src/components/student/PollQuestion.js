// import React, { useState } from "react";
// import Button from "../common/Button";
// import Timer from "../common/Timer";

// const PollQuestion = ({
//   poll,
//   timeRemaining,
//   onSubmitAnswer,
//   disabled = false,
//   loading = false,
// }) => {
//   const [selectedOption, setSelectedOption] = useState(null);

//   // ADD THIS NULL CHECK:
//   if (!poll) {
//     return (
//       <div className="poll-question-container">
//         <div className="loading">
//           <div className="spinner"></div>
//           <p>Loading poll...</p>
//         </div>
//       </div>
//     );
//   }

//   // ADD THIS CHECK TOO:
//   if (!poll.options || !Array.isArray(poll.options)) {
//     return (
//       <div className="poll-question-container">
//         <div className="alert alert-error">
//           <p>Invalid poll data received</p>
//         </div>
//       </div>
//     );
//   }

//   const handleOptionSelect = (optionIndex) => {
//     if (disabled || timeRemaining <= 0) return;
//     setSelectedOption(optionIndex);
//   };

//   const handleSubmit = () => {
//     if (selectedOption !== null && !disabled && timeRemaining > 0) {
//       onSubmitAnswer(poll.id, selectedOption);
//     }
//   };

//   const isTimeUp = timeRemaining <= 0;
//   const canSubmit = selectedOption !== null && !disabled && !isTimeUp;

//   return (
//     <div className="poll-question-container">
//       <div className="question-timer mb-20">
//         <span>Question 1</span>
//         <Timer
//           timeRemaining={timeRemaining || 0}
//           totalTime={poll.timeLimit || 60}
//           showProgress={false}
//         />
//       </div>

//       <div className="question-header">
//         {poll.question || "Loading question..."}
//       </div>

//       <div className="options-list">
//         {poll.options && poll.options.length > 0 ? (
//           poll.options.map((option, index) => (
//             <div
//               key={index}
//               className={`option-item ${
//                 selectedOption === index ? "selected" : ""
//               } ${disabled ? "disabled" : ""}`}
//               onClick={() => handleOptionSelect(index)}
//             >
//               <div
//                 className={`option-radio ${
//                   selectedOption === index ? "checked" : ""
//                 }`}
//               />
//               <span>{option.text || `Option ${index + 1}`}</span>
//             </div>
//           ))
//         ) : (
//           <div className="loading">
//             <p>Loading options...</p>
//           </div>
//         )}
//       </div>

//       <div className="mt-20">
//         {isTimeUp ? (
//           <div className="alert alert-info">
//             Time's up! Waiting for results...
//           </div>
//         ) : (
//           <Button
//             onClick={handleSubmit}
//             disabled={!canSubmit}
//             loading={loading}
//             size="large"
//             className="w-full"
//           >
//             Submit
//           </Button>
//         )}
//       </div>

//       {disabled && !isTimeUp && (
//         <div className="mt-10 text-center">
//           <small className="text-gray-500">
//             Answer submitted. Waiting for results...
//           </small>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PollQuestion;

import React, { useState } from "react";
import Button from "../common/Button";
import Timer from "../common/Timer";

const PollQuestion = ({
  poll,
  timeRemaining,
  onSubmitAnswer,
  disabled = false,
  loading = false,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Add null checks to prevent errors
  if (!poll) {
    return (
      <div className="poll-question-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading poll...</p>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (optionIndex) => {
    if (disabled || timeRemaining <= 0) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !disabled && timeRemaining > 0) {
      onSubmitAnswer(poll.id, selectedOption);
    }
  };

  const isTimeUp = timeRemaining <= 0;
  const canSubmit = selectedOption !== null && !disabled && !isTimeUp;

  return (
    <div className="poll-question-container">
      <div className="question-timer mb-20">
        <span>Question 1</span>
        <Timer
          timeRemaining={timeRemaining || 0}
          totalTime={poll.timeLimit || 60}
          showProgress={false}
        />
      </div>

      <div className="question-header">
        {poll.question || "Loading question..."}
      </div>

      <div className="options-list">
        {poll.options && poll.options.length > 0 ? (
          poll.options.map((option, index) => (
            <div
              key={index}
              className={`option-item ${
                selectedOption === index ? "selected" : ""
              } ${disabled ? "disabled" : ""}`}
              onClick={() => handleOptionSelect(index)}
            >
              <div
                className={`option-radio ${
                  selectedOption === index ? "checked" : ""
                }`}
              />
              <span>{option.text || `Option ${index + 1}`}</span>
            </div>
          ))
        ) : (
          <div className="loading">
            <p>Loading options...</p>
          </div>
        )}
      </div>

      <div className="mt-20">
        {isTimeUp ? (
          <div className="alert alert-info">
            Time's up! Waiting for results...
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={loading}
            size="large"
            className="w-full"
          >
            Submit
          </Button>
        )}
      </div>

      {disabled && !isTimeUp && (
        <div className="mt-10 text-center">
          <small className="text-gray-500">
            Answer submitted. Waiting for results...
          </small>
        </div>
      )}
    </div>
  );
};

export default PollQuestion;
