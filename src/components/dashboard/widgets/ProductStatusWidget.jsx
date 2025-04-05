// src/components/dashboard/widgets/ProductStatusWidget.jsx
import React from "react";
import styles from "./ProductStatusWidget.module.scss";

const ProductStatusWidget = ({ productName, productStatus, onViewProduct }) => {
  // Helper to get color class based on development progress
  const getProgressColorClass = (progress) => {
    if (progress < 25) return styles.initialStage;
    if (progress < 50) return styles.earlyStage;
    if (progress < 75) return styles.midStage;
    return styles.lateStage;
  };

  // Helper to get bug status class
  const getBugStatusClass = (bugs, features) => {
    const ratio = bugs / (features || 1);
    if (ratio > 1.5) return styles.critical;
    if (ratio > 1) return styles.high;
    if (ratio > 0.5) return styles.medium;
    return styles.low;
  };

  // Get progress color class
  const progressClass = getProgressColorClass(productStatus.development);

  // Get bug status class
  const bugStatusClass = getBugStatusClass(
    productStatus.bugs,
    productStatus.features
  );

  return (
    <div className={styles.productWidget}>
      <h3 className={styles.widgetTitle}>Product Status</h3>

      <div className={styles.productHeader}>
        <div className={styles.productName}>
          <span className={styles.productIcon}>🚀</span>
          <span className={styles.productTitle}>{productName}</span>
        </div>

        <div className={styles.versionBadge}>
          v{productStatus.currentVersion}
        </div>
      </div>

      <div className={styles.developmentProgress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Development Progress</span>
          <span className={styles.progressValue}>
            {productStatus.development}%
          </span>
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={`${styles.progressBar} ${progressClass}`}
            style={{ width: `${productStatus.development}%` }}
          ></div>
        </div>

        <span className={styles.nextReleaseLabel}>
          Next release: {productStatus.nextRelease}
        </span>
      </div>

      <div className={styles.productStats}>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Features</span>
            <span className={styles.statValue}>{productStatus.features}</span>
          </div>

          <div className={styles.statDescription}>
            Implemented functionality
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Bugs</span>
            <span className={`${styles.statValue} ${bugStatusClass}`}>
              {productStatus.bugs}
            </span>
          </div>

          <div className={styles.statDescription}>Known issues in codebase</div>
        </div>
      </div>

      <div className={styles.techStack}>
        <h4 className={styles.sectionTitle}>Tech Stack</h4>

        <div className={styles.techTags}>
          <span className={styles.techTag}>React</span>
          <span className={styles.techTag}>Node.js</span>
          <span className={styles.techTag}>MongoDB</span>
          <span className={styles.techTag}>AWS</span>
        </div>
      </div>

      <button className={styles.viewProductButton} onClick={onViewProduct}>
        Manage Product
      </button>
    </div>
  );
};

export default ProductStatusWidget;
