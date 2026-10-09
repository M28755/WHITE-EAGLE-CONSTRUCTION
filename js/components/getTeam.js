import { getTeamMembers } from "../data/teamdata.js";

export async function getMembers() {
    try {
        const team = await getTeamMembers();

        if(!team || team.length === 0){
            console.log("No team member found")
            return
        }
        
        console.log('Team Members:' , team)
    } catch (error) {

        console.log('Failed to fetch team members', error.message)
        
    }
    
}