import { getServices } from "../data/servicedata.js";

export async function loadServices() {
    const serviceSection = document.querySelector(".services-stack")

    //check whether the target contaiiner exists
    if (!serviceSection) {
        console.warn('Target element ".services-stack" not found in the DOM');

        return;
    }
    //inform assistive technologies that the section is loading
    serviceSection.setAttribute("aria-busy", "true")

    try {

        console.log("Loading services...");

        //fetch services
        const services = await getServices();

        //check if the APi returns an array
        if (!Array.isArray(services)) {
            throw new TypeError("Invalid API response:expected an array of services")
            return;
        }

        //message if the API returns no services
        if (services.length === 0) {
            serviceSection.textContent = "No services available at the moment.";
            return;
        }

        console.log("Services:", services);

        //building the cards separately before updateing the DOM
        const fragment = document.createDocumentFragment();

        //loop through each service returned by API
        services.forEach((service, index) => {
            /*   if (!service || typeof service !== "object" || Array.isArray(service)) {
                  console.warn("Skipping invalid service record:", service)
                  return;
              } */

            console.log(service.title)

            //creating the service card
            const serviceCard = document.createElement("article");


            // Allow only known grid classes to prevent arbitrary
            // class names from being injected through API data.
            const allowedGridClasses = [
                "service-4col",
                "service-3col",
                "service-2col",
                "service-1col",
            ];
            const gridClass = allowedGridClasses.includes(service.gridClass) ? service.gridClass : "service-4col"


            serviceCard.className = `service-card ${gridClass}`;

            const serviceNumber = String(index + 1).padStart(2, "0");

            //TITLE
            const title = typeof service.title === 'string' && service.title.trim() ? service.title.trim() : "Service";

            //content wrapper
            const content = document.createElement("div");

            const tag = document.createElement("span")
            tag.className = "service-pill-tag";
            tag.textContent = `${serviceNumber} / ${title}`;

            //SERVICE HEADING
            const heading = document.createElement("h3")
            heading.textContent = title;

            //SERVICE DESCRIPTION
            const description = document.createElement("p");
            description.textContent =
                typeof service.shortDescription === "string" &&
                    service.shortDescription.trim()
                    ? service.shortDescription.trim()
                    : typeof service.description === "string"
                        ? service.description.trim()
                        : "";

            content.append(tag, heading, description)

            serviceCard.appendChild(content)
            //check whether the wrapper to the an service card

            const imageUrl = service.image?.url;

            console.log(imageUrl)
            if (typeof imageUrl === "string" && imageUrl.trim()) {
                try {

                    const parsedUrl = new URL(imageUrl, window.location.origin);

                    const isSafeUrl = parsedUrl.protocol === "https:" || parsedUrl.origin === window.location.origin;;

                    if (isSafeUrl) {
                        //image wrapper
                        const imageWrapper = document.createElement("div");
                        imageWrapper.className = "service-card__image";

                        //create and configure the image element
                        const image = document.createElement("img");
                        image.src = parsedUrl.href;


                        image.alt = typeof service.image?.alt === "string" ? service.image.alt : title;

                        //improve loading performance for off-screen image
                        image.loading = "lazy";
                        image.decoding = "async";


                        //appending the image to its wrapper
                        imageWrapper.appendChild(image)
                        serviceCard.appendChild(imageWrapper)

                    } else {
                        console.warn("Rejected unsupported image URL")
                    }

                } catch (error) {

                    console.warn("Skipping invalid image URL for : " , ti)

                }
            }




            //add the card to the document fragment
            fragment.appendChild(serviceCard)
            console.log(serviceCard)


        });

        //replace old content with the newly created service card
        serviceSection.replaceChildren(fragment)
/* 
        if (fragment.childNodes.length === 0) {
            serviceSection.textContent = 'No valid services available';
            return;

        }
 */
    } catch (error) {

        console.error("Failed to fetch services:", error);

        serviceSection.textContent = "Unable to load services. Please try again later";

    } finally {
        serviceSection.setAttribute("aria-busy", "false")
    }

}