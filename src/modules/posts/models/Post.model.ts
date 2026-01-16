import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  imageUrl: string;
  readTime: string;
  authorName: string;
  content: string[];
  excerpt: string;
  likes: number;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    readTime: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: [String], required: true },
    excerpt: { type: String, required: true },
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
