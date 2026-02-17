import { Redis } from '@upstash/redis'

export interface QueryLogEntry {
  timestamp: string
  question: string
  towns: string[]
}

const REDIS_KEY = 'adupulse:query_log'

function getRedis(): Redis | null {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  })
}

export async function logQuery(question: string, towns: string[]): Promise<void> {
  try {
    const redis = getRedis()
    if (!redis) return

    const entry: QueryLogEntry = {
      timestamp: new Date().toISOString(),
      question,
      towns,
    }
    // Push to the end of a Redis list
    await redis.rpush(REDIS_KEY, JSON.stringify(entry))
  } catch {
    // Don't let logging failures break chat
  }
}

export async function getQueryLog(): Promise<QueryLogEntry[]> {
  try {
    const redis = getRedis()
    if (!redis) return []

    const raw = await redis.lrange(REDIS_KEY, 0, -1)
    return raw.map(item =>
      typeof item === 'string' ? JSON.parse(item) : item as QueryLogEntry
    )
  } catch {
    return []
  }
}
