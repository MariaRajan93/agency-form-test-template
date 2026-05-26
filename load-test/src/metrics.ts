import { Counter, Trend } from "k6/metrics";

// Generic counters
export const failedUploadToS3Counter = new Counter("failed_upload_to_S3");

// ----- DTP metrics -----
// API Trends
export const getAttachmentPolicyToUploadApiTrend = new Trend("dtp_api_time_to_get_attachment_policy_to_upload", true);
export const upload1MBApiTrend = new Trend("dtp_api_time_to_upload_1MB_attachment", true);
export const getPresignedUrlCounter = new Counter("dtp_api_get_presigned_url_count");

// ----- BIF metrics -----
// Counters
export const bifGetPresignedUrlSuccessCounter = new Counter("bif_get_presigned_url_success");
export const bifGetPresignedUrlFailureCounter = new Counter("bif_get_presigned_url_failure");
export const bifCreateTrackedRequestSuccessCounter = new Counter("bif_create_tracked_request_success");
export const bifUpdateTrackedRequestSuccessCounter = new Counter("bif_update_tracked_request_success");
export const bifCreateChildTrackedRequestSuccessCounter = new Counter("bif_create_child_tracked_request_success");
export const bifSubmissionsCounter = new Counter("bif_submissions");
export const bifSubmissionsProcessingStartCounter = new Counter("bif_submissions_processing_started");
export const bifSubmissionsProcessingEndCounter = new Counter("bif_submissions_processing_ended");
export const bifMessagesPerIterationCounter = new Counter("bif_messages_per_iteration");
// Trends
export const bifGetPresignedUrlDurationTrend = new Trend("bif_get_presigned_url_duration", true);
export const bifAgencyPDFGenerationDurationTrend = new Trend("bif_agency_pdf_generation_duration", true);
export const bifCustomerPDFGenerationDurationTrend = new Trend("bif_customer_pdf_generation_duration", true);
export const bifCreateTrackedRequestDurationTrend = new Trend("bif_create_tracked_request_duration");
export const bifUpdateTrackedRequestDurationTrend = new Trend("bif_update_tracked_request_duration");
export const bifCreateChildTrackedRequestDurationTrend = new Trend("bif_create_child_tracked_request_duration");
export const bifUpdateServiceRequestDurationTrend = new Trend("bif_service_request_update_duration");
export const bifSubmitServiceRequestDurationTrend = new Trend("bif_service_request_submission_duration");
