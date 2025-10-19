// 헤더
function headerScrollControl() {
  const header = document.querySelector(".header");
  const popup = document.querySelector(".menu-popup");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const show = () => header.classList.remove("header--hidden");
  const hide = () => header.classList.add("header--hidden");

  const bindHoverEvents = () => {
    header.removeEventListener("mouseenter", onEnter);
    header.removeEventListener("mouseleave", onLeave);

    if (window.innerWidth > 768) {
      header.addEventListener("mouseenter", onEnter);
      header.addEventListener("mouseleave", onLeave);
    } else {
      header.classList.remove("header--hover");
    }
  };

  const onEnter = () => {
    if (popup && popup.classList.contains("active")) {
      header.classList.remove("header--hover");
      return;
    }
    header.classList.add("header--hover");
    show();
  };

  const onLeave = () => {
    if (popup && popup.classList.contains("active")) {
      header.classList.remove("header--hover");
      return;
    }
    header.classList.remove("header--hover");
  };

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

  window.addEventListener("resize", bindHoverEvents);

  bindHoverEvents();
  show();

  const observer = new MutationObserver(() => {
    if (popup.classList.contains("active")) {
      header.classList.remove("header--hover");
    }
  });
  observer.observe(popup, { attributes: true, attributeFilter: ["class"] });
}

function allMenuToggle() {
  const menuTitles = document.querySelectorAll(".menu-right .gnb > li > p");
  if (!menuTitles.length) return;

  function bindToggle() {
    menuTitles.forEach((title) => {
      title.addEventListener("click", toggleMenu);
    });
  }

  function unbindToggle() {
    menuTitles.forEach((title) => {
      title.removeEventListener("click", toggleMenu);
    });
  }

  function toggleMenu(e) {
    const parentLi = e.currentTarget.closest("li");
    const subMenu = parentLi.querySelector("ul");

    const isActive = parentLi.classList.contains("active");

    document.querySelectorAll(".menu-right .gnb > li").forEach((li) => {
      li.classList.remove("active");
      li.querySelector("ul")?.classList.remove("active");
    });

    if (!isActive) {
      parentLi.classList.add("active");
      subMenu?.classList.add("active");
    }
  }
  function handleResize() {
    if (window.innerWidth <= 768) {
      bindToggle();
    } else {
      unbindToggle();
      document
        .querySelectorAll(".menu-right .gnb > li")
        .forEach((li) => li.classList.remove("active"));
      document
        .querySelectorAll(".menu-right .gnb ul")
        .forEach((ul) => ul.classList.remove("active"));
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();
}

function autoHeaderHeight() {
  const header = document.querySelector(".header");
  const headerInner = document.querySelector(".header-inner");
  if (!header || !headerInner) return;

  let timer;

  header.addEventListener("mouseenter", () => {
    if (window.innerWidth <= 768) return;

    clearTimeout(timer);
    header.classList.add("header--hover");

    setTimeout(() => {
      const submenus = header.querySelectorAll(".submenu-list");
      let maxHeight = 0;

      submenus.forEach((submenu) => {
        const h = submenu.scrollHeight;
        if (h > maxHeight) maxHeight = h;
      });

      headerInner.style.transition = "height 0.3s ease";
      headerInner.style.height = `${100 + maxHeight}px`;
    }, 50);
  });

  header.addEventListener("mouseleave", () => {
    if (window.innerWidth <= 768) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      header.classList.remove("header--hover");
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

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  if (window.innerWidth <= 960) {
    gsap.set(list, { clearProps: "all" }); // transform 초기화
    right.style.removeProperty("padding-bottom");
    return;
  }

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

window.addEventListener("resize", () => {
  businessScroll();
});

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
  const historySwipers = [];
  let lastIndex = 0;

  const updateThumContPosition = () => {
    if (thumCont) {
      thumCont.style.position = "sticky";
      thumCont.style.top = window.innerWidth <= 768 ? "65px" : "12%";
      thumCont.style.height = window.innerWidth <= 768 ? "60%" : "80%";
      thumCont.style.overflow = "hidden";
    }
  };
  updateThumContPosition();

  window.addEventListener("resize", () => {
    updateThumContPosition();
  });

  function restartCountAnimation() {
    document.querySelectorAll(".count-num").forEach((count) => {
      count.classList.remove("play");
      void count.offsetWidth;
      count.classList.add("play");
    });
  }

  function initSwiper(idx) {
    if (historySwipers[idx]) return;
    const mask = thumItems[idx].querySelector(".his-img-mask");
    const bullet = thumItems[idx].querySelector(".bullet");
    if (!mask) return;
    const swiper = new Swiper(mask, {
      loop: true,
      slidesPerView: 1,
      speed: 600,
      autoplay: { delay: 2500, disableOnInteraction: false },
      pagination: { el: bullet, clickable: true },
      effect: "fade",
      fadeEffect: { crossFade: true },
      observer: true,
      observeParents: true,
    });
    historySwipers[idx] = swiper;
  }

  function activateIndex(idx) {
    if (idx === lastIndex) return;
    lastIndex = idx;

    tabs.forEach((t) => t.classList.remove("active"));
    thumItems.forEach((th) => th.classList.remove("act"));

    tabs[idx]?.classList.add("active");
    thumItems[idx]?.classList.add("act");

    initSwiper(idx);
    historySwipers.forEach((sw, i) => {
      if (!sw) return;
      if (i === idx) {
        sw.update();
        sw.autoplay?.start();
      } else {
        sw.autoplay?.stop();
      }
    });
    restartCountAnimation();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      isScrollingByClick = true;
      activateIndex(i);

      const target = historyItems[i];
      if (target) {
        let offset;

        if (window.innerWidth <= 768 && thumCont) {
          const thumRect = thumCont.getBoundingClientRect();
          offset = thumRect.bottom + 10;
        } else {
          offset = 100;
        }

        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }

      const clear = () => {
        isScrollingByClick = false;
        window.removeEventListener("scrollend", clear);
      };
      window.addEventListener("scrollend", clear, { once: true });
      setTimeout(() => (isScrollingByClick = false), 1200);
    });
  });

  window.addEventListener("scroll", () => {
    if (isScrollingByClick) return;

    let currentIndex = 0;

    if (window.innerWidth <= 768) {
      const thumRect = thumCont?.getBoundingClientRect();
      if (!thumRect) return;
      const triggerY = thumRect.bottom + 10;
      historyItems.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= triggerY) currentIndex = i;
      });
    } else {
      historyItems.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= 0) currentIndex = i;
      });
    }

    activateIndex(currentIndex);
  });

  window.addEventListener("load", () => {
    let currentIndex = 0;
    historyItems.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.5) currentIndex = i;
    });
    activateIndex(currentIndex);
  });
}

// 히스토리 메뉴 스티키 추가
function historyMenuSticky() {
  const menu = document.querySelector(".his-menu");
  const header = document.querySelector(".header");
  if (!menu || !header) return;

  window.addEventListener("scroll", () => {
    const rect = menu.getBoundingClientRect();
    const isSticky = rect.top <= 0;

    menu.classList.toggle("sticky", isSticky);

    if (isSticky) {
      header.classList.add("header--hidden");
    }
  });
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
  headerScrollControl();
  allMenuToggle();
  mainSwiper();
  mainTitle();
  businessScroll();
  sec02Title();
  menuPopup();
  logoSwiper();
  autoHeaderHeight();
  scrollTop();
  historyPage();
  historyMenuSticky();
  componentMachiningTabs();
  capacityTabs();
});
