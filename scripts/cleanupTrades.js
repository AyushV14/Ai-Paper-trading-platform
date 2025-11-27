/**
 * Script to clean up corrupted trade records in MongoDB
 * Run with: node scripts/cleanupTrades.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users
    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      if (user.trades && user.trades.length > 0) {
        // Filter out corrupted trades (missing required fields)
        const validTrades = user.trades.filter(trade => {
          return trade.symbol && trade.qty && trade.price && trade.side;
        });

        const removedCount = user.trades.length - validTrades.length;
        
        if (removedCount > 0) {
          console.log(`User ${user.clerkId}: Removing ${removedCount} corrupted trades`);
          
          await usersCollection.updateOne(
            { _id: user._id },
            { $set: { trades: validTrades } }
          );
        }
      }
    }

    console.log('Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();

