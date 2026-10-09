import { getProjects } from './data/projectdata.js'
import { getMembers } from './components/getTeam.js';
import { loadServices } from './components/getservices.js';


document.addEventListener('DOMContentLoaded', () => {

  const imageSlides = document.querySelectorAll(".hero-bg .slide");
  let currentImage = 0;
  const slideInterval = 8000; // Change image every 3 seconds (3000ms)

  function nextSlide() {
    // Remove 'active' class from current image
    imageSlides[currentImage].classList.remove("active");

    // Move to next slide, wrap around to 0 if at the end
    currentImage = (currentImage + 1) % imageSlides.length;

    // Add 'active' class to new image
    imageSlides[currentImage].classList.add("active");
  }

  // Start autoplay
  setInterval(nextSlide, slideInterval);


  // Gallery Filter Controls
  const filterButtons = document.querySelectorAll('#project-filters .filter-btn');
  const cards = document.querySelectorAll('#project-grid .project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Testimonials Carousel
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testi-dot');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('opacity-0');
        slide.classList.add('opacity-100');
      } else {
        slide.classList.remove('opacity-100');
        slide.classList.add('opacity-0');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.remove('inactive');
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
        dot.classList.add('inactive');
      }
    });

    currentSlide = index;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      let prev = currentSlide - 1;
      if (prev < 0) prev = slides.length - 1;
      showSlide(prev);
    });

    nextBtn.addEventListener('click', () => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => showSlide(idx));
    });
  }

loadProjects()
getMembers()
loadServices()
// console.log(getProjects)
async function loadProjects() {
  try {

    console.log('Starting to load projects...');
    const projects = await getProjects();

    console.log('Fetched projects:', projects); // Will now print the array

    if (!projects || projects.length === 0) {
      console.log('3. No projects returned or data is not an array.')
      return
    }

  } catch (error) {
    console.error(error.message);
  }
}




});



console.log("Hello , javascript is running without bug")
