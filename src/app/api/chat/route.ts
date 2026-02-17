import Anthropic from '@anthropic-ai/sdk'
import {
  BASE_SYSTEM_PROMPT,
  getHeadlineContext,
  detectTowns,
  getTownContext,
} from '@/lib/chat-system-prompt'
import { logQuery } from '@/lib/query-log'

const anthropic = new Anthropic()

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response('Missing message', { status: 400 })
    }

    if (message.length > 1000) {
      return new Response('Message too long', { status: 400 })
    }

    // Detect mentioned towns, log query, and build context
    const townSlugs = detectTowns(message)
    logQuery(message, townSlugs).catch(() => {})
    let userContent = message

    if (townSlugs.length > 0) {
      // Specific town question — attach only that town's data
      const context = getTownContext(townSlugs)
      userContent = `${message}\n\n---\nRelevant data for this question:\n${context}`
    } else {
      // Broad question — attach headline stats only
      userContent = `${message}\n\n---\n${getHeadlineContext()}`
    }

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 400,
      system: BASE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch {
    return new Response('Internal server error', { status: 500 })
  }
}
