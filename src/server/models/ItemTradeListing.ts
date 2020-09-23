import * as mongoose from 'mongoose';

export interface ITrade {
  timestamp: Date;
  unit_price: number;
  quantity: number;
  listings: number;
}

export interface IItemTradeListing extends mongoose.Document {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
  buys?: ITrade[];
  sells?: ITrade[];
}

const ItemTradeListingSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true
  },
  buys: [{
    timestamp: Date,
    unit_price: Number,
    quantity: Number,
    listings: Number,
  }],
  sells: [{
    timestamp: Date,
    unit_price: Number,
    quantity: Number,
    listings: Number,
  }]
}, { timestamps: true });



export default mongoose.model<IItemTradeListing>('ItemTradeListing', ItemTradeListingSchema);
