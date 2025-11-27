/**
 * Script to add sectors to existing holdings
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sectorMap = {
  'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking', 'KOTAKBANK': 'Banking',
  'AXISBANK': 'Banking', 'INDUSINDBK': 'Banking', 'BANKBARODA': 'Banking', 'PNB': 'Banking',
  'BAJFINANCE': 'Finance', 'BAJAJFINSV': 'Finance', 'HDFC': 'Finance', 'SBILIFE': 'Finance',
  'TCS': 'IT', 'INFY': 'IT', 'WIPRO': 'IT', 'HCLTECH': 'IT', 'TECHM': 'IT', 
  'LTIM': 'IT', 'LTI': 'IT', 'MPHASIS': 'IT', 'COFORGE': 'IT', 'ZOMATO': 'IT',
  'SUNPHARMA': 'Pharma', 'DRREDDY': 'Pharma', 'CIPLA': 'Pharma', 'DIVISLAB': 'Pharma',
  'BIOCON': 'Pharma', 'LUPIN': 'Pharma', 'APOLLOHOSP': 'Healthcare',
  'TATAMOTORS': 'Auto', 'MARUTI': 'Auto', 'M&M': 'Auto', 'BAJAJ-AUTO': 'Auto', 
  'HEROMOTOCO': 'Auto', 'EICHERMOT': 'Auto', 'TATAMOTOR': 'Auto',
  'RELIANCE': 'Energy', 'ONGC': 'Energy', 'BPCL': 'Energy', 'IOC': 'Energy', 
  'NTPC': 'Energy', 'POWERGRID': 'Energy', 'GAIL': 'Energy', 'TATAPOWER': 'Energy',
  'ADANIENT': 'Energy', 'ADANIPORTS': 'Logistics', 'ADANIGREEN': 'Energy',
  'HINDUNILVR': 'FMCG', 'ITC': 'FMCG', 'NESTLEIND': 'FMCG', 'BRITANNIA': 'FMCG',
  'DABUR': 'FMCG', 'MARICO': 'FMCG', 'TITAN': 'Retail', 'DMART': 'Retail',
  'TATASTEEL': 'Metals', 'JSWSTEEL': 'Metals', 'HINDALCO': 'Metals', 'COALINDIA': 'Metals',
  'BHARTIARTL': 'Telecom', 'IDEA': 'Telecom',
  'DLF': 'Realty', 'ULTRACEMCO': 'Cement', 'LT': 'Infra',
  'ASIANPAINT': 'Paints', 'INDIGO': 'Aviation', 'IRCTC': 'Travel',
};

function getSector(symbol) {
  const s = symbol?.toUpperCase()?.trim();
  if (!s) return 'Other';
  if (sectorMap[s]) return sectorMap[s];
  if (s.includes('BANK')) return 'Banking';
  if (s.includes('PHARMA')) return 'Pharma';
  if (s.includes('POWER')) return 'Energy';
  if (s.includes('STEEL')) return 'Metals';
  if (s.includes('FIN')) return 'Finance';
  if (s.includes('TECH')) return 'IT';
  return 'Other';
}

async function fix() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      let updated = false;
      
      if (user.holdings && user.holdings.length > 0) {
        for (let i = 0; i < user.holdings.length; i++) {
          const holding = user.holdings[i];
          if (!holding.sector || holding.sector === 'Unknown') {
            user.holdings[i].sector = getSector(holding.symbol);
            updated = true;
            console.log(`  ${holding.symbol} -> ${user.holdings[i].sector}`);
          }
        }
      }

      if (updated) {
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { holdings: user.holdings } }
        );
        console.log(`Updated user ${user.clerkId}`);
      }
    }

    console.log('Done!');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

fix();
