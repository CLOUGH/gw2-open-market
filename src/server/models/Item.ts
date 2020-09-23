import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export interface IIPrice {
  quantity?: number;
  unit_price: number;
}
export interface IItemPrice {
  id?: string;
  whitelisted?: boolean;
  buys: IIPrice;
  sells: IIPrice;
}

export interface IItem extends mongoose.Document {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  level?: number;
  rarity?: string;
  vendor_value?: number;
  default_skin?: number;
  game_types?: [string];
  flags?: [string];
  restrictions: [any];
  id?: number;
  chat_link?: string;
  icon?: string;
  details?: [any];
  createdAt: Date;
  updatedAt: Date;
  price?: IItemPrice;
}

const ItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true
  },
  name: String,
  description: String,
  type: String,
  level: Number,
  rarity: String,
  vendor_value: Number,
  default_skin: Number,
  game_types: [String],
  flags: [String],
  upgrades_into: [mongoose.Schema.Types.Mixed],
  restrictions: [mongoose.Schema.Types.Mixed],
  upgrades_from: [mongoose.Schema.Types.Mixed],
  chat_link: String,
  icon: String,
  details: mongoose.Schema.Types.Mixed,
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemListing' },
  price: {
    whitelisted: Boolean,
    buys: {
      quantity: Number,
      unit_price: Number
    },
    sells: {
      quantity: Number,
      unit_price: Number,
    },
    createdAt: Date,
    updatedAt: Date,
  }
}, { timestamps: true });

mongoosePaginate(ItemSchema);
ItemSchema.index({ name: 'text', description: 'text' }, { name: 'textSearch', weights: { name: 10, description: 5 } });

export default mongoose.model<IItem>('Item', ItemSchema);
