
import { supabaseAdmin } from './utils/supabaseAdmin';

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
