// migrations/updateUsers.js
import dotenv from "dotenv";
dotenv.config(); // Must be first!

import mongoose from "mongoose";
import User from "../models/User.js";
import dbConnect from "../lib/mongodb.js";

async function migrateUsers() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    const users = await User.find({});
    for (const user of users) {
      let updated = false;

      if (user.virtualBalance === undefined) {
        user.virtualBalance = 100000;
        updated = true;
      }

      if (user.reportCount === undefined) {
        user.reportCount = 0;
        updated = true;
      }

      if (!user.updatedAt) {
        user.updatedAt = new Date();
        updated = true;
      }

      if (!Array.isArray(user.holdings)) {
        user.holdings = [];
        updated = true;
      } else {
        user.holdings = user.holdings.map(h => ({
          lastUpdated: h.lastUpdated || new Date(),
          exchange: h.exchange ? h.exchange.toUpperCase() : "NSE",
          symbol: h.symbol ? h.symbol.toUpperCase() : "",
          qty: h.qty || 0,
          avgCost: h.avgCost || 0,
          sector: h.sector || "",
        }));
        updated = true;
      }

      if (!Array.isArray(user.trades)) {
        user.trades = [];
        updated = true;
      } else {
        user.trades = user.trades.map(t => ({
          orderId: t.orderId || "",
          symbol: t.symbol ? t.symbol.toUpperCase() : "",
          qty: t.qty || 0,
          price: t.price || 0,
          side: t.side || "BUY",
          orderType: t.orderType || "MARKET",
          status: t.status || "FILLED",
          ts: t.ts || new Date(),
        }));
        updated = true;
      }

      if (!Array.isArray(user.reports)) {
        user.reports = [];
        updated = true;
      } else {
        user.reports = user.reports.map(r => ({
          generatedAt: r.generatedAt || new Date(),
          data: r.data || {},
        }));
        updated = true;
      }

      if (updated) {
        await user.save();
        console.log(`Updated user: ${user._id}`);
      }
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateUsers();
