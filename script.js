const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".menu");
const backdrop = document.querySelector(".menu-backdrop");
const submenuToggles = document.querySelectorAll(".submenu-toggle");
const scrollTopButton = document.querySelector(".scroll-top");

if (navToggle) {
  const closeMenu = () => {
    body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  backdrop?.addEventListener("click", closeMenu);
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

submenuToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.parentElement.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const slides = [...document.querySelectorAll(".hero-slide")];
const dotsWrap = document.querySelector(".slider-dots");
const prevButton = document.querySelector(".slider-arrow.prev");
const nextButton = document.querySelector(".slider-arrow.next");
let currentSlide = 0;
let slideTimer;
let touchStartX = 0;

function goToSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
  dotsWrap?.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === currentSlide);
    dot.setAttribute("aria-pressed", String(dotIndex === currentSlide));
  });
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function restartSlider() {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(nextSlide, 5000);
}

if (slides.length && dotsWrap) {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${index + 1}. slayt`);
    dot.setAttribute("aria-pressed", "false");
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartSlider();
    });
    dotsWrap.appendChild(dot);
  });

  goToSlide(0);
  restartSlider();
  nextButton?.addEventListener("click", () => {
    nextSlide();
    restartSlider();
  });
  prevButton?.addEventListener("click", () => {
    prevSlide();
    restartSlider();
  });

  const slider = document.querySelector(".hero-slider");
  slider?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  slider?.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 40) nextSlide();
    if (touchEndX > touchStartX + 40) prevSlide();
    restartSlider();
  }, { passive: true });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", () => {
  scrollTopButton?.classList.toggle("visible", window.scrollY > 260);
});

scrollTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("[data-mailto-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const recipient = form.getAttribute("data-recipient") || "info@gokdemirharita.com";
    const title = form.getAttribute("data-subject") || "İletişim Formu";
    const data = new FormData(form);
    const lines = [`Sayfa: ${window.location.href}`];

    data.forEach((value, key) => {
      if (value) {
        const label = form.querySelector(`[name="${key}"]`)?.getAttribute("data-label") || key;
        lines.push(`${label}: ${value}`);
      }
    });

    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
});

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-question");
  button?.setAttribute("aria-expanded", String(item.classList.contains("open")));
  button?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});
