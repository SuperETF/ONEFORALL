// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export type Database = {
  verified_members: {
    name: string;
    phone: string;
    coupon_code: string;
    used: boolean;
  };
};

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default supabase;
