

import { API_URL } from "../api.js";

export async function getTestimonials() {
  const response = await fetch(`${API_URL}testimonial`)

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: Failed to fetch testimonials`)
  }

  const result = await response.json()
  const rawData = result.data || result

  // Safeguard: If the array is nested like [[...]], unwrap it
  if (Array.isArray(rawData) && Array.isArray(rawData[0])) {
    return rawData[0]
  }

  return rawData
}