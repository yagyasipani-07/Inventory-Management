const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.dobwaqgcebcsvvydrckx:Bajrang%40197@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
  });

  await client.connect();
  console.log("Connected to database.");

  try {
    const migration15Path = path.join(__dirname, 'supabase', 'migrations', '015_warehouse_stock_trigger.sql');
    const migration16Path = path.join(__dirname, 'supabase', 'migrations', '016_transactional_dispatch.sql');

    const sql15 = fs.readFileSync(migration15Path, 'utf8');
    const sql16 = fs.readFileSync(migration16Path, 'utf8');

    console.log("Applying Migration 015...");
    await client.query(sql15);
    console.log("Migration 015 Applied successfully.");

    console.log("Applying Migration 016...");
    await client.query(sql16);
    console.log("Migration 016 Applied successfully.");

  } catch (error) {
    console.error("Error applying migrations:", error);
  } finally {
    await client.end();
    console.log("Disconnected.");
  }
}

run().catch(console.error);
