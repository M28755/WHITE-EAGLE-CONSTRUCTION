import { getTeamMembers } from "../data/teamdata.js";

export async function loadMembers() {
    const teamSection = document.querySelector('.principals-grid');
    if (!teamSection) {
        console.warn('Target element ".principals-grid" not found');
        return;
    }

    teamSection.setAttribute("aria-busy", "true");

    try {
        const team = await getTeamMembers();

        if (!team || team.length === 0) {
            teamSection.textContent = "No team Members Available at the moment";
            return;
        }

        // Ensure the API returns an array.
        if (!Array.isArray(team)) {
            throw new TypeError(
                "Invalid API response: expected an array of team members."
            );
        }

        // Clear container and build cards using a document fragment
        teamSection.textContent = "";
        const fragment = document.createDocumentFragment();

        team.forEach((member) => {
            if (!member || typeof member !== "object" || Array.isArray(member)) {
                return;
            }

            const card = document.createElement("div");
            card.className = "principal-card";

            // 1. Create and populate profile image wrapper
            const imageWrapper = document.createElement("div");
            imageWrapper.className = "principal-card-img";

            const safeUrl = getSafeImageUrl(member.image); // Assumes property name is 'image'
            if (safeUrl) {
                const img = document.createElement("img");
                img.src = safeUrl;
                img.alt = member.name ? `${member.name}'s profile photo` : "Team member photo";
                imageWrapper.appendChild(img);
            }
            card.appendChild(imageWrapper);

            // 2. Member Name
            const memberName = document.createElement('h2');
            memberName.textContent = member.name || "Unnamed";
            card.appendChild(memberName);

            // 3. Member Description / Role
            const description = document.createElement('p');
            // Extract text whether it's a simple string or Sanity Portable Text array
            if (Array.isArray(member.biography)) {
                description.textContent = parsePortableText(member.biography);
            } else {
                description.textContent = member.biography || member.description || member.role || "";
            }
            card.appendChild(description);

            fragment.appendChild(card);
        });

        teamSection.append(fragment);
        console.log('Team Members:', team);

    } catch (error) {
        console.error('Failed to fetch team members:', error.message);
        teamSection.textContent = "Failed to load team members. Please try again later.";
    } finally {
        teamSection.setAttribute("aria-busy", "false");
    }
}

// Function to validate image URLs before displaying them
const getSafeImageUrl = (value) => {
    if (typeof value !== "string" || !value.trim()) {
        return null;
    }

    try {
        const url = new URL(value, window.location.origin);

        if (url.protocol !== "https:" && url.origin !== window.location.origin) {
            return null;
        }

        return url.href;
    } catch {
        console.error("Invalid image URL");
        return null;
    }
};

const parsePortableText = (biographyArray) => {
    if (!Array.isArray(biographyArray)) return "";

    return biographyArray
        .map(block => {
            if (!block.children || !Array.isArray(block.children)) return "";
            // Combine all spans within the block
            return block.children.map(child => child.text || "").join("");
        })
        .join(" ");
}