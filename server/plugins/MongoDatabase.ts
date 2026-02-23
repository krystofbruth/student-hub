import mongoose from "mongoose";
import { Provider } from "../models/Provider";

export default defineNitroPlugin(async (nitroApp) => {
  const dbUri = process.env.SHUB_DB_URI || useRuntimeConfig().dbUri;

  console.info("Connecting to the specified MongoDB database deployment");
  await mongoose.connect(dbUri);
  console.info("Successfully connected to MongoDB database deployment");

  Provider.find().limit(0);
});
