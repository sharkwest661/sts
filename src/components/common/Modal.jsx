// src/components/common/Modal.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Modal.module.scss";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Determine modal size class
  const sizeClass = styles[size] || styles.medium;

  // Don't render if not open
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`${styles.modalContainer} ${sizeClass}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className={styles.modalHeader}>
                <h3>{title}</h3>
                <button
                  className={styles.closeButton}
                  onClick={onClose}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            )}

            <div className={styles.modalContent}>{children}</div>

            {footer && <div className={styles.modalFooter}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
