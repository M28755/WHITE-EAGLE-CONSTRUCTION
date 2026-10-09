
import { API_URL } from "../api.js"

export async function getServices() {
  const response = await fetch(`${API_URL}services`)

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: Failed to fetch testimonials`)
  }

  const result = await response.json()
  
  // Unwraps and returns the data array
  return result.data
}