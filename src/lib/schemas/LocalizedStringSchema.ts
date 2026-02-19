import { Schema } from 'mongoose';

export const LocalizedStringSchema = new Schema(
  {
    es: { type: String, required: true },
    en: { type: String },
  },
  { _id: false }
);

export const LocalizedArraySchema = new Schema(
  {
    es: { type: [String], required: true },
    en: { type: [String] },
  },
  { _id: false }
);
