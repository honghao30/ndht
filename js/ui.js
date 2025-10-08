// 헤더
(() => {
  const header = document.querySelector(".header");
  const popup = document.querySelector(".menu-popup");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const show = () => header.classList.remove("header--hidden");
  const hide = () => header.classList.add("header--hidden");

  header.addEventListener("mouseenter", () => {
    if (popup && popup.classList.contains("active")) return;
    header.classList.add("header--hover");
    show();
  });
  header.addEventListener("mouseleave", () => {
    if (popup && popup.classList.contains("active")) return;
    header.classList.remove("header--hover");
  });
  const onScroll = () => {
    const y = window.scrollY;
    const dy = y - lastY;
    header.classList.toggle("active", y > 100);

    if (y <= 0) {
      show();
      lastY = 0;
      ticking = false;
      return;
    }
    if (!header.classList.contains("header--hover")) {
      if (dy > 5) hide();
      else if (dy < -5) show();
    }

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  show();
})();

// 드롭다운 토글
function toggleDropdown(triggerSelector) {
  const trigger = document.querySelector(triggerSelector);
  const langList = document.querySelector(".lang-list");

  if (!trigger || !langList) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    trigger.classList.toggle("active");
    langList.classList.toggle("active");
  });

  document.addEventListener("click", () => {
    trigger.classList.remove("active");
    langList.classList.remove("active");
  });
}

toggleDropdown(".lang");

// 메인 스와이퍼
function initMainSwiper() {
  new Swiper(".video-swiper", {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    effect: "fade",
    fadeEffect: { crossFade: true },
    pagination: { el: ".swiper-pagination", clickable: true },
  });
}

// 메인 타이틀 애니메이션
function initMainTitle() {
  const overlay = document.querySelector(".overlay");
  if (!overlay) return;

  const titleLines = overlay.querySelectorAll(".main-tit");
  const txtLine = overlay.querySelector(".main-txt");
  const tl = gsap.timeline();
  tl.to(titleLines, {
    backgroundPosition: "0% 0",
    duration: 3,
    ease: "power2.out",
    stagger: 0.2,
  });
  tl.from(txtLine, { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, ">");
}

// 비즈니스 섹션
function initBusinessScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector(".main-business");
  if (!section) return;

  const right = section.querySelector(".right");
  const list = section.querySelector(".business-list");
  if (!list || !right) return;

  const listHeight = list.scrollHeight;
  const rightHeight = right.clientHeight;
  const extraSpace = Math.max(0, rightHeight * 0.3);
  right.style.paddingBottom = `${extraSpace}px`;
  const scrollDistance = listHeight - rightHeight + extraSpace;
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: `+=${scrollDistance}`,
    pin: true,
    scrub: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      gsap.to(list, {
        y: -scrollDistance * self.progress,
        ease: "none",
        overwrite: "auto",
      });
    },
  });
}

// sec02
function initSec02Title() {
  gsap.registerPlugin(ScrollTrigger);

  const sec02 = document.querySelector("#sec02");
  if (!sec02) return;

  const titles = sec02.querySelectorAll(".main-tit");
  titles.forEach((line) => {
    Object.assign(line.style, {
      color: "transparent",
      backgroundImage: "linear-gradient(to right, #000 50%, #C7C7C7 50%)",
      backgroundSize: "200% 100%",
      backgroundPosition: "100% 0",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    });
  });
  const t2 = gsap.timeline({
    scrollTrigger: {
      trigger: sec02,
      start: "top 85%",
      end: "top 35%",
      scrub: true,
    },
  });
  titles.forEach((line, i) => {
    t2.to(
      line,
      {
        backgroundPosition: "0% 0",
        ease: "none",
        duration: 1,
      },
      i * 0.5
    );
  });
}

// 메뉴 팝업
function initMenuPopup() {
  const menuBtn = document.querySelector(".menu");
  const popup = document.querySelector(".menu-popup");
  const headerInner = document.querySelector(".header-inner");
  const headerNav = document.querySelector(".header nav");
  const util = document.querySelector(".util");

  if (!menuBtn || !popup) return;

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isActive = popup.classList.toggle("active");
    menuBtn.classList.toggle("active", isActive);

    if (headerInner) headerInner.classList.toggle("no-hover", isActive);
    if (util) util.classList.toggle("active", isActive);
    if (headerNav) headerNav.style.display = isActive ? "none" : "";

    document.body.style.overflow = isActive ? "hidden" : "";
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("active")) {
      popup.classList.remove("active");
      menuBtn.classList.remove("active");
      if (headerInner) headerInner.classList.remove("no-hover");
      if (util) util.classList.remove("active");
      if (headerNav) headerNav.style.display = "";
      document.body.style.overflow = "";
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initMainSwiper();
  initMainTitle();
  initBusinessScroll();
  initSec02Title();
  initMenuPopup();
});
