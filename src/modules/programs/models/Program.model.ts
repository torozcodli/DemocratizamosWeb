import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgram extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  content: string[];
  imageUrl: string;
  info: {
    date: string;
    time: string;
    location: string;
    instructor: string;
    duration: string;
    level: string;
    includes: string;
  };
  order: number;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const ProgramInfoSchema = new Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, required: true },
    includes: { type: String, required: true },
  },
  { _id: false }
);

const ProgramSchema = new Schema<IProgram>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    content: { type: [String], required: true },
    imageUrl: { type: String, required: true },
    info: { type: ProgramInfoSchema, required: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProgramSchema.index({ slug: 1 });
ProgramSchema.index({ status: 1, order: 1 });

const Program: Model<IProgram> =
  mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;
