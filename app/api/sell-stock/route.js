import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import User from '../../../models/User';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { clerkId, symbol, qty, price, orderType = 'MARKET' } = await request.json();

    
    if (!clerkId || !symbol || !qty || !price) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (qty <= 0 || price <= 0) {
      return NextResponse.json(
        { message: 'Quantity and price must be positive' },
        { status: 400 }
      );
    }

    await connectMongo();

    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    
    const existingHoldingIndex = user.holdings.findIndex(
      holding => holding.symbol === symbol.toUpperCase()
    );

    if (existingHoldingIndex === -1) {
      return NextResponse.json(
        { message: 'You do not own any shares of this stock' },
        { status: 400 }
      );
    }

    const existingHolding = user.holdings[existingHoldingIndex];

    
    if (existingHolding.qty < qty) {
      return NextResponse.json(
        { message: `Insufficient shares. You only have ${existingHolding.qty} shares available` },
        { status: 400 }
      );
    }

    
    const totalProceeds = qty * price;

    
    const orderId = uuidv4();

    
    const newTrade = {
      orderId,
      symbol: symbol.toUpperCase(),
      qty,
      price,
      side: 'SELL',
      orderType,
      status: 'FILLED',
      ts: new Date()
    };

    
    const remainingQty = existingHolding.qty - qty;

    if (remainingQty === 0) {
      
      user.holdings.splice(existingHoldingIndex, 1);
    } else {
      
      user.holdings[existingHoldingIndex].qty = remainingQty;
      user.holdings[existingHoldingIndex].lastUpdated = new Date();
      
    }

    
    user.trades.push(newTrade);

    
    user.virtualBalance += totalProceeds;
    user.updatedAt = new Date();

    // Save user
    await user.save();

    return NextResponse.json({
      message: 'Stock sold successfully',
      trade: newTrade,
      newBalance: user.virtualBalance,
      orderId,
      sharesRemaining: remainingQty
    });

  } catch (error) {
    console.error('Sell stock error:', error);
    console.error('Error details:', error.errors); 
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}