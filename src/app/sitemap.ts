import { MetadataRoute } from 'next';
import { getCanonicalBaseUrl } from '@/config/site';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import { ToolController } from '@/modules/tools/controllers/tool.controller';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalBaseUrl();
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/inicio`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aviso-de-privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/programas`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/herramientas`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Dynamic routes from MongoDB
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Blog posts
    const posts = await PostController.listPublishedPosts('recent');
    for (const post of posts) {
      dynamicRoutes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.createdAt || now,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching blog posts:', error);
  }

  try {
    // Programs
    const programs = await ProgramController.listPublishedPrograms();
    for (const program of programs) {
      dynamicRoutes.push({
        url: `${baseUrl}/programas/${program.slug}`,
        lastModified: program.updatedAt || program.createdAt || now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching programs:', error);
  }

  try {
    // Tools
    const tools = await ToolController.listPublishedTools();
    for (const tool of tools) {
      dynamicRoutes.push({
        url: `${baseUrl}/herramientas/${tool.slug}`,
        lastModified: tool.updatedAt || tool.createdAt || now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching tools:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}

