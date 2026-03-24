require('dotenv').config({ path: 'apps/admin/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function signIn() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin2@gmail.com',
    password: 'Admin123!',
  });

  if (error) {
    console.error('Login Failed:', error);
    process.exit(1);
  }

  console.log('Login Succeeded!', data.user.id);
  
  // Try querying profiles as an admin!
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
    
  if (profErr) {
    console.error('Profile fetch failed:', profErr);
  } else {
    console.log('Profile fetch succeeded:', profile);
  }
}

signIn();
