const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.dobwaqgcebcsvvydrckx:Bajrang%40197@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
  });

  await client.connect();

  const query = `
    SELECT
        p.proname AS function_name,
        pg_get_function_arguments(p.oid) AS arguments,
        pg_get_function_result(p.oid) AS return_type
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
    ORDER BY p.proname;
  `;

  const res = await client.query(query);
  console.log(JSON.stringify(res.rows, null, 2));

  await client.end();
}

run().catch(console.error);
