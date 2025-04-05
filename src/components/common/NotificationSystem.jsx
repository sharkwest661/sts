// src/components/common/NotificationSystem.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./NotificationSystem.module.scss";
import { useGameStore } from "../../store";

const NotificationSystem = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Get notifications from game store
  const notifications = useGameStore((state) => state.notifications);
  const markNotificationRead = useGameStore(
    (state) => state.markNotificationRead
  );
  const clearNotifications = useGameStore((state) => state.clearNotifications);

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "team":
        return "👥";
      case "product":
        return "💻";
      case "finance":
        return "💰";
      case "investor":
        return "📈";
      case "marketing":
        return "📣";
      case "office":
        return "🏢";
      case "achievement":
        return "🏆";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  // Get notification class based on type
  const getNotificationClass = (type) => {
    switch (type) {
      case "achievement":
        return styles.achievement;
      case "investor":
        return styles.investor;
      case "finance":
        return styles.finance;
      case "marketing":
        return styles.marketing;
      case "warning":
        return styles.warning;
      case "error":
        return styles.error;
      default:
        return "";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show the latest notification as a toast
  useEffect(() => {
    // If there are new unread notifications, show the latest one
    const unreadNotifications = notifications.filter((n) => !n.read);

    if (
      unreadNotifications.length > 0 &&
      !activeNotification &&
      !animatingOut
    ) {
      setActiveNotification(unreadNotifications[0]);

      // Auto mark as read after 5 seconds
      const timer = setTimeout(() => {
        setAnimatingOut(true);

        // Start animation then clear
        setTimeout(() => {
          markNotificationRead(unreadNotifications[0].id);
          setActiveNotification(null);
          setAnimatingOut(false);
        }, 300); // Animation duration
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, activeNotification, animatingOut, markNotificationRead]);

  // Handle clicking a notification in the panel
  const handleNotificationClick = (notification) => {
    markNotificationRead(notification.id);
  };

  // Handle clearing all notifications
  const handleClearAll = () => {
    clearNotifications();
    setShowPanel(false);
  };

  // Handle closing the toast notification
  const handleCloseToast = () => {
    if (activeNotification) {
      setAnimatingOut(true);

      // Start animation then clear
      setTimeout(() => {
        markNotificationRead(activeNotification.id);
        setActiveNotification(null);
        setAnimatingOut(false);
      }, 300); // Animation duration
    }
  };

  return (
    <>
      {/* Notification panel toggle */}
      <div
        className={styles.notificationToggle}
        onClick={() => setShowPanel(!showPanel)}
      >
        <div className={styles.notificationIcon}>
          🔔
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>
      </div>

      {/* Notification panel */}
      {showPanel && (
        <div className={styles.notificationPanel}>
          <div className={styles.panelHeader}>
            <h3>Notifications</h3>
            <div className={styles.panelControls}>
              <button
                className={styles.clearButton}
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                Clear All
              </button>
              <button
                className={styles.closeButton}
                onClick={() => setShowPanel(false)}
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.notificationList}>
            {notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.read ? styles.unread : ""
                  } ${getNotificationClass(notification.type)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <h4 className={styles.notificationTitle}>
                        {notification.title}
                      </h4>
                      <span className={styles.notificationTime}>
                        {formatDate(notification.date)}
                      </span>
                    </div>

                    <p className={styles.notificationMessage}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toast notification */}
      {activeNotification &&
        createPortal(
          <div
            className={`${styles.toastNotification} ${getNotificationClass(
              activeNotification.type
            )} ${animatingOut ? styles.fadeOut : styles.fadeIn}`}
          >
            <div className={styles.toastIcon}>
              {getNotificationIcon(activeNotification.type)}
            </div>

            <div className={styles.toastContent}>
              <h4 className={styles.toastTitle}>{activeNotification.title}</h4>
              <p className={styles.toastMessage}>
                {activeNotification.message}
              </p>
            </div>

            <button className={styles.toastClose} onClick={handleCloseToast}>
              ✕
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default NotificationSystem;
