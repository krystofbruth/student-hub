import z from "zod";

export const CreateUserRequestSchema = z.object({
  email: z.email(),
  password: z.string(),
  displayName: z.string().min(3),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
