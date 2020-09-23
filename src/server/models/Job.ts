import * as mongoose from 'mongoose';

export interface IJob extends mongoose.Document {
  name?: string;
  running?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  processId: string;
}

const JobSchema = new mongoose.Schema({
  name: String,
  running: Boolean,
  processId: String
}, { timestamps: true });



export default mongoose.model<IJob>('Job', JobSchema);
