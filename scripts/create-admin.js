require('dotenv').config({ path: 'apps/admin/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: 'master@petroapply.com',
    password: 'Admin123!'
  });

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  } else {
    console.log('User created:', data.user.id);
  }
}

main();
