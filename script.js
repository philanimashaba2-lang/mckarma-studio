/* =========================================
   MCKARMA STUDIO
   LOGO ANIMATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const logo = document.querySelector(".logo");

    if (!logo) {
        return;
    }

    let isShort = false;

    setInterval(() => {

        isShort = !isShort;

        logo.classList.toggle("is-short", isShort);

    }, 3000);

});

/* ========================================
   HERO SLIDER
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero .dot");
    const currentSlide = document.getElementById("currentSlide");

    if (!slides.length) return;

    let slideIndex = 0;
    let slideTimer;

    function showSlide(index) {

        slides.forEach((slide) => {
            slide.classList.remove("active");
        });

        dots.forEach((dot) => {
            dot.classList.remove("active");
        });

        slides[index].classList.add("active");

        if (dots[index]) {
            dots[index].classList.add("active");
        }

        if (currentSlide) {
            currentSlide.textContent = String(index + 1).padStart(2, "0");
        }

    }

    function nextSlide() {

        slideIndex++;

        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        showSlide(slideIndex);

    }

    function startSlider() {

        clearInterval(slideTimer);

        slideTimer = setInterval(nextSlide, 5000);

    }

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            slideIndex = index;

            showSlide(slideIndex);

            startSlider();

        });

    });

    const hero = document.querySelector(".hero");

    if (hero) {

        hero.addEventListener("mouseenter", () => {
            clearInterval(slideTimer);
        });

        hero.addEventListener("mouseleave", () => {
            startSlider();
        });

    }

    showSlide(0);
    startSlider();

});


// ========================================
// ENHANCED SCROLL REVEAL
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

});

/* =========================================
   WORK SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const workSlider = document.getElementById("workSlider");
    const workPrev = document.getElementById("workPrev");
    const workNext = document.getElementById("workNext");
    const workProgress = document.getElementById("workProgress");
    const workCards = document.querySelectorAll(".work-card");

    if (!workSlider || !workCards.length) {
        return;
    }

    let workIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragStartPosition = 0;

    function getGap() {

        const styles = window.getComputedStyle(workSlider);

        return parseFloat(styles.gap) || 20;

    }

    function getCardWidth() {

        const card = workCards[0];

        if (!card) {
            return 0;
        }

        return card.offsetWidth + getGap();

    }

    function getVisibleCards() {

        if (window.innerWidth <= 768) {
            return 1;
        }

        if (window.innerWidth <= 1100) {
            return 2;
        }

        return 3;

    }

    function getMaxIndex() {

        const visibleCards = getVisibleCards();

        return Math.max(0, workCards.length - visibleCards);

    }

    function updateProgress() {

        if (!workProgress) {
            return;
        }

        const maxIndex = getMaxIndex();

        if (maxIndex === 0) {

            workProgress.style.width = "100%";

            return;

        }

        const progress = (workIndex / maxIndex) * 100;

        workProgress.style.width = `${Math.max(0, Math.min(progress, 100))}%`;

    }

    function moveWorkSlider(animate = true) {

        const cardWidth = getCardWidth();
        const maxIndex = getMaxIndex();

        workIndex = Math.max(0, Math.min(workIndex, maxIndex));

        if (animate) {
            workSlider.classList.remove("is-dragging");
        } else {
            workSlider.classList.add("is-dragging");
        }

        workSlider.style.transform = `translateX(-${workIndex * cardWidth}px)`;

        updateProgress();

    }

    if (workNext) {

        workNext.addEventListener("click", () => {

            workIndex++;

            moveWorkSlider();

        });

    }

    if (workPrev) {

        workPrev.addEventListener("click", () => {

            workIndex--;

            moveWorkSlider();

        });

    }

    workSlider.addEventListener("pointerdown", (event) => {

        isDragging = true;
        startX = event.clientX;
        currentX = event.clientX;
        dragStartPosition = workIndex * getCardWidth();

        workSlider.classList.add("is-dragging");
        workSlider.setPointerCapture(event.pointerId);

    });

    workSlider.addEventListener("pointermove", (event) => {

        if (!isDragging) {
            return;
        }

        currentX = event.clientX;

        const difference = startX - currentX;

        let newPosition = dragStartPosition + difference;

        const maxPosition = getMaxIndex() * getCardWidth();

        newPosition = Math.max(0, Math.min(newPosition, maxPosition));

        workSlider.style.transform = `translateX(-${newPosition}px)`;

    });

    function finishDrag(event) {

        if (!isDragging) {
            return;
        }

        isDragging = false;

        const difference = startX - currentX;
        const dragThreshold = 60;

        if (difference > dragThreshold) {
            workIndex++;
        } else if (difference < -dragThreshold) {
            workIndex--;
        }

        moveWorkSlider();

        if (event && event.pointerId !== undefined) {

            try {
                workSlider.releasePointerCapture(event.pointerId);
            } catch (error) {
                /* Pointer already released */
            }

        }

    }

    workSlider.addEventListener("pointerup", finishDrag);
    workSlider.addEventListener("pointercancel", finishDrag);

    window.addEventListener("resize", () => {
        moveWorkSlider(false);
    });

    moveWorkSlider(false);

});

/* =========================================
   3D WORK CARD HOVER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const workCards = document.querySelectorAll(".work-card");

    if (!workCards.length) {
        return;
    }

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (isTouchDevice) {
        return;
    }

    const maxRotation = 8;
    const movement = 4;

    workCards.forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const percentX = (x / rect.width) * 2 - 1;
            const percentY = (y / rect.height) * 2 - 1;

            const rotateY = percentX * maxRotation;
            const rotateX = percentY * -maxRotation;

            const moveX = percentX * movement;
            const moveY = percentY * movement;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translate3d(${moveX}px, ${moveY}px, 0)
            `;

        });

        card.addEventListener("mouseenter", () => {
            card.classList.remove("is-resetting");
        });

        card.addEventListener("mouseleave", () => {

            card.classList.add("is-resetting");

            card.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";

            setTimeout(() => {
                card.classList.remove("is-resetting");
            }, 600);

        });

    });

});

/* =========================================
   MAGNETIC BUTTONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const magneticElements = document.querySelectorAll(".magnetic");

    if (!magneticElements.length) {
        return;
    }

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (isTouchDevice) {
        return;
    }

    const strength = 0.25;

    magneticElements.forEach((element) => {

        element.addEventListener("mousemove", (event) => {

            const rect = element.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = event.clientX - centerX;
            const distanceY = event.clientY - centerY;

            const moveX = distanceX * strength;
            const moveY = distanceY * strength;

            element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;

        });

        element.addEventListener("mouseleave", () => {
            element.style.transform = "translate3d(0, 0, 0)";
        });

    });

});

// ========================================
// IMPROVED IMAGE PARALLAX
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const images = document.querySelectorAll(".parallax-image");

    if (!images.length) return;

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (isTouchDevice) return;

    let ticking = false;

    function updateParallax() {

        images.forEach(image => {

            const parent = image.parentElement;

            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;

            const distance = elementCenter - viewportCenter;

            let movement = distance * -0.06;

            movement = Math.max(-35, Math.min(movement, 35));

            image.style.transform = `translate3d(0, ${movement}px, 0)`;

        });

        ticking = false;
    }

    function requestParallaxUpdate() {

        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }

    }

    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);

    updateParallax();

});

/* =========================================
   MOBILE MENU
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuButton = document.getElementById("menuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLinks = document.querySelectorAll(".mobile-menu a");

    if (!menuButton || !mobileMenu) {
        return;
    }

    function toggleMenu() {

        const isOpen = mobileMenu.classList.contains("is-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    }

    function openMenu() {

        mobileMenu.classList.add("is-open");
        menuButton.classList.add("is-open");
        document.body.classList.add("menu-open");

        menuButton.setAttribute("aria-label", "Close menu");

    }

    function closeMenu() {

        mobileMenu.classList.remove("is-open");
        menuButton.classList.remove("is-open");
        document.body.classList.remove("menu-open");

        menuButton.setAttribute("aria-label", "Open menu");

    }

    menuButton.addEventListener("click", toggleMenu);

    mobileLinks.forEach((link) => {

        link.addEventListener("click", () => {
            closeMenu();
        });

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
            closeMenu();
        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {
            closeMenu();
        }

    });

});

// ========================================
// PAGE LOADER
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("pageLoader");

    if (!loader) return;

    window.addEventListener("load", () => {

        setTimeout(() => {
            loader.classList.add("is-loaded");
        }, 1000);

    });

});

// ========================================
// HERO TYPOGRAPHY SEQUENCE
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("pageLoader");

    if (!loader) return;

    window.addEventListener("load", () => {

        setTimeout(() => {

            document.body.classList.add("hero-loaded");

            loader.classList.add("is-loaded");

        }, 1200);

    });

});

// ========================================
// SECTION SCROLL EFFECT
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".reveal-section");

    if (!sections.length) return;

    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (isTouchDevice) return;

    let ticking = false;

    function updateSections() {

        const viewportHeight = window.innerHeight;

        sections.forEach(section => {

            const rect = section.getBoundingClientRect();

            const sectionCenter = rect.top + rect.height / 2;

            const distance = sectionCenter - viewportHeight / 2;

            let movement = distance * -0.008;

            movement = Math.max(-8, Math.min(movement, 8));

            section.style.setProperty("--section-shift", `${movement}px`);

        });

        ticking = false;
    }

    function requestSectionUpdate() {

        if (!ticking) {
            requestAnimationFrame(updateSections);
            ticking = true;
        }

    }

    window.addEventListener("scroll", requestSectionUpdate, { passive: true });
    window.addEventListener("resize", requestSectionUpdate);

    updateSections();

});

// ========================================
// PROJECT CASE STUDY OVERLAY
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("projectOverlay");
    const closeButton = document.getElementById("projectClose");
    const projectImage = document.getElementById("projectImage");
    const projectNumber = document.getElementById("projectNumber");
    const projectCategory = document.getElementById("projectCategory");
    const projectTitle = document.getElementById("projectTitle");
    const projectDescription = document.getElementById("projectDescription");
    const projectServices = document.getElementById("projectServices");
    const projectCards = document.querySelectorAll(".work-card");

    if (!overlay || !closeButton || !projectCards.length) return;

    /* ----------------------------------------
       PROJECT DATA
       Edit this array to update the case-study
       overlay content for each project. Index
       matches the data-project attribute on
       each .work-card in index.html.
    ---------------------------------------- */

    const projects = [

        {
            title: "Fundis",
            category: "Brand Identity",
            image: "ASSETS/images/work-01.jpg",
            description:
                "A visual identity built to give Fundis a distinct presence and communicate its personality through bold, engaging design.",
            services: ["Brand Identity", "Graphic Design", "Art Direction"]
        },

        {
            title: "Openchats Podcast",
            category: "Brand / Campaign",
            image: "ASSETS/images/work-02.jpg",
            description:
                "A visual direction created to give Openchats Podcast a stronger visual presence and a recognisable identity across its content.",
            services: ["Branding", "Campaign Design", "Social Media"]
        },

        {
            title: "Trevor John",
            category: "Visual Identity",
            image: "ASSETS/images/work-03.jpg",
            description:
                "A visual identity designed to communicate strength, professionalism and clarity within the industrial and mining environment.",
            services: ["Visual Identity", "Graphic Design", "Art Direction"]
        },

        {
            title: "Kulcha Sundaze",
            category: "Poster Design / Branding",
            image: "ASSETS/images/work-04.jpg",
            description:
                "A bold visual direction designed to capture the energy of Kulcha Sundaze and translate the experience into a memorable campaign.",
            services: ["Campaign Design", "Poster Design", "Creative Direction"]
        },

        {
            title: "One Drop",
            category: "Campaign / Content",
            image: "ASSETS/images/work-05.jpg",
            description:
                "A campaign-driven visual system created to help One Drop communicate its message through strong, engaging content.",
            services: ["Campaign", "Content", "Creative Direction"]
        },

        {
            title: "MCKARMA",
            category: "Creative Direction",
            image: "ASSETS/images/work-06.jpg",
            description:
                "An ongoing exploration of MCKARMA's own visual language, creative direction and approach to culture, design and storytelling.",
            services: ["Creative Direction", "Brand Strategy", "Design"]
        }

    ];

    function openProject(index) {

        const project = projects[index];

        if (!project) return;

        projectImage.src = project.image;
        projectImage.alt = `${project.title} — MCKARMA Studio`;

        projectNumber.textContent = String(index + 1).padStart(2, "0");
        projectCategory.textContent = project.category;
        projectTitle.textContent = project.title;
        projectDescription.textContent = project.description;

        projectServices.innerHTML = "";

        project.services.forEach(service => {

            const tag = document.createElement("span");

            tag.textContent = service;

            projectServices.appendChild(tag);

        });

        overlay.classList.add("is-open");
        document.body.classList.add("project-open");

    }

    function closeProject() {

        overlay.classList.remove("is-open");
        document.body.classList.remove("project-open");

    }

    projectCards.forEach(card => {

        card.addEventListener("click", () => {

            const index = Number(card.dataset.project);

            openProject(index);

        });

    });

    closeButton.addEventListener("click", closeProject);

    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            closeProject();
        }

    });

    overlay.addEventListener("click", event => {

        if (event.target === overlay) {
            closeProject();
        }

    });

});
