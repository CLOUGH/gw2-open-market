import * as mongoose from 'mongoose';

export interface IIngredient {
  item_id: number;
  count: number;
}

export interface IRecipe extends mongoose.Document {
  _id: string;
  id: number;
  chat_link: string;
  type: string;
  output_item_id: number;
  output_item_count: number;
  achievement_id: number;
  output_item_count_range: string;
  min_rating: number;
  time_to_craft_ms: string;
  disciplines: string[];
  flags: string[];
  ingredients: IIngredient;
}

const ItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    index: true,
    unique: true
  },
  output_item_id: {
    type: Number,
    index: true,
  },
  output_item_count: Number,
  output_item_count_range: String,
  min_rating: Number,
  time_to_craft_ms: Number,
  chat_link: String,
  disciplines: [String],
  flags: [String],
  achievement_id: Number,
  ingredients: [{
    item_id: {
      index: true,
      type: Number
    },
    count: Number
  }],
}, { timestamps: true });

export default mongoose.model<IRecipe>('Recipe', ItemSchema);
