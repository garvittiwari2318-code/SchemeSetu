require("dotenv").config();

const connectDB = require("../config/db");
const Scheme = require("../models/scheme");
const Partner = require("../models/Partner");

const { schemes, partners } = require("./seedData");

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");

    await Scheme.deleteMany({});
    await Partner.deleteMany({});

    console.log("Inserting schemes...");
    await Scheme.insertMany(schemes);

    console.log("Inserting partners...");
    await Partner.insertMany(partners);

    console.log(
      `Seed complete: ${schemes.length} schemes, ${partners.length} partners`
    );

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
