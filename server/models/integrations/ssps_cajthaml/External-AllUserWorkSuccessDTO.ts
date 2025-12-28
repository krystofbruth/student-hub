export interface AllUserWorkSuccessDTO {
  works: {
    // ID of the work, ObectId format
    id: string;
    // Full name of the work
    name: string;
    // Slug of the work, used in URLs with URL-friendly format
    slug: string;
    // ID of the subject, ObjectId format
    subject: string;
    // Slug of the subject, used in URLs with URL-friendly format
    subjectSlug: string;
    // ISO string of the end date and time of the work
    end: string;
    // Whether the work submission will be (or is) allowed
    submittable: boolean;
    // Whether the user has already submitted this work
    submission: boolean;
  }[];
}
