// src/components/modals/InvestorPitchModal.jsx
import React, { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useInvestorStore, useGameStore } from "../../store";
import InvestorPitchGame from "../minigames/InvestorPitchGame";
import styles from "./InvestorPitchModal.module.scss";

const InvestorPitchModal = ({ investor, onComplete }) => {
  const [showGame, setShowGame] = useState(false);
  const [pitchResult, setPitchResult] = useState(null);
  const [investmentOffer, setInvestmentOffer] = useState(null);

  const { closeModal } = useModal();
  const preparePitch = useInvestorStore((state) => state.preparePitch);
  const acceptOffer = useInvestorStore((state) => state.acceptOffer);
  const rejectOffer = useInvestorStore((state) => state.rejectOffer);

  const companyValuation = useGameStore((state) => state.companyValuation);

  // Get investor preference breakdown
  const investorPreferences = {
    techInterest: Math.random() * 50 + 30, // 30-80
    businessInterest: Math.random() * 50 + 30, // 30-80
    innovationInterest: Math.random() * 50 + 30, // 30-80
    metricsInterest: Math.random() * 50 + 30, // 30-80
    focusAreas: investor.focusAreas || ["tech", "business"],
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num?.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  // Start the pitch game
  const handleStartPitch = () => {
    setShowGame(true);
  };

  // Handle canceling the pitch
  const handleCancelPitch = () => {
    setShowGame(false);
  };

  // Handle pitch completion
  const handlePitchComplete = (result) => {
    setPitchResult(result);
    setShowGame(false);

    // Prepare a real pitch based on game result
    const pitchData = {
      pitchQuality: result.score,
      focusAreas: investor.focusAreas,
    };

    const pitchResponse = preparePitch(investor.id, pitchData);

    // If successful and investor is interested, set the offer
    if (
      pitchResponse.success &&
      pitchResponse.interested &&
      pitchResponse.offer
    ) {
      setInvestmentOffer(pitchResponse.offer);
    }

    // Notify parent component
    if (onComplete) {
      onComplete({
        ...result,
        investor,
        offer: pitchResponse.offer,
      });
    }
  };

  // Handle accepting the investment offer
  const handleAcceptOffer = () => {
    if (investmentOffer) {
      acceptOffer(investor.id, investmentOffer);
      closeModal();
    }
  };

  // Handle rejecting the investment offer
  const handleRejectOffer = () => {
    if (investor.id) {
      rejectOffer(investor.id);
      closeModal();
    }
  };

  // Handle closing the modal
  const handleClose = () => {
    closeModal();
  };

  return (
    <div className={styles.investorPitchModal}>
      {showGame ? (
        <InvestorPitchGame
          investorPreferences={investorPreferences}
          onComplete={handlePitchComplete}
          onCancel={handleCancelPitch}
          difficulty="medium"
        />
      ) : pitchResult ? (
        <div className={styles.pitchResult}>
          <div
            className={`${styles.resultHeader} ${
              pitchResult.investorReaction === "excited"
                ? styles.excited
                : pitchResult.investorReaction === "interested"
                ? styles.interested
                : styles.skeptical
            }`}
          >
            <h3>
              {pitchResult.investorReaction === "excited"
                ? "Pitch Successful!"
                : pitchResult.investorReaction === "interested"
                ? "Investor Interested"
                : "Investor Skeptical"}
            </h3>
          </div>

          <div className={styles.resultContent}>
            <div className={styles.investorFeedback}>
              <div className={styles.investorImage}>
                {pitchResult.investorReaction === "excited"
                  ? "😃"
                  : pitchResult.investorReaction === "interested"
                  ? "🤔"
                  : "😕"}
              </div>

              <div className={styles.feedbackText}>
                <p>
                  {pitchResult.investorReaction === "excited"
                    ? `${investor.name} was very impressed by your pitch. They believe in your vision and are excited about the potential of your startup.`
                    : pitchResult.investorReaction === "interested"
                    ? `${investor.name} found your pitch interesting. They see potential in your startup but have some reservations.`
                    : `${investor.name} was not convinced by your pitch. They have concerns about your business model and execution strategy.`}
                </p>
              </div>
            </div>

            {investmentOffer ? (
              <div className={styles.offerSection}>
                <h4 className={styles.offerTitle}>Investment Offer</h4>

                <div className={styles.offerDetails}>
                  <div className={styles.offerItem}>
                    <span className={styles.offerLabel}>Amount:</span>
                    <span className={styles.offerValue}>
                      ${formatNumber(investmentOffer.amount)}
                    </span>
                  </div>

                  <div className={styles.offerItem}>
                    <span className={styles.offerLabel}>Equity:</span>
                    <span className={styles.offerValue}>
                      {investmentOffer.equity}%
                    </span>
                  </div>

                  <div className={styles.offerItem}>
                    <span className={styles.offerLabel}>Valuation:</span>
                    <span className={styles.offerValue}>
                      ${formatNumber(investmentOffer.valuation)}
                    </span>
                  </div>

                  <div className={styles.offerExpectations}>
                    <span className={styles.expectationsLabel}>
                      Expectations:
                    </span>
                    <p className={styles.expectationsText}>
                      {investmentOffer.expectations}
                    </p>
                  </div>
                </div>

                <div className={styles.offerActions}>
                  <button
                    className={styles.acceptButton}
                    onClick={handleAcceptOffer}
                  >
                    Accept Offer
                  </button>

                  <button
                    className={styles.rejectButton}
                    onClick={handleRejectOffer}
                  >
                    Reject Offer
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.noOfferSection}>
                <p className={styles.noOfferMessage}>
                  {pitchResult.investorReaction === "interested"
                    ? `${investor.name} is interested but needs more convincing before making an offer. You may want to improve your product or traction before approaching them again.`
                    : `${investor.name} is not interested in investing at this time. Consider improving your product, gaining more traction, or approaching a different investor.`}
                </p>

                <button className={styles.closeButton} onClick={handleClose}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.investorProfile}>
          <div className={styles.investorHeader}>
            <h3 className={styles.investorName}>{investor.name}</h3>
            <span className={styles.investorType}>{investor.type}</span>
          </div>

          <div className={styles.investorInterest}>
            <div className={styles.interestHeader}>
              <span className={styles.interestLabel}>Interest Level:</span>
              <span className={styles.interestValue}>{investor.interest}%</span>
            </div>

            <div className={styles.interestBarContainer}>
              <div
                className={styles.interestBar}
                style={{ width: `${investor.interest}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.investorFocus}>
            <h4>Focus Areas:</h4>
            <div className={styles.focusAreas}>
              {investor.focusAreas?.map((area) => (
                <span key={area} className={styles.focusTag}>
                  {area.replace("_", " ")}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.companyStats}>
            <h4>Your Company Stats:</h4>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Current Valuation:</span>
              <span className={styles.statValue}>
                ${formatNumber(companyValuation)}
              </span>
            </div>
          </div>

          <div className={styles.pitchInstructions}>
            <p>
              To pitch to this investor, you'll need to select the right
              buzzwords and concepts that align with their interests. A
              successful pitch can lead to investment offers that provide cash
              in exchange for equity in your company.
            </p>
          </div>

          <div className={styles.pitchActions}>
            <button className={styles.pitchButton} onClick={handleStartPitch}>
              Start Pitch
            </button>

            <button className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function to open an investor pitch modal
export const openInvestorPitchModal = (modalUtils, investor, onComplete) => {
  return modalUtils.openModal({
    title: "Investor Pitch",
    size: "large",
    disableBackdropClose: true,
    content: ({ closeModal }) => (
      <InvestorPitchModal
        investor={investor}
        onComplete={(result) => {
          if (onComplete) onComplete(result);
        }}
      />
    ),
  });
};

export default InvestorPitchModal;
