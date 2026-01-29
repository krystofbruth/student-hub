export interface EducationAssignment {
  addedStudentAction: string;
  addToCalendarAction: string;
  allowLateSubmissions: boolean;
  allowStudentsToAddResourcesToSubmission: boolean;
  /** Timestamp */
  assignDateTime: string;
  /** Unusable in this context (needs to be verified). */
  assignTo: { "@odata.type": "microsoft.graph.educationAssignmentRecipient" };
  /** Timestamp */
  assignedDateTime: string;
  classId: string;
  /** Timestamp */
  closeDateTime: string;
  createdBy: {
    user: {
      displayName: string;
      id: string;
      tenantId: string;
    };
  };
  /** Timestamp */
  createdDateTime: string;
  displayName: string;
  /** Timestamp */
  dueDateTime: string;
  feedbackResourcesFolderUrl: string;
  id: string;
  instructions: {
    content: string;
    contentType: "text" | "html";
  };
  languageTag: string;
  lastModifiedBy: {
    user: {
      displayName: string;
      id: string;
      tenantId: string;
    };
  };
  /** Timestamp */
  lastModifiedDateTime: string;
  moduleUrl: string;
  notificationChannelUrl: string;
  resourcesFolderUrl: string;
  status: string;
  webUrl: string;
}
