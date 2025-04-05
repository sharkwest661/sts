// src/components/product/ProductDevelopment.jsx
import React, { useState } from "react";
import styles from "./ProductDevelopment.module.scss";
import useGameStore from "../../store/gameStore";

const ProductDevelopment = () => {
  const [activeTab, setActiveTab] = useState("features");

  // Get game state
  const startupIdea = useGameStore((state) => state.startupIdea);

  // Mock product data (would come from a product store in the full implementation)
  const productData = {
    name: startupIdea?.name || "Your Product",
    version: "0.2",
    features: [
      {
        id: 1,
        name: "User Authentication",
        status: "completed",
        complexity: 3,
        progress: 100,
        description: "Basic user login and registration functionality.",
      },
      {
        id: 2,
        name: "Dashboard UI",
        status: "completed",
        complexity: 2,
        progress: 100,
        description: "Main user interface for the application.",
      },
      {
        id: 3,
        name: "Data Visualization",
        status: "in-progress",
        complexity: 4,
        progress: 65,
        description: "Charts and graphs for displaying user data.",
      },
      {
        id: 4,
        name: "Payment Processing",
        status: "in-progress",
        complexity: 5,
        progress: 40,
        description: "Integration with payment providers.",
      },
      {
        id: 5,
        name: "User Profiles",
        status: "planned",
        complexity: 3,
        progress: 0,
        description: "Detailed user profiles and settings.",
      },
    ],
    bugs: [
      {
        id: 1,
        title: "Authentication fails intermittently",
        severity: "high",
        status: "open",
        affectedFeature: "User Authentication",
        description: "Users report being logged out randomly.",
      },
      {
        id: 2,
        title: "Dashboard doesn't load on Safari",
        severity: "critical",
        status: "open",
        affectedFeature: "Dashboard UI",
        description: "Safari users see a blank screen.",
      },
      {
        id: 3,
        title: "Charts don't render correctly on mobile",
        severity: "medium",
        status: "open",
        affectedFeature: "Data Visualization",
        description: "Visualization breaks on smaller screens.",
      },
    ],
    techDebt: 35,
    nextRelease: {
      version: "0.3",
      plannedFeatures: ["Data Visualization", "Payment Processing"],
      estimatedCompletion: "5 days",
    },
  };

  // Helper to get feature status class
  const getFeatureStatusClass = (status) => {
    switch (status) {
      case "completed":
        return styles.completed;
      case "in-progress":
        return styles.inProgress;
      case "planned":
        return styles.planned;
      default:
        return "";
    }
  };

  // Helper to get bug severity class
  const getBugSeverityClass = (severity) => {
    switch (severity) {
      case "critical":
        return styles.critical;
      case "high":
        return styles.high;
      case "medium":
        return styles.medium;
      case "low":
        return styles.low;
      default:
        return "";
    }
  };

  // Helper to display complexity
  const renderComplexity = (complexity) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`${styles.complexityDot} ${
            index < complexity ? styles.filled : ""
          }`}
        ></span>
      ));
  };

  return (
    <div className={styles.productDevelopment}>
      <header className={styles.productHeader}>
        <div className={styles.productInfo}>
          <h2 className={styles.productName}>{productData.name}</h2>
          <span className={styles.versionTag}>v{productData.version}</span>
        </div>

        <div className={styles.productStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {productData.features.length}
            </span>
            <span className={styles.statLabel}>Features</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statValue}>{productData.bugs.length}</span>
            <span className={styles.statLabel}>Bugs</span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statValue}>{productData.techDebt}%</span>
            <span className={styles.statLabel}>Tech Debt</span>
          </div>
        </div>
      </header>

      <div className={styles.releaseInfo}>
        <h3 className={styles.releaseTitle}>
          Next Release: v{productData.nextRelease.version}
        </h3>
        <div className={styles.releaseDetails}>
          <div className={styles.releaseFeatures}>
            <span className={styles.releaseLabel}>Planned Features:</span>
            <div className={styles.featureTags}>
              {productData.nextRelease.plannedFeatures.map((feature) => (
                <span key={feature} className={styles.featureTag}>
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.releaseEstimate}>
            <span className={styles.releaseLabel}>Estimated:</span>
            <span className={styles.estimateValue}>
              {productData.nextRelease.estimatedCompletion}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "features" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("features")}
          >
            Features
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "bugs" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("bugs")}
          >
            Bugs
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "tech-stack" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("tech-stack")}
          >
            Tech Stack
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "releases" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("releases")}
          >
            Releases
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "features" && (
            <div className={styles.featuresTab}>
              <div className={styles.featuresHeader}>
                <h3>Product Features</h3>
                <button className={styles.addButton}>Add Feature</button>
              </div>

              <div className={styles.featuresList}>
                {productData.features.map((feature) => (
                  <div
                    key={feature.id}
                    className={`${styles.featureItem} ${getFeatureStatusClass(
                      feature.status
                    )}`}
                  >
                    <div className={styles.featureHeader}>
                      <h4 className={styles.featureName}>{feature.name}</h4>
                      <div className={styles.featureStatus}>
                        <span className={styles.statusBadge}>
                          {feature.status}
                        </span>
                        <div className={styles.complexity}>
                          {renderComplexity(feature.complexity)}
                        </div>
                      </div>
                    </div>

                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>

                    <div className={styles.progressContainer}>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${feature.progress}%` }}
                        ></div>
                      </div>
                      <span className={styles.progressValue}>
                        {feature.progress}%
                      </span>
                    </div>

                    <div className={styles.featureActions}>
                      <button className={styles.actionButton}>
                        Prioritize
                      </button>
                      <button className={styles.actionButton}>Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bugs" && (
            <div className={styles.bugsTab}>
              <div className={styles.bugsHeader}>
                <h3>Known Bugs</h3>
                <button className={styles.addButton}>Report Bug</button>
              </div>

              <div className={styles.bugsList}>
                {productData.bugs.map((bug) => (
                  <div
                    key={bug.id}
                    className={`${styles.bugItem} ${getBugSeverityClass(
                      bug.severity
                    )}`}
                  >
                    <div className={styles.bugHeader}>
                      <h4 className={styles.bugTitle}>{bug.title}</h4>
                      <span className={styles.severityBadge}>
                        {bug.severity}
                      </span>
                    </div>

                    <div className={styles.bugDetails}>
                      <span className={styles.bugDetail}>
                        <span className={styles.detailLabel}>Affects:</span>
                        {bug.affectedFeature}
                      </span>

                      <span className={styles.bugDetail}>
                        <span className={styles.detailLabel}>Status:</span>
                        {bug.status}
                      </span>
                    </div>

                    <p className={styles.bugDescription}>{bug.description}</p>

                    <div className={styles.bugActions}>
                      <button className={styles.actionButton}>Fix</button>
                      <button className={styles.actionButton}>Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tech-stack" && (
            <div className={styles.techStackTab}>
              <div className={styles.emptyState}>
                <p>Tech Stack management coming soon!</p>
              </div>
            </div>
          )}

          {activeTab === "releases" && (
            <div className={styles.releasesTab}>
              <div className={styles.emptyState}>
                <p>Release management coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDevelopment;
