import { createClient } from "@libsql/client"
import path from "path"
import { fileURLToPath } from "url"

const dir = path.dirname(fileURLToPath(import.meta.url))
const abs = path.resolve(dir, "prisma/dev.db").replace(/\\/g, "/")
const url = `file:${abs}`

console.log("DB URL:", url)

const client = createClient({ url })

try {
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table'")
  console.log("Tables:", result.rows.map(r => r.name))

  const users = await client.execute("SELECT COUNT(*) as count FROM users")
  console.log("User count:", users.rows[0].count)
} catch (e) {
  console.error("Error:", e.message)
} finally {
  client.close()
}
