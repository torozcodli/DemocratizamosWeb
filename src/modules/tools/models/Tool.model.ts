import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Localized } from '@/lib/i18n/content';

export interface ITool extends Document {
  title: string | Localized<string>;
  slug: string;
  description: string | Localized<string>;
  content: string | Localized<string>;
  imageUrl: string;
  date: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Campos i18n usan Mixed por compatibilidad con docs legacy. Ver docs/I18N_SCHEMA_MIGRATION.md.
const ToolSchema = new Schema<ITool>(
  {
    title: { type: Schema.Types.Mixed, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: Schema.Types.Mixed, required: true },
    content: { type: Schema.Types.Mixed, required: true },
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
