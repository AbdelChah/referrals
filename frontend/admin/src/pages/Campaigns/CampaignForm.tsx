import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { createCampaign } from "../../services/campaignService";
import { EligibilityCriteria } from "../../Models/Campaign";
import {
  FormContainer,
  DateFieldsRow,
  Label,
  InputField,
  ErrorMessage,
  DateField,
  SelectField,
  NoCriteriaMessage,
  CriteriaContainer,
  CriteriaLabel,
  RemoveButton,
  Button,
  AddButton,
  CriteriaRow,
  RewardFieldsRow,
} from "./CampaignForm.styles";
import { mapEligibilityCriteriaToApi } from "../../utils/mapEligibilityCriteriaToApi";
import { toast } from "react-toastify";
import { fetchMultiValues } from "../../services/multiValueService";

interface TransactionType {
  id: string;
  en: string;
  ar: string;
}

const CampaignForm: React.FC = () => {
  const location = useLocation();
  const { campaign } = location.state || {};
  const application = import.meta.env.VITE_APPLICATION || "bobfinance";
  const [criteriaList, setCriteriaList] = useState<EligibilityCriteria[]>(
    campaign ? campaign.eligibilityCriteria : []
  );
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    []
  );

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTransactionTypes = async () => {
      try {
        const response = await fetchMultiValues(application);
        if (response) {
          setTransactionTypes(response.transaction.values);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactionTypes();
  }, [application]);

  const formik = useFormik({
    initialValues: {
      campaignName: campaign ? campaign.campaignName : "",
      fromDate: campaign ? campaign.startDate : "",
      toDate: campaign ? campaign.endDate : "",
      rewardType: campaign ? campaign.rewardType : "Cashback",
      rewardAmount: campaign ? campaign.rewardAmount : 0,
      rewardCurrency: campaign ? campaign.rewardCurrency : "USD",
      eligibilityCriteria: JSON.stringify(criteriaList),
      minReferees: campaign ? campaign.minReferees || 1 : 1,
    },
    validationSchema: Yup.object({
      campaignName: Yup.string().required("Campaign Name is required"),
      fromDate: Yup.date().required("Start Date is required"),
      toDate: Yup.date()
        .required("End Date is required")
        .test(
          "is-greater-than-fromDate",
          "End Date must be later than Start Date",
          function (value) {
            const { fromDate } = this.parent;
            return !fromDate || new Date(fromDate) <= new Date(value);
          }
        ),
      rewardType: Yup.string().required("Reward Type is required"),
      rewardAmount: Yup.number()
        .required("Amount required")
        .positive("Amount must be positive")
        .test(
          "is-cashback-required", // Custom test name
          "Amount is required for Cashback", // Error message
          function (value) {
            const { rewardType } = this.parent;
            if (rewardType === "Cashback" && !value) {
              return false; // Validation fails if rewardType is "cashback" and rewardAmount is not provided
            }
            return true; // Otherwise, validation passes
          }
        ),
      rewardCurrency: Yup.string()
        .required("Currency required")
        .test(
          "is-cashback-required", // Custom test name
          "Currency is required for Cashback", // Error message
          function (value) {
            const { rewardType } = this.parent; // Access other fields in the schema
            if (rewardType === "Cashback" && !value) {
              return false; // Validation fails if rewardType is "cashback" and rewardCurrency is not provided
            }
            return true; // Otherwise, validation passes
          }
        ),
      eligibilityCriteria: Yup.string()
        .required("Eligibility Criteria is required")
        .test(
          "valid-criteria-combination",
          "Invalid eligibility criteria combination",
          function (value) {
            const criteria = JSON.parse(value || "[]");

            const hasEkyc = criteria.some(
              (item: { name: string }) => item.name === "eKYC"
            );
            const hasTransaction = criteria.some(
              (item: { name: string }) => item.name === "Transaction"
            );
            const hasTransactionFlow = criteria.some(
              (item: { name: string }) => item.name === "TransactionFlow"
            );

            if (!hasEkyc && !hasTransaction && !hasTransactionFlow) {
              return this.createError({
                message:
                  "You must provide at least one eKYC, Transaction, or Transaction Flow criteria.",
              });
            }

            if (hasTransaction && hasTransactionFlow) {
              return this.createError({
                message:
                  "You cannot have both Transaction and Transaction Flow criteria together.",
              });
            }

            return true;
          }
        ),

      minReferees: Yup.number()
        .required("Minimum number of referees is required")
        .positive("Number must be positive"),
    }),
    onSubmit: async (values) => {
      try {
        const formData: any = {
          name: values.campaignName,
          start_date: values.fromDate,
          end_date: values.toDate,
          reward_criteria: mapEligibilityCriteriaToApi(
            criteriaList,
            values.rewardAmount,
            values.rewardCurrency,
            values.rewardType
          ),
          min_referees: values.minReferees,
          reward_type: values.rewardType, // Explicitly add reward type
          status: "active", // Adjust if the API expects dynamic statuses
        };

        const response = await createCampaign(formData);

        if (!response.res) {
          toast.error("Campaign creation failed:", response.responseError.msg);
          return;
        }

        toast.success("Campaign created successfully");
        formik.resetForm();
        setCriteriaList([]);
        navigate("/campaigns");
      } catch (error) {
        console.error(error);
        toast.error(`An error occurred while creating the campaign: ${error}`);
      }
    },
  });

  const handleCriteriaChange = (
    index: number,
    field: keyof EligibilityCriteria,
    value: any
  ) => {
    const updatedCriteriaList = [...criteriaList];
    updatedCriteriaList[index] = {
      ...updatedCriteriaList[index],
      [field]: value,
    };
    setCriteriaList(updatedCriteriaList);
    formik.setFieldValue(
      "eligibilityCriteria",
      JSON.stringify(updatedCriteriaList)
    );
  };

  const handleAddCriteria = () => {
    const newCriteriaList: EligibilityCriteria[] = [
      ...criteriaList,
      {
        name: "eKYC",
        eligible: true,
        reward_amount: 0,
        currency: "",
      },
    ];
    setCriteriaList(newCriteriaList);
    formik.setFieldValue(
      "eligibilityCriteria",
      JSON.stringify(newCriteriaList)
    ); // Update eligibilityCriteria field in Formik
  };

  const handleRemoveCriteria = (index: number) => {
    const updatedCriteriaList = criteriaList.filter((_, i) => i !== index);
    setCriteriaList(updatedCriteriaList);
    formik.setFieldValue(
      "eligibilityCriteria",
      JSON.stringify(updatedCriteriaList)
    );
  };

  return (
    <FormContainer>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <Label htmlFor="campaignName">Campaign Name</Label>
          <InputField
            id="campaignName"
            name="campaignName"
            type="text"
            value={formik.values.campaignName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage>
            {typeof formik.errors.campaignName === "string"
              ? formik.errors.campaignName
              : ""}
          </ErrorMessage>
        </div>

        <DateFieldsRow>
          <DateField>
            <Label htmlFor="fromDate">From Date</Label>
            <InputField
              id="fromDate"
              name="fromDate"
              type="date"
              value={formik.values.fromDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMessage>
              {typeof formik.errors.fromDate === "string"
                ? formik.errors.fromDate
                : ""}
            </ErrorMessage>
          </DateField>
          <DateField>
            <Label htmlFor="toDate">To Date</Label>
            <InputField
              id="toDate"
              name="toDate"
              type="date"
              value={formik.values.toDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <ErrorMessage>
              {typeof formik.errors.toDate === "string"
                ? formik.errors.toDate
                : ""}
            </ErrorMessage>
          </DateField>
        </DateFieldsRow>

        <RewardFieldsRow>
          <div>
            <Label htmlFor="rewardType">Reward Type</Label>
            <SelectField
              id="rewardType"
              name="rewardType"
              value={formik.values.rewardType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="Cashback">Cashback</option>
              {/* <option value="points">Points</option>
              <option value="vouchers">Vouchers</option> */}
            </SelectField>
            <ErrorMessage>
              {typeof formik.errors.rewardType === "string"
                ? formik.errors.rewardType
                : ""}
            </ErrorMessage>
          </div>

          {formik.values.rewardType === "Cashback" && (
            <>
              <div>
                <Label htmlFor="rewardAmount">Amount</Label>
                <InputField
                  id="rewardAmount"
                  name="rewardAmount"
                  type="number"
                  value={formik.values.rewardAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <ErrorMessage>
                  {typeof formik.errors.rewardAmount === "string"
                    ? formik.errors.rewardAmount
                    : ""}
                </ErrorMessage>
              </div>

              <div>
                <Label htmlFor="rewardCurrency">Currency</Label>
                <SelectField
                  id="rewardCurrency"
                  name="rewardCurrency"
                  value={formik.values.rewardCurrency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="USD">USD</option>
                  <option value="LBP">LBP</option>
                </SelectField>
                <ErrorMessage>
                  {typeof formik.errors.rewardCurrency === "string"
                    ? formik.errors.rewardCurrency
                    : ""}
                </ErrorMessage>
              </div>
            </>
          )}
        </RewardFieldsRow>
        <div>
          <Label htmlFor="minReferees">Minimum Referees</Label>
          <InputField
            id="minReferees"
            name="minReferees"
            type="number"
            value={formik.values.minReferees}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <ErrorMessage>
            {typeof formik.errors.minReferees === "string"
              ? formik.errors.minReferees
              : ""}
          </ErrorMessage>
        </div>
        <div>
          <Label>Eligibility Criteria</Label>
          <ErrorMessage>
            {formik.touched.eligibilityCriteria &&
            typeof formik.errors.eligibilityCriteria === "string"
              ? formik.errors.eligibilityCriteria
              : ""}
          </ErrorMessage>
          {criteriaList.length === 0 ? (
            <NoCriteriaMessage>
              No criteria added yet. Click "Add Criteria" to begin.
            </NoCriteriaMessage>
          ) : (
            criteriaList.map((criteria, index) => (
              <CriteriaContainer key={index}>
                <CriteriaLabel>Criteria {index + 1}</CriteriaLabel>
                <CriteriaRow>
                  <div>
                    <Label htmlFor={`criteriaType-${index}`}>Type</Label>
                    <SelectField
                      id={`criteriaType-${index}`}
                      name={`criteriaType-${index}`}
                      value={criteria.name}
                      onChange={(e: { target: { value: any } }) =>
                        handleCriteriaChange(index, "name", e.target.value)
                      }
                    >
                      <option value="eKYC">eKYC</option>
                      <option value="Transaction">Transaction</option>
                      <option value="TransactionFlow">Transaction Flow </option>
                    </SelectField>
                  </div>

                  {/* Conditional rendering based on the selected type */}
                  {criteria.name === "eKYC" && (
                    <div>
                      <Label htmlFor={`eligible-${index}`}>Eligible</Label>
                      <InputField
                        id={`eligible-${index}`}
                        name={`eligible-${index}`}
                        type="checkbox"
                        checked={criteria.eligible || false}
                        onChange={(e: { target: { checked: any } }) =>
                          handleCriteriaChange(
                            index,
                            "eligible",
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  )}

                  {criteria.name === "Transaction" && (
                    <>
                      <div>
                        <Label htmlFor={`transactionType-${index}`}>
                          Transaction Type
                        </Label>
                        <SelectField
                          id={`transactionType-${index}`}
                          name={`transactionType-${index}`}
                          value={
                            criteria.transaction?.transactionType?.[0] || "P2P"
                          } // Select the first element from the array
                          onChange={(e: { target: { value: string } }) =>
                            handleCriteriaChange(index, "transaction", {
                              ...criteria.transaction,
                              transactionType: [e.target.value], // Ensure the selected value is stored as an array
                            })
                          }
                        >
                          {transactionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.en}
                            </option>
                          ))}
                        </SelectField>
                      </div>

                      <div>
                        <Label htmlFor={`transactionCount-${index}`}>
                          Count
                        </Label>
                        <InputField
                          id={`transactionCount-${index}`}
                          name={`transactionCount-${index}`}
                          type="number"
                          value={criteria.transaction?.minCount || ""}
                          onChange={(e: { target: { value: string } }) =>
                            handleCriteriaChange(index, "transaction", {
                              ...criteria.transaction,
                              minCount: e.target.value
                                ? parseInt(e.target.value, 10)
                                : 0,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {criteria.name === "TransactionFlow" && (
                    <>
                      <div>
                        <Label htmlFor={`transactionFlow-${index}`}>Flow</Label>
                        <SelectField
                          id={`transactionFlow-${index}`}
                          name={`transactionFlow-${index}`}
                          value={
                            criteria.transactionFlow?.debitOrCredit || "debit"
                          }
                          onChange={(e) => {
                            handleCriteriaChange(index, "transactionFlow", {
                              ...criteria.transactionFlow,
                              debitOrCredit: e.target.value,
                            });
                          }}
                        >
                          <option value="debit">Debit</option>
                          <option value="credit">Credit</option>
                        </SelectField>
                      </div>

                      <div>
                        <Label htmlFor={`transactionAmount-${index}`}>
                          Amount
                        </Label>
                        <InputField
                          id={`transactionAmount-${index}`}
                          name={`transactionAmount-${index}`}
                          type="number"
                          value={criteria.transactionFlow?.minAmount || ""}
                          onChange={(e: { target: { value: string } }) =>
                            handleCriteriaChange(index, "transactionFlow", {
                              ...criteria.transactionFlow,
                              minAmount: e.target.value
                                ? parseInt(e.target.value, 10)
                                : 0,
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </CriteriaRow>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveCriteria(index)}
                >
                  Remove
                </RemoveButton>
              </CriteriaContainer>
            ))
          )}
        </div>

        <AddButton type="button" onClick={handleAddCriteria}>
          Add Criteria
        </AddButton>

        <Button type="submit">Submit</Button>
      </form>
    </FormContainer>
  );
};

export default CampaignForm;
