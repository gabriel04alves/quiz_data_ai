import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

// Em desenvolvimento a URL aponta para um SQLite local (file:./.data/dev.db) e o
// token fica vazio; em produção, para o Turso (libsql://...). O driver é o mesmo.
const config = useRuntimeConfig()

const url = config.tursoDatabaseUrl || 'file:./.data/dev.db'
const authToken = config.tursoAuthToken || undefined

export const client = createClient({ url, authToken })

export const db = drizzle(client, { schema })
