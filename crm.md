# CRM File Structure

## src/app/crm
```
src/app/crm/
+- page.jsx
+- (authenticated)/
   +- layout.jsx
   +- 403/
   ¦  +- page.jsx
   +- all-enquiries/
   ¦  +- page.jsx
   +- application/
   ¦  +- page.jsx
   +- application-form/
   ¦  +- [id]/
   ¦     +- page.jsx
   +- appraisal-report/
   ¦  +- [id]/
   ¦     +- page.jsx
   +- bank-ledger/
   ¦  +- page.jsx
   +- blogs/
   ¦  +- page.jsx
   ¦  +- manage-blog/
   ¦     +- page.jsx
   +- businessloan-above-5l/
   ¦  +- page.jsx
   +- businessloan-upto-5l/
   ¦  +- page.jsx
   +- cash-management/
   ¦  +- page.jsx
   +- cheque-management/
   ¦  +- page.jsx
   ¦  +- manage-cheque-deposit/
   ¦     +- page.jsx
   +- cibil-report/
   ¦  +- page.jsx
   +- client-history/
   ¦  +- page.jsx
   +- collection-reporting/
   ¦  +- page.jsx
   +- complaints/
   ¦  +- add-complaint/
   ¦  ¦  +- page.jsx
   ¦  +- manage-complaints/
   ¦     +- page.jsx
   +- create-msb/
   ¦  +- page.jsx
   +- dashboard/
   ¦  +- page.jsx
   +- disburse-application/
   ¦  +- page.jsx
   +- disburse-reporting/
   ¦  +- page.jsx
   +- download-app/
   ¦  +- page.jsx
   +- e-collection/
   ¦  +- page.jsx
   +- e-mandate-management/
   ¦  +- page.jsx
   ¦  +- manage-e-mandate/
   ¦     +- page.jsx
   +- help-ticket/
   ¦  +- page.jsx
   +- ledger/
   ¦  +- page.jsx
   +- legal/
   ¦  +- page.jsx
   +- loan-eligibility/
   ¦  +- [id]/
   ¦     +- page.jsx
   +- manage-admin/
   ¦  +- page.jsx
   +- manage-advocate/
   ¦  +- page.jsx
   +- manage-bank/
   ¦  +- page.jsx
   +- manage-expenses/
   ¦  +- page.jsx
   ¦  +- expenses-management/
   ¦     +- page.jsx
   +- notifications/
   ¦  +- page.jsx
   +- overdue-all-applicant/
   ¦  +- page.jsx
   +- overdue-applicant-list/
   ¦  +- page.jsx
   +- payment-receipt/
   ¦  +- page.jsx
   +- profit-loss/
   ¦  +- page.jsx
   +- rbi-guidelines/
   ¦  +- page.jsx
   ¦  +- manage-guideline/
   ¦     +- page.jsx
   +- references/
   ¦  +- page.jsx
   +- registered-from-app/
   ¦  +- page.jsx
   +- replace-kyc/
   ¦  +- [id]/
   ¦     +- page.jsx
   +- reviews/
   ¦  +- page.jsx
   +- send-sms/
   ¦  +- page.jsx
   +- statement-of-account/
   ¦  +- page.jsx
   +- tally-export/
   ¦  +- page.jsx
   +- tally-ledger/
   ¦  +- page.jsx
   +- upi-collection/
   ¦  +- page.jsx
   +- users-migration/
   ¦  +- page.jsx
   +- (manage-enquiry)/
      +- completed-application/
      ¦  +- page.jsx
      +- credit-approval/
      ¦  +- page.jsx
      +- followup-application/
      ¦  +- page.jsx
      +- inprogress-application/
      ¦  +- page.jsx
      +- manage-application/
      ¦  +- page.jsx
      +- pending-application/
      ¦  +- page.jsx
      +- rejected-application/
      ¦  +- page.jsx
      +- sanction-application/
         +- page.jsx
```

## src/components/Admin
```
src/components/Admin/
+- AdminLayout.jsx
+- AdminLogin.jsx
+- AdvanceSearchBar.jsx
+- AgentDateFilter.jsx
+- BankDateFilter.jsx
+- CRNLink.jsx
+- CustomerTransactionDetails.jsx
+- DateFilter.jsx
+- DateRangeFilter.jsx
+- ExportDateFilter.jsx
+- Footer.jsx
+- Header.jsx
+- Pagination.jsx
+- PermissionWrapper.jsx
+- ProtectedRoute.jsx
+- RichTextEditor.jsx
+- SearchBar.jsx
+- Sidebar.jsx
+- TallyTransactionDetails.jsx
+- test1.jsx
+- action-buttons/
¦  +- ActionButton.jsx
¦  +- AppraisalReportButton.jsx
¦  +- BlacklistButton.jsx
¦  +- EligibilityButton.jsx
¦  +- ReplaceKYCButton.jsx
+- advocate-management/
¦  +- AdvocateForm.jsx
¦  +- AdvocateRow.jsx
¦  +- AdvocateTable.jsx
¦  +- Manage-Advocate.jsx
+- all-enquiries/
¦  +- AllEnquiries.jsx
¦  +- EnquiriesRow.jsx
¦  +- EnquiriesTable.jsx
¦  +- LoanEligibility.jsx
¦  +- replace-kyc/
¦     +- DocumentGrid.jsx
¦     +- FileUploadField.jsx
¦     +- Header.jsx
¦     +- ReplaceKYC.jsx
+- application-form/
¦  +- AddressDetails.jsx
¦  +- ApplicationForm.jsx
¦  +- BankDetails.jsx
¦  +- LoanDetails.jsx
¦  +- OrganizationDetails.jsx
¦  +- PersonalDetails.jsx
¦  +- ReferenceDetails.jsx
+- application-migration/
¦  +- ApplicationPage.jsx
¦  +- ApplicationRow.jsx
¦  +- ApplicationTable.jsx
+- application-modals/
¦  +- AdjustmentModal.jsx
¦  +- ChargeICICIModal.jsx
¦  +- ChequeSubmit.jsx
¦  +- CourierPickedModal.jsx
¦  +- DisburseEmandateModal.jsx
¦  +- DisbursementModal.jsx
¦  +- DocumentVerificationStatusModal.jsx
¦  +- InProcessStatusModal.jsx
¦  +- NOCModal.jsx
¦  +- OriginalDocumentsModal.jsx
¦  +- OverdueAmountModal.jsx
¦  +- RefundPdcModal.jsx
¦  +- RemarkModal.jsx
¦  +- SendToCourierModal.jsx
¦  +- StatusModal.jsx
¦  +- StatusUpdateModal.jsx
+- appraisal-report/
¦  +- AlternativeNumber.jsx
¦  +- AppraisalReport.jsx
¦  +- BankVerification.jsx
¦  +- BasicInfo.jsx
¦  +- CibilVerification.jsx
¦  +- DocumentVerification.jsx
¦  +- FinalReportSection.jsx
¦  +- IncomeVerification.jsx
¦  +- OrganizationVerification.jsx
¦  +- PersonalVerification.jsx
¦  +- ReferenceModal.jsx
¦  +- ReferenceVerification.jsx
¦  +- ReportModal.jsx
¦  +- SalarySlipVerification.jsx
¦  +- SocialScroreVerification.jsx
+- bank-ledger/
¦  +- BankLedger.jsx
¦  +- BankLedgerFilter.jsx
¦  +- BankLedgerRow.jsx
¦  +- BankLedgerTable.jsx
+- bank-management/
¦  +- BankForm.jsx
¦  +- BankRow.jsx
¦  +- BankTable.jsx
¦  +- Manage-Bank.jsx
+- blog/
¦  +- BlogForm.jsx
¦  +- Blogs.jsx
¦  +- BlogSidebar.jsx
¦  +- BlogTable.jsx
¦  +- BlogTableRow.jsx
¦  +- Manage-blog.jsx
+- businessloan-above5l/
¦  +- BusinessLoanAbove5l.jsx
¦  +- BusinessLoanAbove5lRow.jsx
¦  +- BusinessLoanAbove5lTable.jsx
+- businessloan-upto5l/
¦  +- BusinessCallModal.jsx
¦  +- BusinessLoan5l.jsx
¦  +- BusinessLoan5lRow.jsx
¦  +- BusinessLoan5lTable.jsx
+- call/
¦  +- AccountDetailsModal.jsx
¦  +- CallButton.jsx
¦  +- CallDetailsModal.jsx
¦  +- Ref-MobileModal.jsx
+- cash-cheque-management/
¦  +- cash-management/
¦  ¦  +- CashDepositModal.jsx
¦  ¦  +- CashManagementpage.jsx
¦  ¦  +- CashRow.jsx
¦  ¦  +- CashTable.jsx
¦  +- cheque-management/
¦  ¦  +- ChequeDeposit.jsx
¦  ¦  +- ChequeDepositRow.jsx
¦  ¦  +- ChequeDepositTable.jsx
¦  ¦  +- ManageChequeDeposit.jsx
¦  +- e-mandate-management/
¦     +- E-MandateDeposit.jsx
¦     +- E-MandateRow.jsx
¦     +- E-MandateTable.jsx
¦     +- Manage-E-Mandate.jsx
+- cibil-report/
¦  +- CibilReport.jsx
¦  +- FileUpload.jsx
+- client-history/
¦  +- ClientHistoryPage.jsx
¦  +- ClientHistoryRow.jsx
¦  +- ClientHistoryTable.jsx
¦  +- ClientViewModal.jsx
¦  +- ClientViewProfile.jsx
¦  +- ClientViewTables.jsx
¦  +- LoanDetailsModal.jsx
+- collection-reporting/
¦  +- CollectionPage.jsx
¦  +- CollectionRow.jsx
¦  +- CollectionTable.jsx
+- complaints/
¦  +- AddComplaintPage.jsx
¦  +- ComplaintDetails.jsx
¦  +- ComplaintPage.jsx
¦  +- ComplaintRow.jsx
¦  +- ComplaintsFormFields.jsx
¦  +- ComplaintTable.jsx
¦  +- ExpandableText.jsx
¦  +- Files.jsx
¦  +- UploadModal.jsx
+- completed-appliaction/
¦  +- CompletedApplication.jsx
¦  +- CompletedRow.jsx
¦  +- CompletedTable.jsx
+- credit-approval/
¦  +- CreditApprovalPage.jsx
¦  +- CreditApprovalRow.jsx
¦  +- CreditApprovalTable.jsx
+- dashboard/
¦  +- ChartCard.jsx
¦  +- DashboardCard.jsx
¦  +- DashboardPage.jsx
+- disburse-application/
¦  +- DisburseApplication.jsx
¦  +- DisburseRow.jsx
¦  +- DisburseTable.jsx
+- disburse-reporting/
¦  +- DisbursementPage.jsx
¦  +- DisbursementRow.jsx
¦  +- DisbursementTable.jsx
¦  +- DisburseStatus.jsx
¦  +- TransationDetailsModal.jsx
¦  +- TransferModal.jsx
+- documents/
¦  +- AddressProofDocument.jsx
¦  +- AgreementDocument.jsx
¦  +- BankFraudReportDocument.jsx
¦  +- BankStatementDocument.jsx
¦  +- BankVerificationDocument.jsx
¦  +- CibilScoreDocument.jsx
¦  +- IdProofDocument.jsx
¦  +- NachFormDocument.jsx
¦  +- PanCardDocument.jsx
¦  +- PDCDocument.jsx
¦  +- PhotoDocument.jsx
¦  +- SalaryProofDocument.jsx
¦  +- SanctionLetterDocument.jsx
¦  +- SecondBankStatementDocument.jsx
¦  +- SocialScoreDocument.jsx
¦  +- VideoKYCDocument.jsx
+- download-app/
¦  +- DownloadApp.jsx
¦  +- DownloadAppRow.jsx
¦  +- DownloadAppTable.jsx
+- e-collection/
¦  +- ECollectionPage.jsx
¦  +- ECollectionRow.jsx
¦  +- ECollectionTable.jsx
+- expenses/
¦  +- ExpenseManagement.jsx
¦  +- ExpenseRow.jsx
¦  +- ExpensesTable.jsx
¦  +- ManageExpenses.jsx
+- followup-application/
¦  +- FollowupApplication.jsx
¦  +- FollowUpRow.jsx
¦  +- FollowUpTable.jsx
+- help-ticket/
¦  +- HelpTicketPage.jsx
¦  +- HelpTicketRow.jsx
¦  +- HelpTicketTable.jsx
¦  +- TicketDetailsModal.jsx
¦  +- TicketForm.jsx
+- inprogress-application/
¦  +- InprogressAppliaction.jsx
¦  +- InprogressRow.jsx
¦  +- InprogressTable.jsx
+- ledger/
¦  +- Ledger.jsx
¦  +- LedgerRow.jsx
¦  +- LedgerTable.jsx
¦  +- RenewalModal.jsx
+- legal/
¦  +- CreateArbitrationCriminalModal.jsx
¦  +- CreateArbitrationNoticeModal.jsx
¦  +- CreateNoticeModal.jsx
¦  +- CriminalCaseModal.jsx
¦  +- CriminalStatusModal.jsx
¦  +- LegalPage.jsx
¦  +- LegalRow.jsx
¦  +- LegalTable.jsx
¦  +- address/
¦     +- AddressCard.jsx
¦     +- AddressForm.jsx
¦     +- AddressModal.jsx
+- manage-admin/
¦  +- AdminForm.jsx
¦  +- AdminRow.jsx
¦  +- AdminTable.jsx
¦  +- Manage-Admin.jsx
¦  +- PermissionsModal.jsx
+- manage-application/
¦  +- ManageApplication.jsx
¦  +- ManageApplicationRow.jsx
¦  +- ManageApplicationTable.jsx
¦  +- collectionForms/
¦     +- CreateEmiForm.jsx
¦     +- demo.jsx
¦     +- NormalCollectionForm.jsx
¦     +- RenewalCollectionForm.jsx
+- msb/
¦  +- MsbPage.jsx
¦  +- MsbTableRaw.jsx
+- notification/
¦  +- FormFields.jsx
¦  +- ManageNotifications.jsx
¦  +- Notification.jsx
¦  +- NotificationForm.jsx
¦  +- NotificationRow.jsx
¦  +- NotificationTable.jsx
+- overdue-applicants/
¦  +- OverdueApplicant.jsx
¦  +- OverdueApplicantRow.jsx
¦  +- OverdueApplicantTable.jsx
+- overdue-applicants-list/
¦  +- OverdueApplicantList.jsx
¦  +- OverdueApplicantListRow.jsx
¦  +- OverdueApplicantListTable.jsx
+- payment-recepit/
¦  +- PaymentReceipt.jsx
¦  +- PaymentReceiptRow.jsx
¦  +- PaymentReceiptTable.jsx
¦  +- PaymentUpdateModal.jsx
+- pending-application/
¦  +- PendingApplication.jsx
¦  +- PendingRow.jsx
¦  +- PendingTable.jsx
+- profit-loss/
¦  +- ProfitLoassSummery.jsx
¦  +- ProfitLoss.jsx
¦  +- SearchFilter.jsx
+- rbi-guidelines/
¦  +- DocumentUploadModal.jsx
¦  +- GuidelineFormFields.jsx
¦  +- GuidelinesRow.jsx
¦  +- GuidelinesTable.jsx
¦  +- ManageGuidelines.jsx
¦  +- RbiGuidelinesManagement.jsx
¦  +- StatusUpdateModal.jsx
+- refer-friends/
¦  +- ReferFriends.jsx
¦  +- ReferFriendsTableRaw.jsx
+- registered-from-app/
¦  +- RegisteredAppTable.jsx
¦  +- RegisteredfromApp.jsx
¦  +- RegisteredRow.jsx
+- rejected-appliaction/
¦  +- RejectedAppliaction.jsx
¦  +- RejectedRow.jsx
¦  +- RejectedTable.jsx
+- review/
¦  +- ReviewRow.jsx
¦  +- Reviews.jsx
¦  +- ReviewStatusModal.jsx
¦  +- ReviewTable.jsx
+- sanction-application/
¦  +- SanctionPage.jsx
¦  +- SanctionRow.jsx
¦  +- SanctionTable.jsx
+- sms/
¦  +- MobileCard.jsx
¦  +- SmsCard.jsx
+- soa/
¦  +- SoaDetails.jsx
¦  +- SoaPage.jsx
¦  +- SoaRow.jsx
¦  +- SoaTable.jsx
+- tally-export/
¦  +- TallyExport.jsx
+- tally-ledger/
¦  +- LedgerPage.jsx
¦  +- LedgerRow.jsx
¦  +- LedgerTable.jsx
+- users-migration/
¦  +- UserMigrationPage.jsx
¦  +- UserMigrationRow.jsx
¦  +- UsersMigrationTable.jsx
```

## src/lib (CRM-related files)
```
src/lib/
+- AdminAuthContext.js
+- api.js
+- store/
¦  +- authAdminStore.js
+- services/
   +- AdminServices.js
   +- AdvocateServices.js
   +- AllEnquiriesServices.js
   +- ApplicationFormServices.js
   +- BankServices.js
   +- BlackListService.js
   +- BlogServices.js
   +- CallServices.js
   +- CashDepositServices.js
   +- ChequeService.js
   +- CibilExportServices.js
   +- ClientHistoryService.js
   +- CollectionReportingServices.js
   +- ComplaintService.js
   +- CompletedApplicationServices.js
   +- CreditApprovalServices.js
   +- DashboardServices.js
   +- DisburseApprovalServices.js
   +- E-mandateService.js
   +- EligibilityServices.js
   +- ExpenseService.js
   +- FollowUpApplicationServices.js
   +- InprocessApplicationServices.js
   +- LedgerServices.js
   +- LegalService.js
   +- ManageApplicationServices.js
   +- NotificationServices.js
   +- OverdueApplicantServices.js
   +- PaymentReceiptServices.js
   +- PendingApplicationServices.js
   +- RBIGuidelineService.js
   +- ReferenceServices.js
   +- RejectedApplicationServices.js
   +- ReviewServices.js
   +- SanctionApplicationServices.js
   +- SoaService.js
   +- TallyExportServices.js
   +- TallyLedgerServices.js
   +- TicketService.js
   +- disbursementService.js
   +- replaceKycSevice.js
   +- appraisal/
   ¦  +- AppraisalReportServices.js
   ¦  +- bankVerificationService.js
   ¦  +- cibilVerificationService.js
   ¦  +- documentVerificationService.js
   ¦  +- organizationVerificationService.js
   ¦  +- personalInfoService.js
   ¦  +- personalVerificationService.js
   ¦  +- salaryVerificationService.js
   ¦  +- socialScoreVerification.js
   +- colletionForms/
      +- CollectionService.js
```
