const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Missing Supabase credentials in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const testId = '757a0c83-01c0-4c42-9827-7eaa61292ea4';
  
  console.log('Checking testId:', testId);
  const { data: test, error } = await supabase
    .from('visa_tests')
    .select('*')
    .eq('id', testId)
    .single();

  console.log('Test Error:', error);
  console.log('Test Data:', test);

  const { data: profile } = await supabase
    .from('ds160_profiles')
    .select('id, test_id')
    .eq('test_id', testId)
    .single();
    
  console.log('Profile Data (exists):', !!profile);

  const { data: breakdown } = await supabase
    .from('visa_score_breakdown')
    .select('*')
    .eq('test_id', testId)
    .single();

  console.log('Breakdown Data (exists):', !!breakdown, breakdown ? 'Total pts: ' + (breakdown.economic_points + breakdown.rootedness_points + breakdown.travel_history_points + breakdown.migration_history_points + breakdown.personal_points) : '');
}

check();
