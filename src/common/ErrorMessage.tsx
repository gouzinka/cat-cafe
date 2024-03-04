import React from "react";

interface ErrorMessageProps {
  id: string;
  message: string;
}

const ErrorMessage = ({id, message}: ErrorMessageProps) => {
  if (message === "") return null;

  return (
    <div id={id} className="error-message" aria-live="polite">
      {message}
    </div>
  );
};

export default ErrorMessage;
