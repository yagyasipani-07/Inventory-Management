const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://dobwaqgcebcsvvydrckx.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYndhcWdjZWJjc3Z2eWRyY2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNjA5NDIsImV4cCI6MjA5OTkzNjk0Mn0.IC4PZITtqRr-QcZ_ULmV5PFziIvDCpcSbXXGynmUblU");
async function run() {
  const { data, error } = await supabase.from('warehouse_stock').select('*, products(*), warehouses(warehouse_name)').limit(2);
  console.log(JSON.stringify(data, null, 2));
}
run();
