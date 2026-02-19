import connectDB from '../lib/mongoose';
import Program from '../modules/programs/models/Program.model';
import Post from '../modules/posts/models/Post.model';
import Tool from '../modules/tools/models/Tool.model';

function isLocalizedObject(val: unknown): val is { es: unknown; en?: unknown } {
  return (
    typeof val === 'object' &&
    val !== null &&
    !Array.isArray(val) &&
    'es' in val
  );
}

async function migratePrograms() {
  const programs = await Program.find({}).lean();
  let updated = 0;
  for (const p of programs) {
    const update: Record<string, unknown> = {};
    if (!isLocalizedObject(p.title)) {
      update.title = { es: p.title };
    }
    if (!isLocalizedObject(p.shortDescription)) {
      update.shortDescription = { es: p.shortDescription };
    }
    if (!isLocalizedObject(p.content)) {
      const arr = Array.isArray(p.content) ? p.content : [String(p.content)];
      update.content = { es: arr };
    }
    if (Object.keys(update).length > 0) {
      await Program.updateOne({ _id: p._id }, { $set: update });
      updated++;
    }
  }
  return { total: programs.length, updated };
}

async function migratePosts() {
  const posts = await Post.find({}).lean();
  let updated = 0;
  for (const p of posts) {
    const update: Record<string, unknown> = {};
    if (!isLocalizedObject(p.title)) {
      update.title = { es: p.title };
    }
    if (!isLocalizedObject(p.excerpt)) {
      update.excerpt = { es: p.excerpt };
    }
    if (!isLocalizedObject(p.content)) {
      const arr = Array.isArray(p.content) ? p.content : [String(p.content)];
      update.content = { es: arr };
    }
    if (Object.keys(update).length > 0) {
      await Post.updateOne({ _id: p._id }, { $set: update });
      updated++;
    }
  }
  return { total: posts.length, updated };
}

async function migrateTools() {
  const tools = await Tool.find({}).lean();
  let updated = 0;
  for (const t of tools) {
    const update: Record<string, unknown> = {};
    if (!isLocalizedObject(t.title)) {
      update.title = { es: t.title };
    }
    if (!isLocalizedObject(t.description)) {
      update.description = { es: t.description };
    }
    if (!isLocalizedObject(t.content)) {
      update.content = { es: t.content };
    }
    if (Object.keys(update).length > 0) {
      await Tool.updateOne({ _id: t._id }, { $set: update });
      updated++;
    }
  }
  return { total: tools.length, updated };
}

async function main() {
  await connectDB();
  console.log('Migrating programs...');
  const programsResult = await migratePrograms();
  console.log(`Programs: ${programsResult.updated}/${programsResult.total} updated.`);

  console.log('Migrating posts...');
  const postsResult = await migratePosts();
  console.log(`Posts: ${postsResult.updated}/${postsResult.total} updated.`);

  console.log('Migrating tools...');
  const toolsResult = await migrateTools();
  console.log(`Tools: ${toolsResult.updated}/${toolsResult.total} updated.`);

  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
