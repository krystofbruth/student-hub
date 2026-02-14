import z from "zod";

export const CreateSSPSCajthamlSourceCredentialsSchema = z.object({
  verificationToken: z.string(),
});

export type CreateSSPSCajthamlSourceCredentials = z.infer<
  typeof CreateSSPSCajthamlSourceCredentialsSchema
>;
