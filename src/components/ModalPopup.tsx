import React from 'react';
import './ModalPopup.css';

interface ModalPopupProps {
  message: string;
  onClose: () => void;
}

const ModalPopup: React.FC<ModalPopupProps> = ({ message, onClose }) => {
  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Trigger close action only if the translucent background is clicked
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="modal-content">
        <div className="modal-message">{message}</div>
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalPopup;

/*
import React, { useState } from 'react';
import ModalPopup from './ModalPopup';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>My App</h1>
      <button onClick={openModal}>Open Modal</button>
      {isModalOpen && (
        <ModalPopup message="Hello, I'm a modal!" onClose={closeModal} />
      )}
    </div>
  );
};

export default App;

*/
