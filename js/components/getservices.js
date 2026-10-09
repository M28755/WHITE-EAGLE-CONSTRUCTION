import { getServices } from "../data/servicedata.js";


export async function loadServices() {


const serviceSection = document.querySelector('.services-stack')

if(!serviceSection){
    console.log('No node with "service-stack" id')
    return;
}
  console.log(serviceSection)
    try {

        console.log('Loading services ....')
        const services = await getServices()


if (!Array.isArray(services) || services.length === 0) {
  serviceSection.textContent = 'No services available at the moment.';
  return;
}

     console.log('Services :', services)
      
     // Clear any residual static HTML before appending dynamic cards
    serviceSection.innerHTML = '';
   
    //looping through all services
    services.forEach((service, index) => {
        const serviceCard = document.createElement('div');
      
      // Assign grid layout class dynamically or default to service-4col
      serviceCard.className = `service-card ${service.gridClass || 'service-4col'}`;

     console.log(service[index].title)
      // Format index number (e.g., 01, 02, 03)
      const serviceNumber = String(index + 1).padStart(2, '0');

      // Extract image markup if image and URL exist
      const imageMarkup = service.image?.url
        ? `
          <div style="width: 100%; height: 8rem; border-radius: 0.75rem; overflow: hidden; margin-bottom: 1.5rem; background-color: var(--color-surface-container-lowest);">
            <img src="${service.image.url}" alt="${service.image.alt || service.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        `
        : '';

        // Construct inner HTML
      serviceCard.innerHTML += `
        <div>
          <span class="service-pill-tag" style="color: var(--color-primary); display: inline-block; margin-bottom: 1.5rem;">
            ${serviceNumber} / ${service[0].title || 'Service'}
          </span>
          <h3 style="font: var(--font-headline-md); color: var(--color-on-surface); margin-bottom: 0.75rem;">
            ${service.title || ''}
          </h3>
          <p style="font: var(--font-body-sm); color: var(--color-on-surface-variant); margin-bottom: 1.5rem;">
            ${service.shortDescription || service.description || ''}
          </p>
        </div>
        ${imageMarkup}
        <a href="#${service.slug || 'contact'}" style="font: var(--font-label-blueprint); color: var(--color-primary); text-transform: uppercase; display: flex; align-items: center; gap: 0.25rem;">
          <span>Scope Details</span>
          <span class="material-symbols-outlined" style="font-size: 18px;">north_east</span>
        </a>
      `;

      serviceSection.append(serviceCard);

        
    });



    } catch (error) {
        //catching network error and throw error
        console.log('Field to fetch services', error.message);
        throw error;
        
    }


}