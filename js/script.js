import { loadProjects } from './components/getProjects.js';
import { loadMembers } from './components/getTeam.js';
import { loadServices } from './components/getservices.js';
import { loadTestimonials } from './components/getTestimonials.js';


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
loadProjects()
loadMembers()
loadServices()
loadTestimonials()
// console.log(getProjects)

initMobileMenu()
});
 function initMobileMenu() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.header-nav .nav-link');

  if (!header || !menuToggle) return;

  // Toggle mobile menu on click
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');

    console.log('open')
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu automatically when a link inside the nav is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(lin => lin.classList.remove('active'))
       
      link.classList.add('active')
      if (header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close menu if user clicks outside the drawer overlay
  document.addEventListener('click', (event) => {
    const isClickInside = header.contains(event.target);
    if (!isClickInside && header.classList.contains('nav-open')) {
      header.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
