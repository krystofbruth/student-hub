export const constructOpenAPIJSONResponse = (
  description: string,
  body: any
) => {
  return { description, content: { "application/json": { schema: body } } };
};
