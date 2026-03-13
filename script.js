const prices = {
  basic: "270,000 MMK/yr",
  standard: "450,000 MMK/yr",
  pro: "700,000 MMK/yr",
  business: "1,200,000 MMK/yr",
};

const priceGrid = document.getElementById("priceGrid");
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.textContent = isDark ? "Light" : "Dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
}

const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}

function updatePricing() {
  if (!priceGrid) return;

  [...priceGrid.querySelectorAll("[data-plan]")].forEach((card) => {
    const plan = card.dataset.plan;
    const target = card.querySelector("[data-price]");
    target.textContent = prices[plan];
  });
}

const featureSearch = document.getElementById("featureSearch");
const featureCards = [...document.querySelectorAll(".feature-card")];

if (featureSearch) {
  featureSearch.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();

    featureCards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      const tags = card.dataset.tags.toLowerCase();
      card.style.display = text.includes(query) || tags.includes(query) ? "block" : "none";
    });
  });
}

const faqButtons = [...document.querySelectorAll(".faq-q")];
faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    item.classList.toggle("open", !isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));
  });
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = [...document.querySelectorAll("[data-reveal]")];
if (prefersReducedMotion) {
  revealElements.forEach((el) => el.classList.add("revealed"));
} else {
  revealElements.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 45, 260)}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );
  revealElements.forEach((el) => revealObserver.observe(el));
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("mainNav");
const siteHeader = document.querySelector(".site-header");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function getHeaderOffset() {
  const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
  return headerHeight + 16;
}

function setActiveNavByScroll() {
  const targetLine = window.scrollY + getHeaderOffset() + 8;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.offsetTop <= targetLine) {
      activeSection = section;
    }
  });

  if (!activeSection) return;
  const activeId = `#${activeSection.id}`;
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === activeId);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetSelector = link.getAttribute("href");
    const target = document.querySelector(targetSelector);
    if (!target) return;

    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    if (mainNav && menuToggle) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

let ticking = false;
window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      setActiveNavByScroll();
      ticking = false;
    });
    ticking = true;
  },
  { passive: true }
);
window.addEventListener("resize", setActiveNavByScroll);

updatePricing();
setActiveNavByScroll();
