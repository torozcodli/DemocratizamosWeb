import { Session } from 'next-auth';
import connectDB from '@/lib/mongoose';
import Post, { IPost } from '../models/Post.model';
import { createPostSchema, CreatePostInput, generateExcerpt } from '../validation/post.validation';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';
import { isAdminEmail } from '@/lib/admin';

export type PostSortOption = 'recent' | 'recommended';

export class PostController {
  /**
   * Lista posts publicados ordenados
   */
  static async listPublishedPosts(sort: PostSortOption = 'recent'): Promise<IPost[]> {
    try {
      await connectDB();
      
      let query = Post.find({ status: 'published' });
      
      if (sort === 'recent') {
        query = query.sort({ createdAt: -1 });
      } else if (sort === 'recommended') {
        query = query.sort({ likes: -1, createdAt: -1 });
      }
      
      return query.lean().exec();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[PostController] Error in listPublishedPosts:', {
        message: errorMessage,
        stack: errorStack,
        error
      });
      throw error;
    }
  }

  /**
   * Lista todos los posts (admin)
   */
  static async listAllPosts(): Promise<IPost[]> {
    await connectDB();
    return Post.find().sort({ createdAt: -1 }).lean().exec();
  }

  /**
   * Obtiene un post por slug
   */
  static async getPostBySlug(slug: string): Promise<IPost | null> {
    await connectDB();
    return Post.findOne({ slug, status: 'published' }).lean().exec();
  }

  /**
   * Obtiene el post más reciente (para hero)
   */
  static async getLatestPost(): Promise<IPost | null> {
    await connectDB();
    return Post.findOne({ status: 'published' })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean()
      .exec();
  }

  /**
   * Obtiene posts relacionados (excluyendo el actual)
   */
  static async getRelatedPosts(currentSlug: string, limit: number = 3): Promise<IPost[]> {
    await connectDB();
    return Post.find({ 
      status: 'published',
      slug: { $ne: currentSlug }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }

  /**
   * Crea un nuevo post (solo admin)
   */
  static async createPost(
    input: CreatePostInput,
    session: Session | null
  ): Promise<IPost> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    // Validar input
    const validated = createPostSchema.parse(input);

    await connectDB();

    // Generar slug único
    const baseSlug = slugify(validated.title);
    const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
      const exists = await Post.findOne({ slug });
      return !!exists;
    });

    // Generar excerpt del primer párrafo
    const contentArray = Array.isArray(validated.content) 
      ? validated.content 
      : [validated.content];
    const excerpt = generateExcerpt(contentArray);

    // Autor por defecto
    const authorName = validated.authorName || 
      session.user.name || 
      session.user.email?.split('@')[0] || 
      'Democratizamos la Innovación';

    // Crear post
    const post = new Post({
      ...validated,
      slug: uniqueSlug,
      authorName,
      content: contentArray,
      excerpt,
    });

    await post.save();
    return post.toObject();
  }

  /**
   * Actualiza un post existente (solo admin)
   */
  static async updatePost(
    postId: string,
    input: Partial<CreatePostInput>,
    session: Session | null
  ): Promise<IPost> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    await connectDB();

    // Buscar post
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('NOT_FOUND');
    }

    // Validar input (campos opcionales)
    const validated = createPostSchema.partial().parse(input);

    // Si se actualiza el título, regenerar slug si es necesario
    if (validated.title && validated.title !== post.title) {
      const baseSlug = slugify(validated.title);
      if (baseSlug !== post.slug) {
        const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
          const exists = await Post.findOne({ slug, _id: { $ne: postId } });
          return !!exists;
        });
        post.slug = uniqueSlug;
      }
    }

    // Si se actualiza el contenido, regenerar excerpt
    if (validated.content) {
      const contentArray = Array.isArray(validated.content) 
        ? validated.content 
        : [validated.content];
      post.content = contentArray;
      post.excerpt = generateExcerpt(contentArray);
    }

    // Actualizar campos
    const { slug: _, content: __, ...updateData } = validated as any;
    Object.assign(post, updateData);
    await post.save();

    return post.toObject();
  }

  /**
   * Elimina un post (solo admin)
   */
  static async deletePost(postId: string, session: Session | null): Promise<void> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    await connectDB();

    // Buscar y eliminar post
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      throw new Error('NOT_FOUND');
    }
  }

  /**
   * Incrementa los likes de un post (público)
   */
  static async incrementLikes(slug: string): Promise<IPost> {
    try {
      await connectDB();
      console.log('[PostController] incrementLikes - Searching for slug:', slug);

      const post = await Post.findOne({ slug, status: 'published' });
      console.log('[PostController] incrementLikes - Post found:', !!post);
      
      if (!post) {
        // Intentar buscar sin el filtro de status para debugging
        const anyPost = await Post.findOne({ slug });
        console.log('[PostController] incrementLikes - Any post found:', !!anyPost, anyPost ? `status: ${anyPost.status}` : '');
        throw new Error('NOT_FOUND');
      }

      const currentLikes = post.likes || 0;
      post.likes = currentLikes + 1;
      await post.save();
      console.log('[PostController] incrementLikes - Likes updated:', currentLikes, '->', post.likes);

      return post.toObject();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[PostController] Error in incrementLikes:', {
        message: errorMessage,
        stack: errorStack,
        error,
        slug,
      });
      throw error;
    }
  }
}
