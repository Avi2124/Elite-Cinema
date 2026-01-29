// scripts/clearBadMovies.js
import mongoose from "mongoose";
import "dotenv/config.js";        // make sure this points correctly to your env config
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

const run = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // 2. Show how many bad Movie docs we have
    const badMovies = await Movie.collection
      .find({ _id: { $type: "array" } })
      .toArray();

    console.log("Bad Movie docs with array _id:", badMovies.length);

    // 3. Delete the bad Movie docs
    if (badMovies.length > 0) {
      await Movie.collection.deleteMany({ _id: { $type: "array" } });
      console.log("Deleted bad Movie docs with array _id");
    }

    // 4. (Dev-friendly) Optionally drop all shows too, so no old references
    try {
      await Show.collection.drop();
      console.log("Dropped 'shows' collection (clean slate for shows)");
    } catch (err) {
      if (err.code === 26) {
        console.log("'shows' collection does not exist, nothing to drop");
      } else {
        throw err;
      }
    }

    console.log("Cleanup complete ✅");
  } catch (err) {
    console.error("Cleanup error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
