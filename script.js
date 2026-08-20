document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       PAGE READY
    ================================= */

    requestAnimationFrame(() => {
        document.body.classList.add("page-loaded");
    });


    /* ================================
       HEADER SCROLL EFFECT
    ================================= */

    const header = document.querySelector(".site-header");

    const updateHeader = () => {
        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* ================================
       MOBILE MENU
    ================================= */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        const closeMenu = () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.style.overflow = "";
        };

        menuToggle.addEventListener("click", () => {

            const isOpen =
                navLinks.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                navLinks.classList.add("active");
                menuToggle.classList.add("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

                document.body.style.overflow = "hidden";
            }

        });


        /* Close menu after clicking a link */

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });


        /* Close with Escape */

        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                navLinks.classList.contains("active")
            ) {
                closeMenu();
            }

        });


        /* Reset menu when returning to desktop */

        window.addEventListener("resize", () => {

            if (window.innerWidth > 800) {
                closeMenu();
            }

        });

    }


    /* ================================
       SMOOTH SECTION SCROLLING
    ================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const id =
                    link.getAttribute("href");

                if (
                    !id ||
                    id === "#" ||
                    id.length < 2
                ) {
                    return;
                }

                const target =
                    document.querySelector(id);

                if (!target) return;

                event.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const position =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    10;

                window.scrollTo({
                    top: position,
                    behavior: "smooth"
                });

            });

        });


    /* ================================
       SCROLL REVEAL
    ================================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* ================================
       STAGGERED CARDS
    ================================= */

    const staggerContainers = [
        ".values-grid",
        ".services-list",
        ".gallery-grid",
        ".reviews-grid",
        ".instagram-grid"
    ];

    staggerContainers.forEach(selector => {

        const container =
            document.querySelector(selector);

        if (!container) return;

        Array.from(container.children)
            .forEach((item, index) => {

                if (!item.classList.contains("reveal")) {
                    item.classList.add("reveal");
                }

                item.style.transitionDelay =
                    `${Math.min(index * 70, 350)}ms`;

            });

    });


    /* ================================
       ACTIVE NAVIGATION
    ================================= */

    const navAnchors =
        document.querySelectorAll(
            '.nav-links a[href^="#"]'
        );

    const sections = [];

    navAnchors.forEach(link => {

        const id =
            link.getAttribute("href");

        if (!id || id === "#") return;

        const section =
            document.querySelector(id);

        if (!section) return;

        sections.push({
            section,
            link
        });

    });


    if (
        sections.length &&
        "IntersectionObserver" in window
    ) {

        const navObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        navAnchors.forEach(link => {
                            link.classList.remove(
                                "active"
                            );
                        });

                        const current =
                            sections.find(
                                item =>
                                    item.section ===
                                    entry.target
                            );

                        if (current) {
                            current.link.classList.add(
                                "active"
                            );
                        }

                    });

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px",
                    threshold: 0
                }
            );

        sections.forEach(({ section }) => {
            navObserver.observe(section);
        });

    }


    /* ================================
       LIGHT DESKTOP PARALLAX
       
       IMPORTANT:
       This does NOT modify images.
       It only moves their container.
    ================================= */

    const parallaxElements =
        document.querySelectorAll(
            ".hero-image-main, .image-break-image"
        );

    let parallaxFrame = null;

    const updateParallax = () => {

        parallaxFrame = null;

        if (window.innerWidth < 900) {

            parallaxElements.forEach(element => {
                element.style.transform = "";
            });

            return;
        }

        parallaxElements.forEach(element => {

            const rect =
                element.getBoundingClientRect();

            const viewport =
                window.innerHeight;

            if (
                rect.bottom < 0 ||
                rect.top > viewport
            ) {
                return;
            }

            const progress =
                (viewport - rect.top) /
                (viewport + rect.height);

            const movement =
                (progress - 0.5) * 14;

            element.style.transform =
                `translate3d(0, ${movement}px, 0)`;

        });

    };

    window.addEventListener("scroll", () => {

        if (parallaxFrame === null) {

            parallaxFrame =
                requestAnimationFrame(
                    updateParallax
                );

        }

    }, {
        passive: true
    });

    window.addEventListener(
        "resize",
        updateParallax
    );


    /* ================================
       BUTTON PRESS MICRO-INTERACTION
    ================================= */

    document
        .querySelectorAll(".button, .nav-cta")
        .forEach(button => {

            button.addEventListener(
                "pointerdown",
                () => {
                    button.classList.add(
                        "button-pressed"
                    );
                }
            );

            button.addEventListener(
                "pointerup",
                () => {
                    button.classList.remove(
                        "button-pressed"
                    );
                }
            );

            button.addEventListener(
                "pointercancel",
                () => {
                    button.classList.remove(
                        "button-pressed"
                    );
                }
            );

            button.addEventListener(
                "pointerleave",
                () => {
                    button.classList.remove(
                        "button-pressed"
                    );
                }
            );

        });


    /* ================================
       AUTOMATIC FOOTER YEAR
    ================================= */

    document
        .querySelectorAll("[data-year]")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });


    /* ================================
       INITIALIZE
    ================================= */

    updateParallax();


    /* ================================
       ACCESSIBILITY
    ================================= */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        document.documentElement.style
            .scrollBehavior = "auto";

    }

});