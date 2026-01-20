import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITool extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  date: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ToolSchema = new Schema<ITool>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
ToolSchema.index({ isPublished: 1, date: -1 });

// Ensure model is only compiled once
let Tool: Model<ITool>;

if (mongoose.models.Tool) {
  Tool = mongoose.models.Tool as Model<ITool>;
} else {
  Tool = mongoose.model<ITool>('Tool', ToolSchema);
}

export default Tool;
