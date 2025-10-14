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

function autoHeaderHeight() {
  const header = document.querySelector(".header");
  const headerInner = document.querySelector(".header-inner");

  if (!header || !headerInner) return;

  let timer;
  header.addEventListener("mouseenter", () => {
    clearTimeout(timer);
    const submenus = header.querySelectorAll(".submenu-list");
    let maxHeight = 0;

    submenus.forEach((submenu) => {
      const h = submenu.scrollHeight;
      if (h > maxHeight) maxHeight = h;
    });
    headerInner.style.transition = "height 0.3s ease";
    headerInner.style.height = `${100 + maxHeight}px`;
  });

  header.addEventListener("mouseleave", () => {
    // transition 중복 방지
    clearTimeout(timer);
    timer = setTimeout(() => {
      headerInner.style.transition = "height 0.3s ease";
      headerInner.style.height = "100px";
    }, 100);
  });
}

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
function mainSwiper() {
  new Swiper(".video-swiper", {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    effect: "fade",
    fadeEffect: { crossFade: true },
    pagination: { el: ".swiper-pagination", clickable: true },
  });
}

// 메인 타이틀 애니메이션
function mainTitle() {
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
function businessScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector(".main-business");
  if (!section) return;

  const right = section.querySelector(".right");
  const list = section.querySelector(".business-list");
  if (!list || !right) return;

  const listHeight = list.scrollHeight;
  const rightHeight = right.clientHeight;
  const extraSpace = Math.max(0, rightHeight * 0.2);
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
function sec02Title() {
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
function menuPopup() {
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

// 로고 슬라이드
function logoSwiper() {
  new Swiper(".logo-slider", {
    slidesPerView: "auto",
    loop: true,
    loopAdditionalSlides: 5,
    allowTouchMove: false,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
  });
}

// Top 버튼
function scrollTop() {
  const topBtn = document.querySelector(".btn-top");
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 히스토리 페이지
function historyPage() {
  const tabs = document.querySelectorAll(".his-tab-box li");
  const thumItems = document.querySelectorAll(".thum-list .thum-item");
  const historyItems = document.querySelectorAll(".history-list .history-item");
  const thumCont = document.querySelector(".thum-cont");

  if (!tabs.length || !thumItems.length || !historyItems.length) return;

  let isScrollingByClick = false;
  let lastScrollY = window.scrollY;
  const historySwipers = [];

  function initSwiperFor(idx) {
    if (historySwipers[idx]) return;

    const mask = thumItems[idx].querySelector(".his-img-mask");
    const bullet = thumItems[idx].querySelector(".bullet");

    if (mask) {
      const swiper = new Swiper(mask, {
        loop: true,
        slidesPerView: 1,
        speed: 600,
        autoplay: { delay: 2500, disableOnInteraction: false },
        pagination: { el: bullet, clickable: true },
        effect: "fade",
        fadeEffect: { crossFade: true },
      });
      historySwipers[idx] = swiper;
    }
  }

  function refreshSwiper(swiper) {
    if (!swiper) return;
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateAutoHeight?.();
    swiper.update();
  }

  function activateSwiper(index) {
    historySwipers.forEach((sw, i) => {
      if (!sw) return;
      if (i === index) {
        refreshSwiper(sw);
        sw.autoplay?.start();
      } else {
        sw.autoplay?.stop();
      }
    });
  }

  function restartCountAnimation() {
    const countNums = document.querySelectorAll(".count-num");
    countNums.forEach((count) => {
      count.classList.remove("play");
      void count.offsetWidth;
      count.classList.add("play");
    });
  }

  if (thumCont) {
    thumCont.style.position = "sticky";
    thumCont.style.top = "180px";
    thumCont.style.height = "800px";
    thumCont.style.overflow = "hidden";
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      isScrollingByClick = true;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      thumItems.forEach((thum, idx) => {
        thum.classList.toggle("act", idx === i);
      });

      initSwiperFor(i);
      activateSwiper(i);
      restartCountAnimation();

      const target = historyItems[i];
      if (target) {
        const offset = 120;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }

      setTimeout(() => (isScrollingByClick = false), 1200);
    });
  });

  // 스크롤 감지
  const observer = new IntersectionObserver(
    (entries) => {
      const scrollingDown = window.scrollY > lastScrollY;
      lastScrollY = window.scrollY;

      if (isScrollingByClick) return;

      entries.forEach((entry) => {
        const idx = Array.from(historyItems).indexOf(entry.target);

        if (
          (scrollingDown && entry.isIntersecting) ||
          (!scrollingDown && entry.boundingClientRect.top > 0)
        ) {
          tabs.forEach((t) => t.classList.remove("active"));
          tabs[idx]?.classList.add("active");

          thumItems.forEach((thum, j) => {
            thum.classList.toggle("act", j === idx);
          });

          initSwiperFor(idx);
          activateSwiper(idx);
          restartCountAnimation();
        }
      });
    },
    { threshold: 0.3 }
  );

  historyItems.forEach((item) => observer.observe(item));

  initSwiperFor(0);
  activateSwiper(0);

  tabs.forEach((t) => t.classList.remove("active"));
  tabs[0]?.classList.add("active");

  thumItems.forEach((thum, j) => {
    thum.classList.toggle("act", j === 0);
  });

  restartCountAnimation();

  setTimeout(() => {
    historyItems.forEach((item) => observer.observe(item));
  }, 400);
}

// component_machining
function componentMachiningTabs() {
  const tabButtons = document.querySelectorAll(
    ".component-machining-tab-box li"
  );
  const tabContents = document.querySelectorAll(".tab-cont");

  if (!tabButtons.length || !tabContents.length) return;

  tabButtons.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      tabContents.forEach((content, i) => {
        content.classList.toggle("active", i === index);
      });
    });
  });
}

// capacity
function capacityTabs() {
  const tabs = document.querySelectorAll(".capacity-tab-box li");
  const contents = document.querySelectorAll(".capacity-cont");

  if (!tabs.length || !contents.length) return;

  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      contents.forEach((cont) => cont.classList.remove("active"));
      contents[idx].classList.add("active");
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  mainSwiper();
  mainTitle();
  businessScroll();
  sec02Title();
  menuPopup();
  logoSwiper();
  autoHeaderHeight();
  scrollTop();
  historyPage();
  componentMachiningTabs();
  capacityTabs();
});
