import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Localized } from '@/lib/i18n/content';

export interface IPost extends Document {
  title: string | Localized<string>;
  slug: string;
  imageUrl: string;
  readTime: string;
  authorName: string;
  content: string[] | Localized<string[]>;
  excerpt: string | Localized<string>;
  likes: number;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

// Campos i18n usan Mixed por compatibilidad con docs legacy. Ver docs/I18N_SCHEMA_MIGRATION.md.
const PostSchema = new Schema<IPost>(
  {
    title: { type: Schema.Types.Mixed, required: true },
    slug: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    readTime: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    excerpt: { type: Schema.Types.Mixed, required: true },
    likes: { type: Number, default: 0 },
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
PostSchema.index({ status: 1, createdAt: -1 });
PostSchema.index({ status: 1, likes: -1 });

// Ensure model is only compiled once
let Post: Model<IPost>;

if (mongoose.models.Post) {
  Post = mongoose.models.Post as Model<IPost>;
} else {
  Post = mongoose.model<IPost>('Post', PostSchema);
}

export default Post;
