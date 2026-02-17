import { Redis } from '@upstash/redis'

export interface QueryLogEntry {
  timestamp: string
  question: string
  towns: string[]
}

const REDIS_KEY = 'adupulse:query_log'

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
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

export function getRedisStatus(): { connected: boolean; source: string } {
  const kv = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
  const upstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  if (kv) return { connected: true, source: 'KV_REST_API_*' }
  if (upstash) return { connected: true, source: 'UPSTASH_REDIS_REST_*' }
  return { connected: false, source: 'none' }
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
