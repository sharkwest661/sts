// src/components/common/Achievements.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Achievements.module.scss";
import Modal from "./Modal";
import { useAchievementStore } from "../../store";

const Achievements = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Get achievements from store
  const achievements = useAchievementStore((state) => state.achievements);
  const claimAchievementReward = useAchievementStore(
    (state) => state.claimAchievementReward
  );

  // Filter achievements by category
  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  // Group achievements by category for stats
  const achievementsByCategory = {
    company: achievements.filter((a) => a.category === "company"),
    team: achievements.filter((a) => a.category === "team"),
    product: achievements.filter((a) => a.category === "product"),
    marketing: achievements.filter((a) => a.category === "marketing"),
    investor: achievements.filter((a) => a.category === "investor"),
  };

  // Count unlocked achievements
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Get achievement details
  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
  };

  // Close achievement details
  const handleCloseDetails = () => {
    setSelectedAchievement(null);
  };

  // Claim reward
  const handleClaimReward = (achievementId) => {
    const result = claimAchievementReward(achievementId);

    if (result.success) {
      // Close details after claiming reward
      handleCloseDetails();
    }
  };

  // Get category label
  const getCategoryLabel = (category) => {
    switch (category) {
      case "company":
        return "Company";
      case "team":
        return "Team";
      case "product":
        return "Product";
      case "marketing":
        return "Marketing";
      case "investor":
        return "Investors";
      default:
        return category;
    }
  };

  // Format unlock date
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get reward description
  const getRewardDescription = (reward) => {
    if (!reward) return "No reward";

    switch (reward.type) {
      case "cash":
        return `$${reward.value.toLocaleString()} cash`;
      case "reputation":
        return `+${reward.value} ${reward.subtype} reputation`;
      case "users":
        return `+${reward.value} users`;
      case "teamBoost":
        return `+${reward.value} team morale`;
      default:
        return "Unknown reward";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Achievements" size="large">
      <div className={styles.achievementsContainer}>
        <div className={styles.achievementsHeader}>
          <div className={styles.achievementProgress}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>Progress:</span>
              <span className={styles.progressValue}>
                {unlockedCount}/{totalCount} ({completionPercentage}%)
              </span>
            </div>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.categoryStats}>
            {Object.entries(achievementsByCategory).map(
              ([category, categoryAchievements]) => {
                const unlockedInCategory = categoryAchievements.filter(
                  (a) => a.unlocked
                ).length;
                const totalInCategory = categoryAchievements.length;

                return (
                  <div
                    key={category}
                    className={`${styles.categoryStat} ${
                      selectedCategory === category ? styles.active : ""
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span className={styles.categoryName}>
                      {getCategoryLabel(category)}
                    </span>
                    <span className={styles.categoryCount}>
                      {unlockedInCategory}/{totalInCategory}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className={styles.categoryFilter}>
          <button
            className={`${styles.categoryButton} ${
              selectedCategory === "all" ? styles.active : ""
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>

          {Object.keys(achievementsByCategory).map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${
                selectedCategory === category ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        <div className={styles.achievementsList}>
          <AnimatePresence>
            {filteredAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                layoutId={achievement.id}
                className={`${styles.achievementCard} ${
                  achievement.unlocked ? styles.unlocked : styles.locked
                }`}
                onClick={() => handleAchievementClick(achievement)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.achievementIcon}>
                  {achievement.unlocked ? achievement.icon : "?"}
                </div>
                <div className={styles.achievementInfo}>
                  <h4 className={styles.achievementTitle}>
                    {achievement.title}
                  </h4>
                  <p className={styles.achievementDescription}>
                    {achievement.unlocked
                      ? achievement.description
                      : achievement.hidden
                      ? "Hidden achievement"
                      : achievement.description}
                  </p>

                  {achievement.unlocked &&
                    achievement.reward &&
                    !achievement.rewardClaimed && (
                      <div className={styles.rewardBadge}>
                        Reward available!
                      </div>
                    )}

                  {achievement.unlocked && achievement.unlockDate && (
                    <div className={styles.unlockDate}>
                      Unlocked: {formatDate(achievement.unlockDate)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedAchievement && (
        <Modal
          isOpen={!!selectedAchievement}
          onClose={handleCloseDetails}
          title={
            selectedAchievement.unlocked
              ? selectedAchievement.title
              : "Achievement Details"
          }
          size="small"
        >
          <div className={styles.achievementDetails}>
            <div className={styles.detailsIcon}>
              {selectedAchievement.unlocked ? selectedAchievement.icon : "?"}
            </div>

            <h3 className={styles.detailsTitle}>{selectedAchievement.title}</h3>

            <p className={styles.detailsDescription}>
              {selectedAchievement.unlocked
                ? selectedAchievement.description
                : selectedAchievement.hidden
                ? "This achievement is hidden until you unlock it."
                : selectedAchievement.description}
            </p>

            {selectedAchievement.unlocked && (
              <div className={styles.detailsUnlocked}>
                <span>
                  Unlocked on {formatDate(selectedAchievement.unlockDate)}
                </span>
              </div>
            )}

            {selectedAchievement.unlocked && selectedAchievement.reward && (
              <div className={styles.detailsReward}>
                <h4>Reward:</h4>
                <p>{getRewardDescription(selectedAchievement.reward)}</p>

                {!selectedAchievement.rewardClaimed && (
                  <button
                    className={styles.claimButton}
                    onClick={() => handleClaimReward(selectedAchievement.id)}
                  >
                    Claim Reward
                  </button>
                )}

                {selectedAchievement.rewardClaimed && (
                  <div className={styles.claimedBadge}>Reward claimed</div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default Achievements;
