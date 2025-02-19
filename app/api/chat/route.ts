import { NextResponse } from 'next/server'

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL

if (!N8N_WEBHOOK_URL) {
  console.error('N8N_WEBHOOK_URL is not defined in the environment variables')
}

export async function POST(req: Request) {
  if (!N8N_WEBHOOK_URL) {
    return NextResponse.json({ error: 'Webhook URL is not configured' }, { status: 500 })
  }

  try {
    const { message } = await req.json()

    // Send the message to the n8n webhook
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    if (!n8nResponse.ok) {
      throw new Error(`Failed to get response from n8n webhook: ${n8nResponse.statusText}`)
    }

    const data = await n8nResponse.json()

    // Assuming the n8n webhook returns a response field
    return NextResponse.json({ response: data.response })
  } catch (error) {
    console.error('Error in chat API route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}