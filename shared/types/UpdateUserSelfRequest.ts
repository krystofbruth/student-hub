import z from "zod";
import { SupportedLanguages } from "./SupportedLanguages";

export const UpdateUserSelfRequestSchema = z.object({
  displayName: z.string().trim().min(3).optional(),
  language: z.enum(SupportedLanguages).optional(),
});

export type UpdateUserSelfRequest = z.infer<typeof UpdateUserSelfRequestSchema>;
