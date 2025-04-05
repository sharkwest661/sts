// src/components/dashboard/widgets/NotificationsWidget.jsx
import React from "react";
import styles from "./NotificationsWidget.module.scss";

const NotificationsWidget = ({ notifications }) => {
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "investor":
        return "💰";
      case "team":
        return "👥";
      case "product":
        return "💻";
      case "marketing":
        return "📣";
      case "office":
        return "🏢";
      case "event":
        return "🎉";
      default:
        return "📌";
    }
  };

  // Get notification priority class
  const getNotificationClass = (type) => {
    switch (type) {
      case "investor":
        return styles.important;
      case "product":
        return styles.critical;
      case "team":
        return styles.warning;
      default:
        return "";
    }
  };

  return (
    <div className={styles.notificationsWidget}>
      <h3 className={styles.widgetTitle}>Recent Notifications</h3>

      {notifications.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🔔</span>
          <p className={styles.emptyText}>No new notifications</p>
        </div>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${getNotificationClass(
                notification.type
              )}`}
            >
              <span className={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </span>

              <div className={styles.notificationContent}>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                <span className={styles.notificationTime}>
                  {notification.time}
                </span>
              </div>

              <button className={styles.notificationAction}>→</button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.notificationsFooter}>
        <button className={styles.viewAllButton}>View All Notifications</button>
        <button className={styles.clearButton}>Clear</button>
      </div>
    </div>
  );
};

export default NotificationsWidget;
