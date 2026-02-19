import { pickLocale, normalizeLocale } from './content';
import type { IProgram } from '@/modules/programs/models/Program.model';
import type { IPost } from '@/modules/posts/models/Post.model';
import type { ITool } from '@/modules/tools/models/Tool.model';

export function resolveProgram(
  doc: IProgram | null,
  locale: string
): Omit<IProgram, 'title' | 'shortDescription' | 'content'> & {
  title: string;
  shortDescription: string;
  content: string[];
} | null {
  if (!doc) return null;
  const title = pickLocale((doc as any).title, locale);
  const shortDescription = pickLocale((doc as any).shortDescription, locale);
  const content = pickLocale((doc as any).content, locale);
  if (title == null || shortDescription == null || content == null) return null;
  const contentArr = Array.isArray(content)
    ? content.map((c) => (typeof c === 'string' ? c : String(c)))
    : [String(content)];
  const obj = doc && typeof (doc as any).toObject === 'function' ? (doc as any).toObject() : doc;
  return { ...obj, title: String(title), shortDescription: String(shortDescription), content: contentArr } as any;
}

export function resolvePost(
  doc: IPost | null,
  locale: string
): Omit<IPost, 'title' | 'excerpt' | 'content'> & {
  title: string;
  excerpt: string;
  content: string[];
} | null {
  if (!doc) return null;
  const title = pickLocale((doc as any).title, locale);
  const excerpt = pickLocale((doc as any).excerpt, locale);
  const content = pickLocale((doc as any).content, locale);
  if (title == null || excerpt == null || content == null) return null;
  const contentArr = Array.isArray(content) ? content : [String(content)];
  const obj = doc && typeof (doc as any).toObject === 'function' ? (doc as any).toObject() : doc;
  return { ...obj, title: String(title), excerpt: String(excerpt), content: contentArr } as any;
}

export function resolveTool(
  doc: ITool | null,
  locale: string
): Omit<ITool, 'title' | 'description' | 'content'> & {
  title: string;
  description: string;
  content: string;
} | null {
  if (!doc) return null;
  const title = pickLocale((doc as any).title, locale);
  const description = pickLocale((doc as any).description, locale);
  const content = pickLocale((doc as any).content, locale);
  if (title == null || description == null || content == null) return null;
  const obj = doc && typeof (doc as any).toObject === 'function' ? (doc as any).toObject() : doc;
  return { ...obj, title: String(title), description: String(description), content: String(content) } as any;
}
