import z from "zod";

export const CreateSSPSCajthamlSourceSchema = z.object({
  verificationToken: z.string(),
});

export type CreateSSPSCajthamlSource = z.infer<
  typeof CreateSSPSCajthamlSourceSchema
>;
