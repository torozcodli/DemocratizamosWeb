import { Session } from 'next-auth';
import connectDB from '@/lib/mongoose';
import Program, { IProgram } from '../models/Program.model';
import { createProgramSchema, CreateProgramInput } from '../validation/program.validation';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';
import { isAdminEmail } from '@/lib/admin';

export class ProgramController {
  /**
   * Reasigna order de forma secuencial (1..n), sin huecos.
   */
  private static async resequenceProgramOrders(): Promise<void> {
    const programs = await Program.find().sort({ order: 1, createdAt: 1 }).select('_id order').lean().exec();
    const bulkOps = programs.map((program, index) => ({
      updateOne: {
        filter: { _id: program._id },
        update: { $set: { order: index + 1 } },
      },
    }));
    if (bulkOps.length > 0) {
      await Program.bulkWrite(bulkOps);
    }
  }

  /**
   * Lista programas publicados ordenados por order
   */
  static async listPublishedPrograms(): Promise<IProgram[]> {
    try {
      await connectDB();
      
      const programs = await Program.find({ status: 'published' })
        .sort({ order: 1 })
        .lean()
        .exec();
      
      return programs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('[ProgramController] Error in listPublishedPrograms:', {
        message: errorMessage,
        stack: errorStack,
        error
      });
      throw error;
    }
  }

  /**
   * Lista todos los programas (admin)
   */
  static async listAllPrograms(): Promise<IProgram[]> {
    await connectDB();
    return Program.find().sort({ order: 1 }).lean().exec();
  }

  /**
   * Obtiene un programa por slug
   */
  static async getProgramBySlug(slug: string): Promise<IProgram | null> {
    await connectDB();
    return Program.findOne({ slug }).lean().exec();
  }

  /**
   * Obtiene el programa anterior (por order)
   */
  static async getPreviousProgram(currentOrder: number): Promise<IProgram | null> {
    await connectDB();
    return Program.findOne({ order: { $lt: currentOrder }, status: 'published' })
      .sort({ order: -1 })
      .limit(1)
      .lean()
      .exec();
  }

  /**
   * Obtiene el programa siguiente (por order)
   */
  static async getNextProgram(currentOrder: number): Promise<IProgram | null> {
    await connectDB();
    return Program.findOne({ order: { $gt: currentOrder }, status: 'published' })
      .sort({ order: 1 })
      .limit(1)
      .lean()
      .exec();
  }

  /**
   * Obtiene el último order para asignar uno nuevo
   */
  static async getLastOrder(): Promise<number> {
    await connectDB();
    const lastProgram = await Program.findOne().sort({ order: -1 }).lean().exec();
    return lastProgram ? lastProgram.order + 1 : 1;
  }

  /**
   * Crea un nuevo programa (solo admin)
   */
  static async createProgram(
    input: CreateProgramInput,
    session: Session | null
  ): Promise<IProgram> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    // Validar input
    const validated = createProgramSchema.parse(input);

    await connectDB();

    const titleForSlug = typeof validated.title === 'string' ? validated.title : validated.title.es;
    const baseSlug = slugify(titleForSlug);
    const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
      const exists = await Program.findOne({ slug });
      return !!exists;
    });

    // Orden automatico: siempre al final.
    const order = await this.getLastOrder();

    // Crear programa
    const program = new Program({
      ...validated,
      slug: uniqueSlug,
      order,
    });

    await program.save();
    return program.toObject();
  }

  /**
   * Actualiza un programa existente (solo admin).
   * Slug estable: no se regenera por cambio de título; solo se actualiza si el body incluye "slug" explícitamente.
   * Manual check: editar título y guardar no debe cambiar la URL del programa.
   */
  static async updateProgram(
    programId: string,
    input: Partial<CreateProgramInput>,
    session: Session | null
  ): Promise<IProgram> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    await connectDB();

    // Buscar programa
    const program = await Program.findById(programId);
    if (!program) {
      throw new Error('NOT_FOUND');
    }

    const validated = createProgramSchema.partial().parse(input);
    const slugFromBody = (input as { slug?: string }).slug;

    if (slugFromBody != null && String(slugFromBody).trim() !== '') {
      const newSlug = String(slugFromBody).trim();
      if (newSlug !== program.slug) {
        const baseSlug = slugify(newSlug);
        const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
          const exists = await Program.findOne({ slug, _id: { $ne: programId } });
          return !!exists;
        });
        program.slug = uniqueSlug;
      }
    }

    const { slug: _s, order: _o, ...updateData } = validated as any;
    Object.assign(program, updateData);
    await program.save();

    return program.toObject();
  }

  /**
   * Elimina un programa (solo admin)
   */
  static async deleteProgram(programId: string, session: Session | null): Promise<void> {
    // Verificar autenticación
    if (!session || !session.user) {
      throw new Error('UNAUTHORIZED');
    }

    // Verificar que sea admin
    if (!isAdminEmail(session.user.email)) {
      throw new Error('FORBIDDEN');
    }

    await connectDB();

    // Buscar y eliminar programa
    const program = await Program.findByIdAndDelete(programId);
    if (!program) {
      throw new Error('NOT_FOUND');
    }

    // Reindexar para mantener 1..n sin huecos.
    await this.resequenceProgramOrders();
  }
}
