import { Session } from 'next-auth';
import connectDB from '@/lib/mongoose';
import Tool, { ITool } from '../models/Tool.model';
import { createToolSchema, CreateToolInput, updateToolSchema, UpdateToolInput } from '../validation/tool.validation';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';
import { isAdminEmail } from '@/lib/admin';

export class ToolController {
  /**
   * Lista herramientas publicadas ordenadas
   */
  static async listPublishedTools(): Promise<ITool[]> {
    try {
      await connectDB();
      return Tool.find({ isPublished: true })
        .sort({ date: -1, createdAt: -1 })
        .lean()
        .exec();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[ToolController] Error in listPublishedTools:', {
        message: errorMessage,
        stack: errorStack,
        error
      });
      throw error;
    }
  }

  /**
   * Lista todas las herramientas (admin)
   */
  static async listAllTools(): Promise<ITool[]> {
    try {
      await connectDB();
      return Tool.find().sort({ date: -1, createdAt: -1 }).lean().exec();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[ToolController] Error in listAllTools:', {
        message: errorMessage,
        error
      });
      throw error;
    }
  }

  /**
   * Obtiene una herramienta por slug
   */
  static async getToolBySlug(slug: string): Promise<ITool | null> {
    try {
      await connectDB();
      return Tool.findOne({ slug, isPublished: true }).lean().exec();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[ToolController] Error in getToolBySlug:', {
        message: errorMessage,
        error,
        slug
      });
      throw error;
    }
  }

  /**
   * Crea una nueva herramienta (solo admin)
   */
  static async createTool(
    input: CreateToolInput,
    session: Session | null
  ): Promise<ITool> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    // Validar input
    const validated = createToolSchema.parse(input);

    await connectDB();

    // Generar slug único
    const baseSlug = slugify(validated.title);
    const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
      const exists = await Tool.findOne({ slug });
      return !!exists;
    });

    // Crear herramienta
    const tool = new Tool({
      ...validated,
      slug: uniqueSlug,
      date: validated.date || new Date(),
    });

    await tool.save();
    return tool.toObject();
  }

  /**
   * Actualiza una herramienta existente (solo admin)
   */
  static async updateTool(
    toolId: string,
    input: UpdateToolInput,
    session: Session | null
  ): Promise<ITool> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    await connectDB();

    // Buscar herramienta
    const tool = await Tool.findById(toolId);
    if (!tool) {
      throw new Error('NOT_FOUND');
    }

    // Validar input (campos opcionales)
    const validated = updateToolSchema.parse(input);

    // Si se actualiza el título, regenerar slug si es necesario
    if (validated.title && validated.title !== tool.title) {
      const baseSlug = slugify(validated.title);
      if (baseSlug !== tool.slug) {
        const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
          const exists = await Tool.findOne({ slug, _id: { $ne: toolId } });
          return !!exists;
        });
        tool.slug = uniqueSlug;
      }
    }

    // Actualizar campos (mantener imageUrl si no viene en el payload)
    const updateData: any = {};
    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.content !== undefined) updateData.content = validated.content;
    if (validated.imageUrl !== undefined && validated.imageUrl !== '') {
      updateData.imageUrl = validated.imageUrl;
    }
    // Si imageUrl viene vacío o null, no lo actualizamos (mantenemos el existente)
    if (validated.date !== undefined) updateData.date = validated.date;
    if (validated.isPublished !== undefined) updateData.isPublished = validated.isPublished;

    Object.assign(tool, updateData);
    await tool.save();

    return tool.toObject();
  }

  /**
   * Elimina una herramienta (solo admin)
   */
  static async deleteTool(toolId: string, session: Session | null): Promise<void> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    await connectDB();

    // Buscar y eliminar herramienta
    const tool = await Tool.findByIdAndDelete(toolId);
    if (!tool) {
      throw new Error('NOT_FOUND');
    }
  }
}
