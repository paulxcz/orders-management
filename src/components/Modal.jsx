import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
