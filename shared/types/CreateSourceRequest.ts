import z from "zod";

export const CreateSourceRequestSchema = z.object({
  originId: z.string(),
  credentials: z.any(),
});

export type CreateSourceRequest = z.infer<typeof CreateSourceRequestSchema>;
