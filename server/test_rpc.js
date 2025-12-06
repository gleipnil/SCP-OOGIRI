
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase environment variables!');
    process.exit(1);
}

const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function testRpc() {
    console.log("Testing increment_total_plays RPC...");
    const testUserId = "00000000-0000-0000-0000-000000000000"; // Dummy UUID

    try {
        const { data, error } = await supabaseAdmin.rpc('increment_total_plays', { user_id: testUserId });

        if (error) {
            console.error("RPC Failed:", error);
        } else {
            console.log("RPC Success. Data:", data);
        }
    } catch (e) {
        console.error("Unexpected error:", e);
    }
}

testRpc();
