import mongoose from 'mongoose';

const HoldingSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true },
  qty: { type: Number, required: true },
  avgCost: { type: Number, required: true }, 
  exchange: { type: String, default: 'NSE', uppercase: true },
  sector: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

const TradeSchema = new mongoose.Schema({
  orderId: { type: String, index: true },
  symbol: { type: String, required: true, uppercase: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }, 
  side: { type: String, enum: ['BUY', 'SELL'], required: true },
  orderType: { type: String, enum: ['MARKET', 'LIMIT', 'STOP'], default: 'MARKET' },
  status: { type: String, enum: ['PENDING', 'FILLED', 'CANCELLED', 'REJECTED'], default: 'FILLED' },
  ts: { type: Date, default: Date.now },
});

const ReportSchema = new mongoose.Schema({
  generatedAt: { type: Date, default: Date.now },
  rawData: { type: Object }, 
  expandedData: { type: Object }, 
});

const UserSchema = new mongoose.Schema({
  clerkId: String,
  email: String,
  name: String,
  profileImage: String,
  virtualBalance: {
    type: Number,
    default: 100000,
  },
  holdings: [HoldingSchema],
  trades: [TradeSchema],
  reports: [ReportSchema],
  reportCount: { type: Number, default: 0 },
  watchlist: [{
    symbol: { type: String, uppercase: true },
    companyName: String,
    imageUrl: String,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);