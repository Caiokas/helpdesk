export async function POST(req) {
    try {
        const { from, subject, message } = await req.json();
        console.log("📩 API received ticket:", { from, subject, message });

        global.ticketList = global.ticketList || [];

        const newTicket = {
            id: Date.now(),
            from,
            subject,
            message,
            timestamp: new Date().toISOString(),
            status: "unread",
            isStarred: false,
            conversation: [],
        };

        global.ticketList.push(newTicket);

        console.log("✅ Ticket saved:", newTicket);

        return new Response(JSON.stringify({ success: true, ticket: newTicket }), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // ✅ Allow external requests
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
    console.log("📩 API GET Request: Sending tickets list");
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
