export interface VerifySuccessDTO {
  user: {
    // ID of the user, ObjectId format
    id: string;
    /* Full name of the user
     * Probably in `LastName <MiddleName>* FirstName` format
     */
    name: string;
  };
  // List of subject slugs the user is enrolled in
  subjects: string[];
  // List of group names the user is enrolled in
  groups: string[];
}
