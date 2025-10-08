// 메인 스와이퍼
const mainSwiper = new Swiper(".video-swiper", {
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  effect: "fade",
  fadeEffect: { crossFade: true },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// 메인 타이틀
window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay");

  const titleLines = overlay.querySelectorAll(".main-tit");
  const txtLine = overlay.querySelector(".main-txt");

  const tl = gsap.timeline();

  tl.to(titleLines, {
    backgroundPosition: "0% 0",
    duration: 3,
    ease: "power2.out",
    stagger: 0.2,
  });

  tl.from(
    txtLine,
    {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    },
    ">"
  );
});

// 비지니스
window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const businessSection = document.querySelector(".main-business");
  const right = businessSection.querySelector(".right");
  const list = businessSection.querySelector(".business-list");

  if (!list || !right || !businessSection) return;

  const listHeight = list.scrollHeight;
  const rightHeight = right.clientHeight;
  const extraSpace = Math.max(0, rightHeight * 0.3);
  right.style.paddingBottom = `${extraSpace}px`;

  const scrollDistance = listHeight - rightHeight + extraSpace;

  ScrollTrigger.create({
    trigger: businessSection,
    start: "top top",
    end: () => `+=${scrollDistance}`,
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
});

// sec02
window.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const sec02 = document.querySelector("#sec02");
  if (!sec02) return;

  const titles = sec02.querySelectorAll(".main-tit");

  titles.forEach((line) => {
    line.style.color = "transparent";
    line.style.backgroundImage =
      "linear-gradient(to right, #000 50%, #C7C7C7 50%)";
    line.style.backgroundSize = "200% 100%";
    line.style.backgroundPosition = "100% 0";
    line.style.webkitBackgroundClip = "text";
    line.style.backgroundClip = "text";
  });

  const t2 = gsap.timeline({
    scrollTrigger: {
      trigger: sec02,
      start: "top 85%",
      end: "top 35%",
      scrub: true,
      // markers: true,
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
});
