import React from "react";
import { Typography, Modal } from "@mui/material";
import { StyledButton } from "../../styles/button.styles";
import { Campaign } from "../../Models/Campaign";
import {
  ModalContainer,
  DetailsList,
  DetailsItem,
} from "./campaignDetailsModal.styles";
import { formatDate } from "../../utils/dateUtils";

interface CampaignModalProps {
  open: boolean;
  campaign: Campaign | null;
  onClose: () => void;
}

const CampaignDetailsModal: React.FC<CampaignModalProps> = ({
  open,
  campaign,
  onClose,
}) => {
  const capitalize = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="campaign-details-modal"
      aria-describedby="campaign-details-description"
    >
      <ModalContainer>
        <Typography variant="h5" component="h2" gutterBottom>
          Campaign Details
        </Typography>
        {campaign ? (
          <DetailsList>
            <DetailsItem>
              <strong>ID:</strong> {campaign.id}
            </DetailsItem>
            <DetailsItem>
              <strong>Name:</strong> {campaign.campaignName}
            </DetailsItem>
            <DetailsItem>
              <strong>Start Date:</strong> {formatDate(campaign.startDate)}
            </DetailsItem>
            <DetailsItem>
              <strong>End Date:</strong> {formatDate(campaign.endDate)}
            </DetailsItem>

            <DetailsItem>
              <strong>Reward Amount:</strong> {campaign.rewardAmount}{" "}
              {campaign.rewardCurrency}
            </DetailsItem>
            <DetailsItem>
              <strong>Status:</strong> {campaign.status}
            </DetailsItem>
            <DetailsItem>
              <strong>Minimum Referees:</strong> {campaign.min_referees}
            </DetailsItem>
            <DetailsItem>
              <strong>Eligibility Criteria:</strong>
              <ul>
                {/* Iterate over eligibilityCriteria */}
                {campaign.eligibilityCriteria.map((criteria, index) => (
                  <li key={index}>
                    <strong>{criteria.name}:</strong>{" "}
                    {criteria.name === "Transaction" && criteria.transaction ? (
                      <>
                        {Array.isArray(criteria.transaction.transactionType)
                          ? criteria.transaction.transactionType.join(", ")
                          : criteria.transaction.transactionType}{" "}
                        {""}
                        {criteria.transaction.minCount && (
                          <>(Minimum Count: {criteria.transaction.minCount})</>
                        )}
                      </>
                    ) : null}
                    {criteria.name === "TransactionFlow" &&
                    criteria.transactionFlow ? (
                      <>
                        {capitalize(criteria.transactionFlow.debitOrCredit)}{" "}
                        with a minimum amount of{" "}
                        {criteria.transactionFlow.minAmount}
                      </>
                    ) : null}
                    {criteria.name === "Onboarding" &&
                    criteria.onBoarding !== undefined ? (
                      <>{criteria.onBoarding ? "Yes" : "No"}</>
                    ) : null}
                  </li>
                ))}
              </ul>
            </DetailsItem>
          </DetailsList>
        ) : (
          <Typography variant="body1">
            No campaign details available.
          </Typography>
        )}
        <StyledButton onClick={onClose}>Close</StyledButton>
      </ModalContainer>
    </Modal>
  );
};

export default CampaignDetailsModal;
