import { API_URL } from "../api.js";


export async function getProjects() {
  const response = await fetch(`${API_URL}projects`)
  if (!response.ok) throw new Error('Failed to fetch projects')
  

    const result = await response.json();
  
    return result
}

export async function getProject(slug) {
  const response = await fetch(`${API_BASE_URL}/${slug}`)
  if (!response.ok) throw new Error('Failed to fetch project detail')
  return response.json()
}
