import React from 'react';

export function Notification({ message, onClose }) {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-md shadow-lg z-50">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">X</button>
    </div>
  );
}
