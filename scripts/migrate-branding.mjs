// One-off migration that moves legacy data into the current FitVibe schema.
//
//   - Copies legacy "bajaj_*" collections into "fitvibe_*" collections.
//   - Renames the misspelled "challanges" field to "challenges".
//
// Usage:
//   MONGO_URI="..." MIGRATE_FROM_DB=Practice MONGODB_DB=fitvibe node scripts/migrate-branding.mjs
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const sourceDbName = process.env.MIGRATE_FROM_DB || 'Practice';
const targetDbName = process.env.MONGODB_DB || 'fitvibe';

if (!uri) {
  console.error('MONGO_URI is required');
  process.exit(1);
}

const COLLECTIONS = [
  { from: 'bajaj_users', to: 'fitvibe_users', isUsers: true },
  { from: 'bajaj_products', to: 'fitvibe_products', isUsers: false },
];

const client = new MongoClient(uri);

async function collectionExists(db, name) {
  const collections = await db.listCollections({ name }).toArray();
  return collections.length > 0;
}

async function migrateInPlace(db) {
  for (const { from, to } of COLLECTIONS) {
    if ((await collectionExists(db, from)) && !(await collectionExists(db, to))) {
      await db.collection(from).rename(to);
      console.log(`Renamed ${from} -> ${to}`);
    }
  }

  const users = db.collection('fitvibe_users');
  const result = await users.updateMany(
    { challanges: { $exists: true } },
    [
      { $set: { challenges: { $ifNull: ['$challenges', '$challanges'] } } },
      { $unset: 'challanges' },
    ]
  );
  console.log(`Renamed challanges -> challenges on ${result.modifiedCount} users`);
}

async function copyBetweenDatabases(source, target) {
  for (const { from, to, isUsers } of COLLECTIONS) {
    if (!(await collectionExists(source, from))) continue;

    const docs = await source.collection(from).find().toArray();
    const migrated = docs.map((doc) => {
      if (isUsers && doc.challanges && !doc.challenges) {
        doc.challenges = doc.challanges;
        delete doc.challanges;
      }
      return doc;
    });

    try {
      await target.collection(to).insertMany(migrated, { ordered: false });
      console.log(`Copied ${migrated.length} documents: ${from} -> ${to}`);
    } catch (error) {
      if (error.code === 11000) {
        console.warn(`${to} had duplicate _ids; insert the remainder manually if needed`);
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  await client.connect();
  const source = client.db(sourceDbName);
  const target = client.db(targetDbName);

  if (sourceDbName === targetDbName) {
    await migrateInPlace(target);
  } else {
    await copyBetweenDatabases(source, target);
  }

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
