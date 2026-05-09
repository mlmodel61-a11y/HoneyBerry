const body = document.body;
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");

const updateHeaderState = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();

let isTicking = false;
window.addEventListener(
  "scroll",
  () => {
    if (isTicking) return;
    isTicking = true;
    requestAnimationFrame(() => {
      updateHeaderState();
      isTicking = false;
    });
  },
  { passive: true }
);

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navLinks.length) {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");

    if (linkPath === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

if (revealItems.length) {
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

const faqItems = document.querySelectorAll("[data-faq]");
faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  button?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0";
  });
});

const form = document.querySelector("[data-contact-form]");
const status = document.querySelector("[data-form-status]");

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    if (!submitButton) return;

    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending message...";
    status.textContent = "Preparing your enquiry for the admissions team.";

    window.setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      status.textContent = "Thank you. HoneyBerry will contact you shortly.";
      form.reset();
    }, 900);
  });
}

const galleryFilters = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");

if (galleryFilters.length && galleryItems.length) {
  galleryFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const selectedCategory = filterButton.dataset.filter || "all";

      galleryFilters.forEach((button) => {
        const isActive = button === filterButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      galleryItems.forEach((item) => {
        const shouldShow = selectedCategory === "all" || item.dataset.category === selectedCategory;
        item.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}
