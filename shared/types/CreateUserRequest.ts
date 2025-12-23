import z from "zod";

export const CreateUserRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
  displayName: z.string(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
