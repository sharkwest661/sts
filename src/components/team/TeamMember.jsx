// src/components/team/TeamMember.jsx
import React from "react";
import styles from "./TeamMember.module.scss";
import useGameStore from "../../store/gameStore";

const TeamMember = ({ member, detailed = false, isHighlighted = false }) => {
  // Get current game tick for calculating tenure
  const gameTick = useGameStore((state) => state.gameTick);

  // Calculate tenure in days (1 day = 24 * 60 ticks)
  const tenureDays = Math.floor((gameTick - member.hireDate) / (24 * 60)) || 0;

  // Helper to get morale status class
  const getMoraleStatusClass = (morale) => {
    if (morale >= 75) return styles.excellent;
    if (morale >= 50) return styles.good;
    if (morale >= 25) return styles.fair;
    return styles.poor;
  };

  // Helper to get energy status class
  const getEnergyStatusClass = (energy) => {
    if (energy >= 75) return styles.excellent;
    if (energy >= 50) return styles.good;
    if (energy >= 25) return styles.fair;
    return styles.poor;
  };

  // Get morale and energy classes
  const moraleClass = getMoraleStatusClass(member.morale);
  const energyClass = getEnergyStatusClass(member.energy);

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  // Generate avatar color based on name (consistent hashing)
  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 65%, 65%)`;
  };

  // Find the highest skill
  const highestSkill = Object.entries(member.skills).reduce(
    (max, [skill, value]) => (value > max.value ? { skill, value } : max),
    { skill: "", value: 0 }
  );

  return (
    <div
      className={`${styles.teamMember} ${
        isHighlighted ? styles.highlighted : ""
      }`}
    >
      <div
        className={styles.avatar}
        style={{ backgroundColor: getAvatarColor(member.name) }}
      >
        {getInitials(member.name)}
      </div>

      <div className={styles.memberInfo}>
        <div className={styles.nameRow}>
          <h4 className={styles.memberName}>{member.name}</h4>
          <span className={styles.memberSpecialty}>{member.specialty}</span>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Morale</span>
            <div className={styles.statusBarContainer}>
              <div
                className={`${styles.statusBar} ${moraleClass}`}
                style={{ width: `${member.morale}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Energy</span>
            <div className={styles.statusBarContainer}>
              <div
                className={`${styles.statusBar} ${energyClass}`}
                style={{ width: `${member.energy}%` }}
              ></div>
            </div>
          </div>
        </div>

        {detailed && (
          <>
            <div className={styles.skillsGrid}>
              {Object.entries(member.skills).map(([skill, value]) => (
                <div key={skill} className={styles.skillItem}>
                  <span className={styles.skillLabel}>{skill}</span>
                  <div className={styles.skillBarContainer}>
                    <div
                      className={styles.skillBar}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <span className={styles.skillValue}>{value}</span>
                </div>
              ))}
            </div>

            <div className={styles.memberDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Salary</span>
                <span className={styles.detailValue}>
                  ${member.salary.toLocaleString()}/mo
                </span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tenure</span>
                <span className={styles.detailValue}>{tenureDays} days</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Personality</span>
                <div className={styles.personalityTraits}>
                  {member.personality.map((trait) => (
                    <span key={trait} className={styles.personalityTrait}>
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!detailed && (
          <div className={styles.summaryRow}>
            <span className={styles.bestSkill}>
              Best: {highestSkill.skill} ({highestSkill.value})
            </span>
            <span className={styles.salaryInfo}>
              ${member.salary.toLocaleString()}/mo
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMember;
