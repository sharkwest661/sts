// src/components/team/TeamManagement.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./TeamManagement.module.scss";
import useTeamStore from "../../store/teamStore";
import { useGameStore } from "../../store";
import TeamMember from "./TeamMember";
import { useStoreSelector } from "../../utils/useStoreSelector";

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState("team");
  const [showRecruitModal, setShowRecruitModal] = useState(false);

  // Get team state using proper selectors
  const teamMembers = useStoreSelector(
    useTeamStore,
    (state) => state.teamMembers
  );
  const availableRecruits = useStoreSelector(
    useTeamStore,
    (state) => state.availableRecruits
  );

  // Get team actions using separate selector
  const hireTeamMember = useStoreSelector(
    useTeamStore,
    (state) => state.hireTeamMember
  );
  const fireTeamMember = useStoreSelector(
    useTeamStore,
    (state) => state.fireTeamMember
  );
  const generateRecruits = useStoreSelector(
    useTeamStore,
    (state) => state.generateRecruits
  );

  // Get game state using proper selectors
  const cash = useStoreSelector(useGameStore, (state) => state.cash);
  const officeCapacity = useStoreSelector(
    useGameStore,
    (state) => state.officeCapacity
  );

  // Generate recruits when viewing the recruitment tab
  useEffect(() => {
    if (activeTab === "recruit" && availableRecruits.length === 0) {
      generateRecruits();
    }
  }, [activeTab, availableRecruits.length, generateRecruits]);

  // Calculate team stats - memoize to prevent recalculation
  const teamStats = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) {
      return {
        totalSalary: 0,
        headcount: 0,
        averageMorale: 0,
      };
    }

    return teamMembers.reduce(
      (stats, member) => ({
        totalSalary: stats.totalSalary + (member.salary || 0),
        headcount: stats.headcount + 1,
        averageMorale:
          (stats.averageMorale * stats.headcount + member.morale) /
          (stats.headcount + 1),
      }),
      {
        totalSalary: 0,
        headcount: 0,
        averageMorale: 0,
      }
    );
  }, [teamMembers]);

  // Handle hiring a team member - use useCallback to prevent function recreation
  const handleHire = useCallback(
    (recruit) => {
      if (teamMembers.length >= officeCapacity) {
        alert(
          "Office at maximum capacity! Upgrade your office to hire more team members."
        );
        return;
      }

      if (cash < recruit.salaryExpectation) {
        alert("Not enough cash to hire this team member!");
        return;
      }

      const result = hireTeamMember(recruit);
      if (!result.success) {
        alert(result.message);
      }
    },
    [teamMembers.length, officeCapacity, cash, hireTeamMember]
  );

  // Handle firing a team member - use useCallback to prevent function recreation
  const handleFire = useCallback(
    (memberId) => {
      if (
        confirm(
          "Are you sure you want to fire this team member? This may affect team morale."
        )
      ) {
        fireTeamMember(memberId);
      }
    },
    [fireTeamMember]
  );

  // Handle tab change - use useCallback to prevent function recreation
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Format currency - use memoize to prevent function recreation
  const formatCurrency = useMemo(() => {
    return (value) => value.toLocaleString();
  }, []);

  return (
    <div className={styles.teamManagement}>
      <header className={styles.teamHeader}>
        <h2>Team Management</h2>

        <div className={styles.teamStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Team Size</span>
            <span className={styles.statValue}>
              {teamMembers.length} / {officeCapacity}
            </span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Monthly Salaries</span>
            <span className={styles.statValue}>
              ${formatCurrency(teamStats.totalSalary || 0)}
            </span>
          </div>

          <div className={styles.statItem}>
            <span className={styles.statLabel}>Avg. Morale</span>
            <span className={styles.statValue}>
              {Math.round(teamStats.averageMorale || 0)}%
            </span>
          </div>
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "team" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("team")}
          >
            Your Team
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "recruit" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("recruit")}
          >
            Recruitment
          </button>

          <button
            className={`${styles.tab} ${
              activeTab === "assignments" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("assignments")}
          >
            Assignments
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "team" && (
            <div className={styles.teamTab}>
              {teamMembers.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>
                    Your team is empty. Go to recruitment to hire new team
                    members!
                  </p>
                  <button
                    className={styles.recruitButton}
                    onClick={() => handleTabChange("recruit")}
                  >
                    Find Team Members
                  </button>
                </div>
              ) : (
                <div className={styles.teamGrid}>
                  {teamMembers.map((member) => (
                    <div key={member.id} className={styles.teamMemberCard}>
                      <TeamMember member={member} detailed />
                      <div className={styles.teamMemberActions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleFire(member.id)}
                        >
                          Fire
                        </button>
                        <button className={styles.actionButton}>Manage</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "recruit" && (
            <div className={styles.recruitTab}>
              <div className={styles.recruitHeader}>
                <h3>Available Recruits</h3>
                <button
                  className={styles.refreshButton}
                  onClick={generateRecruits}
                >
                  Refresh Candidates
                </button>
              </div>

              {availableRecruits.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No candidates available. Try refreshing the list!</p>
                </div>
              ) : (
                <div className={styles.recruitsGrid}>
                  {availableRecruits.map((recruit) => (
                    <div key={recruit.id} className={styles.recruitCard}>
                      <div className={styles.recruitInfo}>
                        <h4 className={styles.recruitName}>{recruit.name}</h4>
                        <span className={styles.recruitSpecialty}>
                          {recruit.specialty}
                        </span>

                        <div className={styles.recruitSkills}>
                          {Object.entries(recruit.skills).map(
                            ([skill, value]) => (
                              <div key={skill} className={styles.skillItem}>
                                <span className={styles.skillLabel}>
                                  {skill}
                                </span>
                                <div className={styles.skillBarContainer}>
                                  <div
                                    className={styles.skillBar}
                                    style={{ width: `${value}%` }}
                                  ></div>
                                </div>
                                <span className={styles.skillValue}>
                                  {value}
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        <div className={styles.recruitPersonality}>
                          <span className={styles.personalityLabel}>
                            Personality:
                          </span>
                          <div className={styles.personalityTraits}>
                            {recruit.personality.map((trait) => (
                              <span
                                key={trait}
                                className={styles.personalityTrait}
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.recruitSalary}>
                          <span className={styles.salaryLabel}>
                            Salary Expectation:
                          </span>
                          <span className={styles.salaryValue}>
                            ${recruit.salaryExpectation.toLocaleString()}/month
                          </span>
                        </div>
                      </div>

                      <button
                        className={styles.hireButton}
                        onClick={() => handleHire(recruit)}
                        disabled={
                          cash < recruit.salaryExpectation ||
                          teamMembers.length >= officeCapacity
                        }
                      >
                        Hire
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "assignments" && (
            <div className={styles.assignmentsTab}>
              <div className={styles.emptyState}>
                <p>Team assignments functionality coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(TeamManagement);
