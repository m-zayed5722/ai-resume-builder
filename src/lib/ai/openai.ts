import OpenAI from "openai"

// Falls back to local Ollama when OPENAI_API_KEY is not set.
// Ollama exposes an OpenAI-compatible API at /v1 - no extra packages needed.
const isOllama =
  !process.env.OPENAI_API_KEY ||
  process.env.OPENAI_API_KEY.trim() === ""

export const openai = new OpenAI(
  isOllama
    ? {
        baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
        apiKey: "ollama", // required by SDK but ignored by Ollama
      }
    : {
        apiKey: process.env.OPENAI_API_KEY!,
      }
)

export const AI_MODEL = isOllama
  ? (process.env.OLLAMA_MODEL ?? "llama3.2")
  : "gpt-4o-mini"

// OpenAI supports strict JSON mode; Ollama requires prompt-based JSON extraction
export const USE_JSON_MODE = !isOllama
