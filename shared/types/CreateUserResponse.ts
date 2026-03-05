// To be used... later
export enum UserRegistrationStatus {
  EMAIL_VERIFICATION_REQUIRED = "EMAIL_VERIFICATION_REQUIRED",
  USER_ACTIVE = "USER_ACTIVE",
}

export type CreateUserResponse = {
  success: true;
  status: 201;
  // registrationStatus: UserRegistrationStatus;
};
