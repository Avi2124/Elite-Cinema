// scripts/clearMoviesAndShows.js
import mongoose from 'mongoose';
import 'dotenv/config.js';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop movies
    try {
      await Movie.collection.drop();
      console.log('Dropped movies collection');
    } catch (err) {
      if (err.code === 26) {
        console.log('movies collection does not exist yet');
      } else {
        throw err;
      }
    }

    // Drop shows
    try {
      await Show.collection.drop();
      console.log('Dropped shows collection');
    } catch (err) {
      if (err.code === 26) {
        console.log('shows collection does not exist yet');
      } else {
        throw err;
      }
    }

    console.log('Cleanup complete ✅');
  } catch (err) {
    console.error('Cleanup error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
