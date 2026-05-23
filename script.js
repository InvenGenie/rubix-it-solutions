document.addEventListener("DOMContentLoaded", () => {

  // ===== INTERNAL PAGE SCROLL - FIXED =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (href === "#contactOverlay" || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Get actual navbar height dynamically
      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 80;


      // Responsive offsets per section
      const isMobile = window.innerWidth <= 600;
      let additionalOffset = -20;

      if (href === "#about") {
        additionalOffset = isMobile ? -40 : -53;
      } else if (href === "#services") {
        additionalOffset = isMobile ? -60 : -90;
      } else if (href === "#products") {
        additionalOffset = isMobile ? -10 : 10;
      } else if (href === "#contact") {
        additionalOffset = -20;
      }


      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - additionalOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  });

  // ===== CLEAN NAVBAR SHRINK =====
  const navbar = document.querySelector(".navbar");
  let isShrunk = false;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY > 120 && !isShrunk) {
      navbar.classList.add("scrolled");
      isShrunk = true;
    } else if (scrollY < 40 && isShrunk) {
      navbar.classList.remove("scrolled");
      isShrunk = false;
    }
  });


  // ===== MODAL HANDLING =====
  const overlay = document.getElementById('contactOverlay');
  const closeBtns = document.querySelectorAll('.modal-close, .modal-overlay-close');
  const openBtns = document.querySelectorAll('a[href="#contactOverlay"]');

  let lastScroll = 0;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lastScroll = window.scrollY;
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
      }, 10);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        history.replaceState(null, '', window.location.pathname + window.location.search);
        // scroll to contact section
        const contact = document.querySelector("#contact");
        if (contact) {
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const y = contact.getBoundingClientRect().top + window.scrollY - navbarHeight;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
        // ===== STACKED SERVICES — original working sticky ladder =====
        (() => {
          const nav = document.querySelector('.navbar');
          const boxes = Array.from(document.querySelectorAll('.stacked-services .box'));
          if (!nav || boxes.length === 0) return;

          const NAV_GAP = 20;     // spacing below navbar
          const HEADING_GAP = 0;  // to keep previous heading visible
          const BOX_GAP = 32;     // visual gap between stacked boxes (px)

          function calculateStickyPositions() {
            const navHeight = Math.round(nav.getBoundingClientRect().height) || 0;
            let cumulativeTop = navHeight + NAV_GAP;

            boxes.forEach((box, i) => {

              // ===== LAST BOX: scrolls normally and covers everything =====
              if (i === boxes.length - 1) {
                box.style.position = 'relative';
                box.style.top = 'auto';
                box.style.marginTop = '0';
                box.style.marginBottom = '120px';
                box.style.zIndex = String(100 + i);
                return;
              }

              // ===== FIRST BOX =====
              if (i === 0) {
                box.style.position = 'sticky';
                box.style.top = cumulativeTop + 'px';
                box.style.marginBottom = BOX_GAP + 'px';
                box.style.zIndex = String(100);
              }

              // ===== LATER BOXES =====
              else {
                const prevBox = boxes[i - 1];
                const prevH3 = prevBox.querySelector('h3');

                if (prevH3) {
                  const prevBoxStyle = window.getComputedStyle(prevBox);
                  const prevBoxPaddingTop = parseFloat(prevBoxStyle.paddingTop) || 0;

                  const prevH3Style = window.getComputedStyle(prevH3);
                  const prevH3MarginBottom = parseFloat(prevH3Style.marginBottom) || 0;

                  const prevH3Height = prevH3.getBoundingClientRect().height;

                  // Add previous heading height to cumulativeTop
                  cumulativeTop += prevBoxPaddingTop + prevH3Height + prevH3MarginBottom + HEADING_GAP + BOX_GAP;
                }

                box.style.position = 'sticky';
                box.style.top = cumulativeTop + 'px';
                box.style.marginBottom = BOX_GAP + 'px';
                box.style.zIndex = String(100 + i);
              }
            });
          }

          // ===== RUN CALC =====
          calculateStickyPositions();
          window.addEventListener('load', calculateStickyPositions);
          window.addEventListener('resize', () => {
            clearTimeout(window.__stack_resize_timeout);
            window.__stack_resize_timeout = setTimeout(calculateStickyPositions, 150);
          });

        })();

      }, 300);
    });
  });

  // ===== SCROLL-REVEAL =====
  const revealElements = document.querySelectorAll(".service-box, .card, .box, .hero-content");

  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect().top;
      if (rect < triggerBottom) el.classList.add("visible");
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  const mobileHover = window.matchMedia('(max-width: 1000px)');
  let io = null;
  let hoverTargets = [];

  function initMobileHover() {
    hoverTargets = Array.from(document.querySelectorAll('.service-box, .card, .blog-card, .blog-service'));
    if (!hoverTargets.length) return;
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.6) {
          entry.target.classList.add('hovered');
        } else {
          entry.target.classList.remove('hovered');
        }
      });
    }, { threshold: [0.6] });
    hoverTargets.forEach((el) => io.observe(el));
  }

  if (mobileHover.matches) initMobileHover();

  mobileHover.addEventListener('change', (e) => {
    if (e.matches) {
      initMobileHover();
    } else {
      if (io) io.disconnect();
      io = null;
      document.querySelectorAll('.service-box, .card, .blog-card, .blog-service')
        .forEach((el) => el.classList.remove('hovered'));
    }
  });

  // ===== FINAL TIMELINE (NO INDICATOR, FULLY RESPONSIVE) =====
  const progressLine = document.querySelector(".timeline-line-progress");
  const stackedSection = document.querySelector(".stacked-services");

  if (progressLine && stackedSection) {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {

          const sectionRect = stackedSection.getBoundingClientRect();
          const sectionHeight = stackedSection.offsetHeight;

          const middle = window.innerHeight / 2;
          const scrollInside = middle - sectionRect.top;

          // clamp 0–100%
          let progress = (scrollInside / sectionHeight) * 100;
          progress = Math.min(Math.max(progress, 0), 100);

          const newHeight = (progress / 100) * sectionHeight;
          progressLine.style.height = `${newHeight}px`;

          ticking = false;
        });
        ticking = true;
      }
    });

    // fix height on resize/rotate
    window.addEventListener("resize", () => {
      progressLine.style.height = "0px";
    });
  }

  // ===== BACK TO TOP =====
  const backToTop = document.createElement("button");
  backToTop.textContent = "↑";
  backToTop.className = "back-to-top";
  document.body.appendChild(backToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  let scrollTimer;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      // Zone is live (hoverable)
      backToTop.classList.add("show-zone");

      // Make it visible while scrolling
      backToTop.classList.add("visible");

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        // Hide if not hovering, but keep the "zone" live
        if (!backToTop.matches(':hover')) {
          backToTop.classList.remove("visible");
        }
      }, 500);
    } else {
      backToTop.classList.remove("visible");
      backToTop.classList.remove("show-zone");
      clearTimeout(scrollTimer);
    }
  });

  // Keep visible on hover
  backToTop.addEventListener("mouseenter", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
      clearTimeout(scrollTimer);
    }
  });

  backToTop.addEventListener("mouseleave", () => {
    if (window.scrollY > 400) {
      scrollTimer = setTimeout(() => {
        backToTop.classList.remove("visible");
      }, 500);
    }
  });



  const track = document.getElementById("carouselTrack");

  if (track) {
    const originals = Array.from(track.children);
    const count = originals.length;

    originals.forEach(el => {
      const clone = el.cloneNode(true);
      track.appendChild(clone);
    });

    function measureWidth() {
      let total = 0;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      for (let i = 0; i < count; i++) {
        const el = track.children[i];
        const rect = el.getBoundingClientRect();
        total += rect.width;
        if (i < count - 1) total += gap;
        const mr = parseFloat(window.getComputedStyle(el).marginRight) || 0;
        total += mr;
      }
      return total;
    }

    let contentWidth = 0;
    let x = 0;
    let last = performance.now();
    let paused = false;
    const speed = 150;

    function step(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) x -= speed * dt;
      if (contentWidth > 0 && x <= -contentWidth) x += contentWidth;
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(step);
    }

    function init() {
      contentWidth = measureWidth();
      last = performance.now();
      requestAnimationFrame(step);
    }

    window.addEventListener("load", init);
    window.addEventListener("resize", () => {
      contentWidth = measureWidth();
    });

    track.addEventListener("mouseenter", () => paused = true);
    track.addEventListener("mouseleave", () => paused = false);
  }

  // ===== SUBSCRIBE → OPEN CONTACT FORM WITH EMAIL =====
  const subscribeForm = document.querySelector(".footer-subscribe");
  const emailInput = document.querySelector("#email"); // contact form email field

  if (subscribeForm) {
    subscribeForm.addEventListener("submit", e => {
      e.preventDefault();

      const enteredEmail = subscribeForm.querySelector("input[type='email']").value.trim();
      if (!enteredEmail) return;

      // Open the modal EXACTLY like your normal open buttons
      overlay.style.display = "flex";
      setTimeout(() => {
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
      }, 10);

      // Autofill email
      setTimeout(() => {
        if (emailInput) {
          emailInput.value = enteredEmail;
        }
      }, 150);
    });
  }

  // SIMPLE HAMBURGER + ESC CLOSE + click outside to close
  (() => {
    const ham = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    if (!ham || !mobileMenu) {
      return;
    }

    let scrollPosition = 0;

    const toggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpening = !mobileMenu.classList.contains("active");

      if (isOpening) {
        // Save scroll position
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add("nav-open");
      } else {
        // Restore scroll position
        document.body.classList.remove("nav-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollPosition);
      }

      ham.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    };

    ham.addEventListener("click", toggle);
    ham.addEventListener("touchend", toggle); // For mobile touch devices

    const closeMenu = () => {
      if (!mobileMenu.classList.contains("active")) return;
      document.body.classList.remove("nav-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollPosition);
      ham.classList.remove("active");
      mobileMenu.classList.remove("active");
    };

    // ---------- ROBUST MOBILE LINK HANDLING ----------
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";

        // Ignore placeholder or overlay anchors
        if (href === "#contactOverlay" || href === "#") return;

        // If it's an absolute/external URL (http(s): or mailto: or target blank), let browser handle it
        if (/^(https?:|mailto:|tel:)/.test(href) || link.target === "_blank") {
          // let default behavior happen
          return;
        }

        const isHashOnly = href.startsWith("#");
        const isSamePageHashLink = isHashOnly && (link.pathname === window.location.pathname || href.indexOf(".html") === -1);

        // Close menu first to remove fixed positioning
        const wasOpen = mobileMenu.classList.contains("active");
        if (wasOpen) {
          // Restore scroll position state
          document.body.classList.remove("nav-open");
          document.body.style.top = "";
          ham.classList.remove("active");
          mobileMenu.classList.remove("active");
        }

        // Delay navigation or smooth-scroll so body position resets (matches previous behavior)
        setTimeout(() => {
          // CASE A: pure hash on same page -> smooth-scroll
          if (isHashOnly) {
            // If the hash target exists on this page, smooth scroll to it
            const target = document.querySelector(href);
            if (target) {
              const navbar = document.querySelector('.navbar');
              const navbarHeight = navbar ? navbar.offsetHeight : 80;
              // optional per-section offset adjustments (keep your logic)
              let additionalOffset = 10;
              if (href === "#about" || href === "#services") additionalOffset = -40;
              else if (href === "#products") additionalOffset = 80;
              else if (href === "#contact") additionalOffset = -10;

              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - additionalOffset;
              window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              return;
            }
            // if target not found on this page, fall through to navigate (in case hash belongs to another page)
          }

          // CASE B: link points to other page (e.g. index.html#hero or blog.html)
          // If href contains a path or a filename (.html) or pathname differs, navigate
          if (href.indexOf(".html") !== -1 || href.indexOf("/") !== -1 || link.pathname !== window.location.pathname) {
            // Use full href (preserve query/hash)
            window.location.href = href;
            return;
          }

          // CASE C: fallback - just set location (covers any remaining cases)
          window.location.href = href;
        }, 60);

        // prevent default only when we handled navigation manually (menu was open)
        if (wasOpen) e.preventDefault();
      });
    });


    // Close when clicking outside the menu (on overlay area)
    document.addEventListener("click", (e) => {
      if (!mobileMenu.classList.contains("active")) return;
      if (e.target.closest(".mobile-menu") || e.target.closest(".hamburger")) return;
      closeMenu();
    });

    // Close with ESC
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });
  })();

  // ===== CONTACT FORM SUBMISSION (UNIVERSAL) =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const form = e.target;
      const submitBtn = form.querySelector('button[type="submit"]');

      // Disable button to prevent double-clicking
      submitBtn.disabled = true;

      const data = new FormData(form);

      fetch("https://script.google.com/macros/s/AKfycbwfLM_zARCoviUXj_GpX-mjqIqRuq8DqFs5u2CIAqI9lYNa8WJY1dGbhq4VGz9Q84Q/exec", {
        method: "POST",
        body: data
      })
        .then(res => res.text())
        .then(() => {
          alert("✔ Message sent! Our team will get back to you shortly.");

          // Close modal smoothly
          const overlay = document.getElementById("contactOverlay");
          if (overlay) {
            overlay.classList.add("closing");
            setTimeout(() => {
              overlay.style.display = "none";
              overlay.style.opacity = "0";
              overlay.style.pointerEvents = "none";

              // Re-enable for future use
              submitBtn.disabled = false;

              // Clear URL hash
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }, 300);
          }

          form.reset();
        })
        .catch(err => {
          alert("Something went wrong. Try again.");
          console.error(err);
          submitBtn.disabled = false;
        });
    });
  }

});

const modalContent = document.querySelector(".modal-content");
if (modalContent) {
  window.addEventListener("hashchange", () => {
    if (location.hash === "#contactOverlay") {
      setTimeout(() => {
        modalContent.scrollTop = 0;
      }, 50);
    }
  });
}

// Handle dynamically generated Talk to Us buttons
document.addEventListener("click", function (e) {
  if (e.target.matches('.open-contact, .open-contact *')) {
    const overlay = document.querySelector(".modal-overlay");
    if (overlay) {
      overlay.style.display = "flex";
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
    }
  }
});

// ===== DRAG IMAGE AS WEBSITE LINK (Robust Version) =====
document.addEventListener("dragstart", function (e) {
  const target = e.target.tagName === "IMG" ? e.target : e.target.closest("img");
  if (target) {
    const siteUrl = window.location.href.split('#')[0].split('?')[0];
    e.dataTransfer.setData("text/uri-list", siteUrl);
    e.dataTransfer.setData("text/plain", siteUrl);
    e.dataTransfer.setData("URL", siteUrl);
    e.dataTransfer.setData("text/html", `<a href="${siteUrl}">${siteUrl}</a>`);
  }
});
