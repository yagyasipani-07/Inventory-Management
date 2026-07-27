const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.dobwaqgcebcsvvydrckx:Bajrang%40197@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres'
});

const migrations = [
  '001_extensions.sql',
  '002_tables.sql',
  '003_constraints.sql',
  '004_indexes.sql',
  '005_functions.sql',
  '006_triggers.sql',
  '007_storage.sql',
  '008_seed.sql',
  '009_rls_policies.sql',
  '010_workflows_rpc.sql',
  '011_dev_anon_policies.sql',
  '012_v2_1_stabilization_sprint.sql'
];

async function runMigrations() {
  console.log("Connecting to Supabase PostgreSQL database...");
  await client.connect();
  console.log("Connected successfully!");

  for (const file of migrations) {
    const filePath = path.join(__dirname, 'supabase', 'migrations', file);
    console.log(`Applying migration: ${file}...`);
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      await client.query(sql);
      console.log(`✔ Successfully applied ${file}`);
    } catch (err) {
      console.error(`❌ Error executing ${file}:`, err.message);
      // Don't stop on already existing objects, log and continue
      if (!err.message.includes('already exists')) {
        // Log detailed error
        console.error(err);
      }
    }
  }

  // Verify tables in public schema
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;");
  console.log("\n====================================");
  console.log("Public schema tables after migration:");
  console.log(res.rows.map(r => r.table_name));
  console.log("====================================");

  await client.end();
  console.log("Done!");
}

runMigrations().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
