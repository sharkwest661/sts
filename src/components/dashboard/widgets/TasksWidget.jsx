// src/components/dashboard/widgets/TasksWidget.jsx
import React, { useState } from "react";
import styles from "./TasksWidget.module.scss";

const TasksWidget = ({ tasks }) => {
  const [completedTasks, setCompletedTasks] = useState([]);

  // Get priority class and icon
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "critical":
        return {
          className: styles.critical,
          icon: "🔴",
          label: "Critical",
        };
      case "high":
        return {
          className: styles.high,
          icon: "🔶",
          label: "High",
        };
      case "medium":
        return {
          className: styles.medium,
          icon: "🟡",
          label: "Medium",
        };
      case "low":
        return {
          className: styles.low,
          icon: "🟢",
          label: "Low",
        };
      default:
        return {
          className: "",
          icon: "⚪",
          label: "Normal",
        };
    }
  };

  // Handle task completion toggle
  const toggleTaskCompletion = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  return (
    <div className={styles.tasksWidget}>
      <h3 className={styles.widgetTitle}>Pending Tasks</h3>

      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>✓</span>
          <p className={styles.emptyText}>No pending tasks</p>
        </div>
      ) : (
        <div className={styles.tasksList}>
          {tasks.map((task) => {
            const priorityInfo = getPriorityInfo(task.priority);
            const isCompleted = completedTasks.includes(task.id);

            return (
              <div
                key={task.id}
                className={`${styles.taskItem} ${priorityInfo.className} ${
                  isCompleted ? styles.completed : ""
                }`}
              >
                <button
                  className={styles.taskCheckbox}
                  onClick={() => toggleTaskCompletion(task.id)}
                  aria-label={
                    isCompleted ? "Mark as incomplete" : "Mark as complete"
                  }
                >
                  {isCompleted ? "✓" : ""}
                </button>

                <div className={styles.taskContent}>
                  <div className={styles.taskHeader}>
                    <h4 className={styles.taskTitle}>{task.title}</h4>
                    <span className={styles.taskDeadline}>{task.deadline}</span>
                  </div>

                  <div className={styles.taskFooter}>
                    <span className={styles.taskPriority}>
                      {priorityInfo.icon} {priorityInfo.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.tasksFooter}>
        <div className={styles.tasksProgress}>
          <span className={styles.progressLabel}>
            {completedTasks.length} of {tasks.length} completed
          </span>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{
                width: `${
                  tasks.length > 0
                    ? (completedTasks.length / tasks.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        <button className={styles.addTaskButton}>Add Task</button>
      </div>
    </div>
  );
};

export default TasksWidget;
