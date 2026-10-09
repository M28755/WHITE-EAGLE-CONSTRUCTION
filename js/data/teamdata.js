import { API_URL } from "../api.js";

 export async function getTeamMembers() {
  
        const response = await fetch(`${API_URL}team`)

        //check is the response is ok
        if(!response.ok){
            throw new Error(`HTTP ERROR ${response.status}`);

            return;
        }
        const result  = await response.json();


  return result.data
    
}