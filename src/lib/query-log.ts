import fs from 'fs'
import path from 'path'

export interface QueryLogEntry {
  timestamp: string
  question: string
  towns: string[]
}

const LOG_PATH = path.join(process.cwd(), 'data', 'query-log.json')

function readLog(): QueryLogEntry[] {
  try {
    const raw = fs.readFileSync(LOG_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function logQuery(question: string, towns: string[]): void {
  try {
    const entries = readLog()
    entries.push({
      timestamp: new Date().toISOString(),
      question,
      towns,
    })
    fs.writeFileSync(LOG_PATH, JSON.stringify(entries, null, 2))
  } catch {
    // Don't let logging failures break chat
  }
}

export function getQueryLog(): QueryLogEntry[] {
  return readLog()
}
