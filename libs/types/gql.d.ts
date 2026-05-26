type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Email: { input: any; output: any; }
  ISODate: { input: string; output: string; }
  JSON: { input: any; output: any; }
  PaginationLimit: { input: any; output: any; }
  PhoneNumber: { input: any; output: any; }
};

type ActivityLog = {
  description: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
};

type ChildTrackedRequest = {
  referenceNum: Scalars['String']['output'];
  serviceInteractionName: Scalars['String']['output'];
  submittedDate: Scalars['ISODate']['output'];
};

export type MyQldActivityLogsResponse = {
  paginationKey?: Maybe<Scalars['String']['output']>;
  results: Array<ActivityLog>;
};

/** Argument of the MyQLDAddStatusChangeEvent mutation. */
export type MyQldAddStatusChangeEventInput = {
  /**
   * The date the transaction status changed, to be shown to the customer
   * (different to the time the actual update was received by myQLD systems).
   */
  changedDate?: InputMaybe<Scalars['ISODate']['input']>;
  /**
   * Any customer visible comments regarding the status update. Should be provided
   * when informationRequired is true. Can be provided at any time although the
   * information may not yet be displayed to the customer.
   */
  comment?: InputMaybe<Scalars['String']['input']>;
  /** The customer visible date the transaction is expected to be completed. */
  expectedCompletionDate?: InputMaybe<Scalars['ISODate']['input']>;
  /**
   * Creates the tracked request with an existing information required alert. Once
   * set, the information required flag needs to be explicitly set to false. It
   * isn’t reset automatically as the agency could be awaiting info, but still
   * progressing other parts.
   */
  informationRequired?: InputMaybe<Scalars['Boolean']['input']>;
  /** Indicates the outcome for the request (“APPROVED”, “DECLINED”, "UNSET" or not set). */
  outcome?: InputMaybe<MyQldTrackedRequestOutcome>;
  /**
   * The stage of the transaction once it is submitted. Reflects customer visible
   * stages in the agency backend processing workflow system e.g. “approved”,
   * “awaiting receipt of further details“, “awaiting credential to be posted“.
   */
  stage?: InputMaybe<Scalars['String']['input']>;
  /**
   * The status of the transaction.
   * The value must be an enabled status in the service tracking configuration.
   */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Deprecated - DTP use only. */
  statusDate?: InputMaybe<Scalars['ISODate']['input']>;
  /**
   * Whether the status change should have notifications suppressed.
   * Defaults to false.
   */
  suppressNotification?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Argument of the MyQLDCreateTrackedRequest mutation. */
export type MyQldCreateTrackedRequestInput = {
  /** The contact details to use for notifications for the tracked request. */
  contactDetails?: InputMaybe<MyQldCreateTrackedRequestContactDetailsInput>;
  /**
   * The date the tracked request is expected to be completed processing with the
   * agency. Will override the internal calculation if supplied.
   */
  expectedCompletionDate?: InputMaybe<Scalars['ISODate']['input']>;
  /** The key for the instance label. */
  instanceLabelKey?: InputMaybe<Scalars['String']['input']>;
  /** The value for the instance label. */
  instanceLabelValue?: InputMaybe<Scalars['String']['input']>;
  /** Internal request identifier used by the origin system. */
  internalRequestIdentifier?: InputMaybe<Scalars['String']['input']>;
  /**
   * The tracking reference number for the parent tracked request, e.g.
   * MQ-XXXXX-XXXXX. The parentReferenceNum must be for an existing tracked
   * request, and that tracked request must not be a child of another tracked
   * request (we only support at most two levels of hierarchy).
   */
  parentReferenceNum?: InputMaybe<Scalars['String']['input']>;
  /**
   * The unique tracking reference number supplied by the origin system, e.g.
   * MQ-XXXXX-XXXXX for DTP service requests or agency supplied reference.
   */
  referenceNum: Scalars['String']['input'];
  /** Transaction title. */
  serviceInteractionName?: InputMaybe<Scalars['String']['input']>;
  /**
   * The sub status of the transaction. Reflects customer visible steps in the
   * agency backend processing workflow system e.g. an application with status
   * “PROCESSING” may have a stage of “being assessed”, “awaiting receipt of
   * further details“, “awaiting credential to be posted“, “funds paid via EFT“
   * for example. The stage is free text but should comply with guidelines and be
   * consistent with language.
   */
  stage?: InputMaybe<Scalars['String']['input']>;
  /**
   * The high level status of the transaction (e.g. SUBMITTED, PROCESSING, etc).
   * The value must be an enabled status in the service tracking configuration.
   */
  status: Scalars['String']['input'];
  /**
   * The type of the tracked request to enable differentiation of different
   * tracked requests within the same service interaction.
   */
  subType?: InputMaybe<Scalars['String']['input']>;
  /** The customer visible date the request was submitted. */
  submittedDate?: InputMaybe<Scalars['ISODate']['input']>;
  /** The summary detail to be displayed. */
  summary?: InputMaybe<Scalars['JSON']['input']>;
  /** Deprecated - DTP use only. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Deprecated - DTP use only. */
  trackingUpdated?: InputMaybe<Scalars['Float']['input']>;
};

export type MyQldGetTrackedRequestsResponse = {
  alerts?: Maybe<Array<TrackedRequestAlert>>;
  paginationKey?: Maybe<Scalars['String']['output']>;
  parentHiddenAlerts?: Maybe<Array<ParentTrackedRequestHiddenAlert>>;
  requests?: Maybe<Array<TrackedRequestResponse>>;
};

export type MyQldServiceRequestCreateDraftInput = {
  metadata: MyQldServiceRequestMetadata;
};

export type MyQldServiceRequestCreateDraftResponse = {
  created: Scalars['ISODate']['output'];
  metadata: MyQldTransactionServiceRequestMetadata;
  requestId: Scalars['String']['output'];
  status: MyQldServiceRequestStatus;
  submissionData: Scalars['JSON']['output'];
  transactionId: Scalars['String']['output'];
  updated: Scalars['ISODate']['output'];
};

type MyQldServiceRequestEvidence = {
  map: Array<MyQldServiceRequestEvidenceMapItem>;
  source: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

type MyQldServiceRequestEvidenceMapItem = {
  attribute: Scalars['String']['input'];
  prefilledFields: Array<Scalars['String']['input']>;
};

export type MyQldServiceRequestMetadata = {
  application?: InputMaybe<Scalars['String']['input']>;
  currentPage?: InputMaybe<Scalars['Int']['input']>;
  dtpVersionNumber?: InputMaybe<Scalars['String']['input']>;
  dtpVersionSignature?: InputMaybe<Scalars['String']['input']>;
  formId: Scalars['String']['input'];
  formTitle: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  revisionNo: Scalars['Int']['input'];
};

type MyQldServiceRequestResponse = {
  created: Scalars['ISODate']['output'];
  expirationTime: Scalars['ISODate']['output'];
  formTitle?: Maybe<Scalars['String']['output']>;
  requestId: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  transactionId: Scalars['String']['output'];
  updated: Scalars['ISODate']['output'];
};

export type MyQldServiceRequestResponseResults = {
  results: Array<MyQldServiceRequestResponse>;
};

type MyQldServiceRequestSelectedProfileUpdate = {
  attribute: Scalars['String']['input'];
  consent: Scalars['Boolean']['input'];
  field: Scalars['String']['input'];
};

type MyQldServiceRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED';

export type MyQldServiceRequestUpdateInput = {
  evidence: Array<MyQldServiceRequestEvidence>;
  metadata: MyQldServiceRequestMetadata;
  selectedProfileUpdates: Array<MyQldServiceRequestSelectedProfileUpdate>;
  status: MyQldServiceRequestStatus;
  submissionData: Scalars['JSON']['input'];
};

type MyQldServiceResponseEvidence = {
  map: Array<MyQldServiceResponseEvidenceMapItem>;
  source: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

type MyQldServiceResponseEvidenceMapItem = {
  attribute: Scalars['String']['output'];
  prefilledFields: Array<Scalars['String']['output']>;
};

export type MyQldTrackedRequestOutcome =
  | 'APPROVED'
  | 'DECLINED'
  | 'UNSET';

type MyQldTrackedRequestStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'OUTCOME'
  | 'PROCESSING'
  | 'SUBMITTED';

type MyQldTransactionServiceRequestMetadata = {
  application?: Maybe<Scalars['String']['output']>;
  currentPage?: Maybe<Scalars['Int']['output']>;
  dtpVersionNumber?: Maybe<Scalars['String']['output']>;
  dtpVersionSignature?: Maybe<Scalars['String']['output']>;
  formId: Scalars['String']['output'];
  formTitle?: Maybe<Scalars['String']['output']>;
  projectId: Scalars['String']['output'];
  revisionNo: Scalars['Int']['output'];
  source?: Maybe<Scalars['String']['output']>;
};

export type MyQldTransactionServiceRequestResponse = {
  created: Scalars['ISODate']['output'];
  evidence?: Maybe<Array<MyQldServiceResponseEvidence>>;
  expirationTime: Scalars['ISODate']['output'];
  metadata: MyQldTransactionServiceRequestMetadata;
  referenceNum?: Maybe<Scalars['String']['output']>;
  requestId: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  submissionData: Scalars['JSON']['output'];
  transactionId: Scalars['String']['output'];
  updated: Scalars['ISODate']['output'];
};

type ParentTrackedRequestHiddenAlert = {
  children: Array<ChildTrackedRequest>;
  referenceNum: Scalars['String']['output'];
  serviceInteractionName: Scalars['String']['output'];
};

type TrackedRequestAlert = {
  awaitingActionSinceDate?: Maybe<Scalars['ISODate']['output']>;
  referenceNum: Scalars['String']['output'];
  serviceId?: Maybe<Scalars['String']['output']>;
  serviceInteractionId?: Maybe<Scalars['String']['output']>;
  serviceInteractionName?: Maybe<Scalars['String']['output']>;
};

type TrackedRequestResponse = {
  awaitingActionSinceDate?: Maybe<Scalars['ISODate']['output']>;
  childType?: Maybe<Scalars['String']['output']>;
  currentStatus?: Maybe<MyQldTrackedRequestStatus>;
  delayedSinceDate?: Maybe<Scalars['ISODate']['output']>;
  expectedCompletionDate?: Maybe<Scalars['ISODate']['output']>;
  instanceLabelKey?: Maybe<Scalars['String']['output']>;
  instanceLabelValue?: Maybe<Scalars['String']['output']>;
  origin?: Maybe<Scalars['String']['output']>;
  outcome?: Maybe<Scalars['String']['output']>;
  parentReferenceNum?: Maybe<Scalars['String']['output']>;
  parentServiceInteractionName?: Maybe<Scalars['String']['output']>;
  referenceNum: Scalars['String']['output'];
  serviceId?: Maybe<Scalars['String']['output']>;
  serviceInteractionId?: Maybe<Scalars['String']['output']>;
  serviceInteractionName?: Maybe<Scalars['String']['output']>;
  status?: Maybe<MyQldTrackedRequestStatus>;
  statusDate?: Maybe<Scalars['String']['output']>;
  submittedDate?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};
