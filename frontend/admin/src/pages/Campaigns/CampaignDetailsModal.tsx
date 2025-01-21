import React from "react";
import { Typography, Modal } from "@mui/material";
import { StyledButton } from "@styles/button.styles";
import { Campaign } from "@models/Campaign";
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
  const capitalize = (text: string): string =>
    text.charAt(0).toUpperCase() + text.slice(1);

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
              <strong>Reward Type:</strong> {campaign.rewardType}
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
                {campaign.eligibilityCriteria.map((criterion, index) => (
                  <li key={index}>
                    {criterion.name === "eKYC" && `eKYC: ${criterion.eligible}`}
                    {criterion.name === "Transaction" &&
                      criterion.transaction?.type &&
                      `Transaction: ${capitalize(
                        criterion.transaction?.type
                      )} with count ${criterion.transaction?.count}`}
                    {criterion.name === "TransactionFlow" &&
                      criterion.transactionFlow?.flow &&
                      `TransactionFlow: ${capitalize(
                        criterion.transactionFlow?.flow
                      )} of ${criterion.transactionFlow?.amount}`}
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
