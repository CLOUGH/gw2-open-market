import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import * as mongooseAggregatePaginate  from 'mongoose-aggregate-paginate';

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
  listed: true;
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
  listed: {
    type: Boolean,
    index: true
  },
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  level: {
    type: Number,
    required: false,
  },
  rarity: {
    type: String,
    required: false,
  },
  vendor_value: {
    type: Number,
    required: false,
  },
  default_skin: {
    type: Number,
    required: false,
  },
  game_types: {
    type: [String],
    required: false,
  },
  flags: {
    type: [String],
    required: false,
  },
  upgrades_into: {
    type: [mongoose.Schema.Types.Mixed],
    required: false,
  },
  restrictions: {
    type: [mongoose.Schema.Types.Mixed],
    required: false,
  },
  upgrades_from: {
    type: [mongoose.Schema.Types.Mixed],
    required: false,
  },
  chat_link: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  price: {
    type: {
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
    },
    required: false
  }
}, { timestamps: true });

mongooseAggregatePaginate(ItemSchema);
mongoosePaginate(ItemSchema);
ItemSchema.index({ name: 'text', description: 'text' }, { name: 'textSearch', weights: { name: 10, description: 5 } });

export default mongoose.model<IItem>('Item', ItemSchema);
