import { createClient } from "@supabase/supabase-js";

// 🔹 Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function PUT(req) {
    try {
        const { id, conversation } = await req.json();
        console.log("✏️ Updating ticket conversation in Supabase:", { id, conversation });

        if (!id || !conversation) {
            throw new Error("❌ Missing ticket ID or conversation data.");
        }

        // ✅ Update only the conversation field in Supabase
        const { data, error } = await supabase
            .from("tickets")
            .update({ conversation })
            .eq("id", id);

        if (error) throw error;

        console.log("✅ Ticket updated successfully:", data);
        return new Response(JSON.stringify({ success: true, updatedTicket: data }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}

// ✅ Handle CORS preflight requests
export async function OPTIONS() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        status: 204
    });
}
