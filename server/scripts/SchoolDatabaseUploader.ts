import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";

// Per https://lkod.msmt.gov.cz/schemas/rssz-json-schema.jschema
interface School {
  ico: string;
  uplnyNazev: string;
  adresa: {
    obec: string;
    psc: string;
  };
}

const SCHOOLS_PATH = "assets/RSSZ-cela-CR.jsonld";

await mongoose.connect(process.env.DB_URI || "mongodb://127.0.0.1:27017");

const { db } = mongoose.connection;
if (!db) throw new Error("Failed to retrieve the `db` object!");

const schoolsRaw = await fs.readFile(path.resolve(SCHOOLS_PATH), {
  encoding: "utf-8",
});
const schoolsObject = JSON.parse(schoolsRaw);

console.log(`${new Date().toISOString()} Finished parsing schools.`);

const schoolsList = schoolsObject.list as School[];

console.log(`${new Date().toISOString()} Purging previous schools.`);
await db.collection("schools").drop();

for (const school of schoolsList) {
  console.log(
    `${new Date().toISOString()} Uploading school ${school.uplnyNazev}.`,
  );
  await db.collection("schools").insertOne({
    name: school.uplnyNazev,
    country: "CZE",
    address: {
      city: school.adresa.obec,
      zip: school.adresa.psc.replace(/ /g, ""),
    },
  });
}

console.log(`${new Date().toISOString()} Upload finished.`);

mongoose.disconnect();
