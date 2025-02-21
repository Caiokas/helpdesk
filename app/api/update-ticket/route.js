import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PUT(req) {
    try {
        const { id, status, conversation } = await req.json();

        if (!id) {
            throw new Error("❌ Missing ticket ID.");
        }

        const updateData = {};

        if (status) {
            updateData.status = status;
        }

        if (conversation) {
            updateData.conversation = conversation;
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error("❌ No update data provided.");
        }

        const { data, error } = await supabase
            .from("tickets")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, ticket: data[0] }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}
