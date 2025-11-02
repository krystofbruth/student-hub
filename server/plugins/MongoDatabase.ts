import mongoose from "mongoose";

export default defineNitroPlugin(async (nitroApp) => {
  const dbUri = useRuntimeConfig().dbUri;

  console.info("Connecting to the specified MongoDB database deployment");
  await mongoose.connect(dbUri);
  console.info("Successfully connected to MongoDB database deployment");
});
