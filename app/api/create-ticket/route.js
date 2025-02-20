export async function POST(req) {
    try {
        const { from, subject, conversation } = await req.json();
        console.log("📩 API received ticket with conversation:", { from, subject, conversation });

        global.ticketList = global.ticketList || [];

        // ✅ Ensure conversation is only for this ticket and formatted correctly
        const ticketConversation = (conversation || []).map(msg => ({
            sender: msg.sender || "Unknown", // Prevent missing sender data
            message: msg.message || "", // Ensure message is not null
            timestamp: msg.timestamp || new Date().toISOString() // Add timestamp if missing
        }));

        const newTicket = {
            id: Date.now(),
            from,
            subject,
            conversation: ticketConversation, // ✅ Stores only this ticket's messages
            timestamp: new Date().toISOString(),
            status: "unread",
            isStarred: false,
        };

        global.ticketList.push(newTicket);

        console.log("✅ Ticket saved successfully:", newTicket);

        return new Response(JSON.stringify({ success: true, ticket: newTicket }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            status: 201,
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            status: 500,
        });
    }
}

// ✅ Handle GET requests to fetch tickets
export async function GET() {
    console.log("📩 API GET Request: Fetching tickets list...");

    return new Response(JSON.stringify({ success: true, tickets: global.ticketList || [] }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        status: 200,
    });
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
