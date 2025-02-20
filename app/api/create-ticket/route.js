import { createClient } from "@supabase/supabase-js";

// 🔹 Initialize Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
    try {
        const { from, subject, conversation } = await req.json();
        console.log("📩 Saving ticket to Supabase:", { from, subject, conversation });

        // ✅ Format conversation properly
        const ticketConversation = (conversation || []).map(msg => ({
            sender: msg.sender || "Unknown", // Prevent missing sender data
            message: msg.message || "", // Ensure message is not null
            timestamp: msg.timestamp || new Date().toISOString() // Add timestamp if missing
        }));

        // ✅ Insert the ticket into Supabase
        const { data, error } = await supabase
            .from("tickets")
            .insert([
                {
                    from_email: from,
                    subject,
                    conversation: ticketConversation,
                    status: "open"
                }
            ])
            .select();

        if (error) throw error;

        console.log("✅ Ticket saved:", data[0]);

        return new Response(JSON.stringify({ success: true, ticket: data[0] }), {
            headers: { "Content-Type": "application/json" },
            status: 201
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}

// ✅ Handle GET requests to fetch all tickets from Supabase
export async function GET() {
    try {
        console.log("📩 API GET Request: Fetching tickets list...");

        const { data, error } = await supabase
            .from("tickets")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ success: true, tickets: data }), {
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
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        status: 204
    });
}
