import React from "react";
import ReactDOM from "react-dom";
import { useCallback, useEffect} from 'react';
import {motion} from 'framer-motion';

const Modal = ({ onClose, children, title }) => {

  const handleCloseClick = (e) => {
      e.preventDefault();
      onClose();
  };

  const modalContent = (
      <div className="modal-overlay">
          {/* Wrap the whole Modal inside the newly created StyledModalWrapper
          and use the ref */}
        <motion.div
            initial={{ y: 1000 }}
            animate={{ y : 0}}
            transition={{ velocity: 1000, type: 'spring', damping: 15 }}
            id="popup-animation"
        >
          <div className="modal-wrapper">
              <div className="modal">
                  <div className="modal-header">
                      <a href="#" onClick={handleCloseClick}>
                          X
                      </a>
                  </div>
                  {title && <h1>{title}</h1>}
                  <div className="modal-body">{children}</div>
              </div>
          </div>
          </motion.div>
      </div>
  );

  return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
  );
};

export default Modal