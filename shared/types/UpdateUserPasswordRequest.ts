import z from "zod";

export const UpdateUserPasswordRequestSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1),
});

export type UpdateUserPasswordRequest = z.infer<
  typeof UpdateUserPasswordRequestSchema
>;
