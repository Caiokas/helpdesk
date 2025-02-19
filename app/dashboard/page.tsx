import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatbotWidget from "@/app/components/widget";

export default function Dashboard() {
  return (
    <>
      <div className="relative">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">1,234</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">56</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Response Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">95%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ Ensure Chatbot is outside the main div */}
      <ChatbotWidget />
    </>
  );
}
