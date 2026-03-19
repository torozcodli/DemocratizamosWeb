import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Localized } from '@/lib/i18n/content';

export interface IProgram extends Document {
  title: string | Localized<string>;
  slug: string;
  shortDescription: string | Localized<string>;
  content: string[] | Localized<string[]>;
  imageUrl: string;
  externalWebsiteUrl?: string;
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

// Campos i18n usan Mixed por compatibilidad con docs legacy. Ver docs/I18N_SCHEMA_MIGRATION.md.
const ProgramSchema = new Schema<IProgram>(
  {
    title: { type: Schema.Types.Mixed, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: Schema.Types.Mixed, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    imageUrl: { type: String, required: true },
    externalWebsiteUrl: { type: String, required: false },
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
// Note: slug already has unique: true which creates an index automatically
// Only add compound index for status and order
ProgramSchema.index({ status: 1, order: 1 });

// Ensure model is only compiled once
let Program: Model<IProgram>;

if (mongoose.models.Program) {
  Program = mongoose.models.Program as Model<IProgram>;
} else {
  Program = mongoose.model<IProgram>('Program', ProgramSchema);
}

export default Program;
