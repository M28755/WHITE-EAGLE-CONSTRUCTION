import { getProjects } from "../data/projectdata.js";

export async function loadProjects() {
    const projectGrid = document.querySelector('#project-grid')
    const filterButtons = document.querySelectorAll('#project-filters .filter-btn');

    if (!projectGrid || !filterButtons) {
        console.warn('Target elements not found')
        return
    }
    projectGrid.setAttribute("aria-busy", "true");

    try {

        const projects = await getProjects();
        //console.log(projects)
        if (!projects || projects.length === 0) {
            projectGrid.textContent = "No projects available at the";
            return;
        }
        // checking if the data is in array form
        if (Array.isArray(projects)) {
            throw new TypeError("Invalid API response")
        }
        //clearing grid and building cards using a documnet fragment
        projectGrid.textContent = "";
        const fragment = document.createDocumentFragment();

        projects.data.forEach((project) => {
            const card = document.createElement("div");
            card.className = 'project-card';
            //console.log(project)
            //category attributes for filterig
            card.setAttribute("data-category", project.category || "all");

            //image wrapper
            const imageWrapper = document.createElement('div');
            imageWrapper.className = "project-card-img";

            const imageSource = project.featuredImage.url || project.mainImage?.asset?.url || project.mainImage;
            const safeUrl = getSafeImageUrl(imageSource);

            if (safeUrl) {
                const img = document.createElement('img');
                img.src = safeUrl;
                img.alt = project.title ? `${project.title} project preview` : 'Project preview image'

                imageWrapper.appendChild(img);
            }


            //project title
            const title = document.createElement('h3')
            title.textContent = project.title || "Untitled Project"
               
            //project description
            const description = document.createElement('p');
             description.textContent = project.excerpt;

             

            card.append(imageWrapper, title, description)
            fragment.appendChild(card)
        })
        projectGrid.append(fragment)
        setupProjectFilter(filterButtons, projectGrid)




    } catch (error) {
        console.error("Failed to load Projects:", error.message);
        projectGrid.textContent = "Failed to load projects. Please try again loading";


    } finally {
        projectGrid.setAttribute("aria-busy", "false");
    }
}

const getSafeImageUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) {
        return null;
    }
    try {
        const url = new URL(value, window.location.origin);

        if (url.protocol !== 'https:' && url.origin !== window.location.origin) {
            return null
        }

        return url.href
    } catch (error) {
        return value;

    }
}

function setupProjectFilter(filterButtons, projectGrid) {
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');

            });

            btn.classList.add('active');//set the clicked btn active

            const filter = btn.getAttribute('data-filter');//access the attribute ofthe target btn
            const cards = projectGrid.querySelectorAll('.project-card')

           // console.log(cards)

            cards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category == filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50)
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            })
        });
    });
}
