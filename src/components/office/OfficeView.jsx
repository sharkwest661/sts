// src/components/office/OfficeView.jsx
import React, { useState, useMemo } from "react";
import styles from "./OfficeView.module.scss";
import useGameStore from "../../store/gameStore";
import useTeamStore from "../../store/teamStore";
import TeamMember from "../team/TeamMember";
import { motion, AnimatePresence } from "framer-motion";

const OfficeView = () => {
  // Get necessary state from stores
  const officeLevel = useGameStore((state) => state.officeLevel);
  const officeCapacity = useGameStore((state) => state.officeCapacity);
  const cash = useGameStore((state) => state.cash);
  const upgradeOffice = useGameStore((state) => state.upgradeOffice);

  // Get team members - only get the raw data
  const teamMembers = useTeamStore((state) => state.teamMembers);

  // Local state for office interactions
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [highlightedMember, setHighlightedMember] = useState(null);

  // Calculate team stats using useMemo instead of calling the store method directly
  const teamStats = useMemo(() => {
    // Simple calculation if team is empty
    if (!teamMembers || teamMembers.length === 0) {
      return {
        totalSalary: 0,
        averageMorale: 0,
        averageEnergy: 0,
        coding: 0,
        design: 0,
        marketing: 0,
        business: 0,
      };
    }

    // Calculate stats from team members
    return teamMembers.reduce(
      (stats, member) => {
        return {
          totalSalary: stats.totalSalary + (member.salary || 0),
          averageMorale:
            (stats.averageMorale * stats.count + (member.morale || 0)) /
            (stats.count + 1),
          averageEnergy:
            (stats.averageEnergy * stats.count + (member.energy || 0)) /
            (stats.count + 1),
          coding: stats.coding + (member.skills?.coding || 0),
          design: stats.design + (member.skills?.design || 0),
          marketing: stats.marketing + (member.skills?.marketing || 0),
          business: stats.business + (member.skills?.business || 0),
          count: stats.count + 1,
        };
      },
      {
        totalSalary: 0,
        averageMorale: 0,
        averageEnergy: 0,
        coding: 0,
        design: 0,
        marketing: 0,
        business: 0,
        count: 0,
      }
    );
  }, [teamMembers]);

  // Office upgrade cost calculation
  const upgradeCost = 5000 * (officeLevel + 1);
  const canAffordUpgrade = cash >= upgradeCost;

  // Office environment details based on level - make this a useMemo to avoid recalculation
  const getOfficeTier = (level = officeLevel) => {
    switch (level) {
      case 0:
        return {
          name: "Garage Office",
          description: "A humble beginning in your garage. Cramped but cheap!",
          bonuses: { morale: -10, productivity: -5 },
        };
      case 1:
        return {
          name: "Co-working Space",
          description:
            "A shared workspace with other startups. Slightly better than the garage.",
          bonuses: { morale: 0, productivity: 0 },
        };
      case 2:
        return {
          name: "Small Office",
          description: "Your own dedicated space. Nothing fancy but it works.",
          bonuses: { morale: 5, productivity: 5 },
        };
      case 3:
        return {
          name: "Modern Office",
          description:
            "A sleek office with modern amenities. Your team is impressed!",
          bonuses: { morale: 10, productivity: 10 },
        };
      case 4:
        return {
          name: "Tech Campus",
          description:
            "A sprawling campus with all the startup perks. Free snacks included!",
          bonuses: { morale: 20, productivity: 15 },
        };
      default:
        return {
          name: "Luxury Headquarters",
          description:
            "The pinnacle of startup excess. Silicon Valley would be jealous.",
          bonuses: { morale: 25, productivity: 20 },
        };
    }
  };

  // Memoize the current office tier to prevent recalculation on every render
  const officeTier = useMemo(() => getOfficeTier(), [officeLevel]);

  // Memoize the next office tier for the modal
  const nextOfficeTier = useMemo(
    () => getOfficeTier(officeLevel + 1),
    [officeLevel]
  );

  // Handle office upgrade
  const handleUpgrade = () => {
    if (canAffordUpgrade) {
      const result = upgradeOffice();
      if (result) {
        setShowUpgradeModal(false);
      }
    }
  };

  // Animation variants for team members
  const memberVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <div className={styles.officeContainer}>
      <div className={`${styles.officeView} ${styles[`tier${officeLevel}`]}`}>
        <header className={styles.officeHeader}>
          <h2>{officeTier.name}</h2>
          <div className={styles.officeStats}>
            <span>
              {teamMembers.length} / {officeCapacity} team members
            </span>
            <button
              className={styles.upgradeButton}
              onClick={() => setShowUpgradeModal(true)}
              disabled={!canAffordUpgrade}
            >
              Upgrade Office (${upgradeCost.toLocaleString()})
            </button>
          </div>
        </header>

        <div className={styles.officeBonuses}>
          <span>Morale Bonus: {officeTier.bonuses.morale}%</span>
          <span>Productivity Bonus: {officeTier.bonuses.productivity}%</span>
        </div>

        <p className={styles.officeDescription}>{officeTier.description}</p>

        <div className={styles.teamArea}>
          <h3>Your Team</h3>

          <div className={styles.teamGrid}>
            <AnimatePresence>
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className={styles.teamMemberWrapper}
                  variants={memberVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setHighlightedMember(member.id)}
                >
                  <TeamMember
                    member={member}
                    isHighlighted={highlightedMember === member.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty slots */}
            {Array.from({ length: officeCapacity - teamMembers.length }).map(
              (_, index) => (
                <div key={`empty-${index}`} className={styles.emptySlot}>
                  <div className={styles.emptySlotIcon}>+</div>
                  <span>Empty Desk</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Upgrade Office</h3>
            <p>
              Upgrade from {officeTier.name} to {nextOfficeTier.name}?
            </p>
            <p>
              This will cost ${upgradeCost.toLocaleString()} and increase your
              office capacity.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleUpgrade}
                disabled={!canAffordUpgrade}
              >
                Upgrade
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficeView;
