/* =========================================================
   DASH BEAUTY — PREMIUM INTERACTIONS
   Hipronia Concept
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       01. ELEMENTS
    ===================================================== */

    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-link");

    const revealElements = document.querySelectorAll(".reveal");

    /*
     * IMPORTANT:
     * We intentionally do NOT select or manipulate <img>
     * elements anywhere in this script.
     */


    /* =====================================================
       02. REDUCED MOTION
    ===================================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       03. HEADER SCROLL EFFECT
    ===================================================== */

    const updateHeader = () => {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =====================================================
       04. MOBILE MENU
    ===================================================== */

    const closeMenu = () => {
        if (!menuToggle || !navLinks) return;

        menuToggle.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
    };


    const openMenu = () => {
        if (!menuToggle || !navLinks) return;

        menuToggle.classList.add("active");
        navLinks.classList.add("open");
        document.body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
    };


    if (menuToggle && navLinks) {

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });
    }


    /* =====================================================
       05. CLOSE MOBILE MENU WHEN LINK IS CLICKED
    ===================================================== */

    navItems.forEach(link => {

        link.addEventListener("click", () => {
            closeMenu();
        });

    });


    /* =====================================================
       06. CLOSE MENU WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener("click", event => {

        if (!navLinks || !menuToggle) return;

        const clickedInsideMenu = navLinks.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (
            navLinks.classList.contains("open") &&
            !clickedInsideMenu &&
            !clickedToggle
        ) {
            closeMenu();
        }

    });


    /* =====================================================
       07. ESCAPE KEY CLOSES MOBILE MENU
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    /* =====================================================
       08. SMOOTH ANCHOR NAVIGATION
    ===================================================== */

    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    anchorLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetID = link.getAttribute("href");

            if (
                !targetID ||
                targetID === "#" ||
                targetID.length < 2
            ) {
                return;
            }

            const target = document.querySelector(targetID);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

            closeMenu();

            /*
             * Update the URL without causing the browser
             * to jump again.
             */
            history.replaceState(
                null,
                "",
                targetID
            );

        });

    });


    /* =====================================================
       09. SCROLL REVEAL
    ===================================================== */

    if (revealElements.length) {

        if (prefersReducedMotion) {

            revealElements.forEach(element => {
                element.classList.add("visible");
            });

        } else {

            const revealObserver = new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;

                        entry.target.classList.add("visible");

                        /*
                         * Once revealed, stop observing it.
                         * This keeps the animation smooth and
                         * prevents unnecessary work.
                         */
                        revealObserver.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -50px 0px"
                }
            );


            revealElements.forEach(element => {
                revealObserver.observe(element);
            });

        }

    }


    /* =====================================================
       10. ACTIVE NAVIGATION
    ===================================================== */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const sectionMap = new Map();

    navItems.forEach(link => {

        const href = link.getAttribute("href");

        if (
            href &&
            href.startsWith("#") &&
            href.length > 1
        ) {
            sectionMap.set(
                href.substring(1),
                link
            );
        }

    });


    if (sections.length && sectionMap.size) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;

                    navItems.forEach(item => {
                        item.classList.remove("active");
                    });

                    const activeLink = sectionMap.get(id);

                    if (activeLink) {
                        activeLink.classList.add("active");
                    }

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );


        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* =====================================================
       11. STAGGERED REVEAL
    ===================================================== */

    const staggerGroups = [
        ".services-list",
        ".gallery-grid",
        ".social-gallery",
        ".about-facts",
        ".booking-options",
        ".contact-details",
        ".faq-list"
    ];

    staggerGroups.forEach(selector => {

        const group = document.querySelector(selector);

        if (!group) return;

        const children = group.querySelectorAll(".reveal");

        children.forEach((child, index) => {

            /*
             * Only add stagger when the element doesn't
             * already have a deliberate CSS transition delay.
             */
            if (index < 8) {
                child.style.transitionDelay =
                    `${index * 80}ms`;
            }

        });

    });


    /* =====================================================
       12. SUBTLE DESKTOP PARALLAX
       ===================================================== */

    /*
     * This does NOT manipulate images.
     *
     * It moves the containing visual section instead.
     *
     * Disabled on:
     * - mobile
     * - reduced motion
     */

    const parallaxSections = document.querySelectorAll(
        ".experience, .editorial-feature"
    );

    const isDesktop = () =>
        window.innerWidth > 900;


    if (
        !prefersReducedMotion &&
        parallaxSections.length &&
        isDesktop()
    ) {

        let ticking = false;

        const updateParallax = () => {

            if (!isDesktop()) {
                parallaxSections.forEach(section => {
                    section.style.transform = "";
                });

                ticking = false;
                return;
            }

            const viewportHeight =
                window.innerHeight;

            parallaxSections.forEach(section => {

                const rect =
                    section.getBoundingClientRect();

                /*
                 * Only calculate when the section is
                 * reasonably close to the viewport.
                 */
                if (
                    rect.bottom < -100 ||
                    rect.top > viewportHeight + 100
                ) {
                    return;
                }

                const progress =
                    (viewportHeight - rect.top) /
                    (viewportHeight + rect.height);

                const offset =
                    (progress - 0.5) * -14;

                section.style.transform =
                    `translate3d(0, ${offset}px, 0)`;

            });

            ticking = false;
        };


        window.addEventListener("scroll", () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateParallax
                );

                ticking = true;
            }

        }, {
            passive: true
        });


        window.addEventListener("resize", () => {

            if (!isDesktop()) {

                parallaxSections.forEach(section => {
                    section.style.transform = "";
                });

            }

        });

    }


    /* =====================================================
       13. PREMIUM HOVER MICRO-INTERACTION
    ===================================================== */

    /*
     * Adds a subtle pointer interaction to larger CTA
     * buttons on desktop.
     *
     * Disabled for touch devices.
     */

    const premiumButtons = document.querySelectorAll(
        ".btn-primary, .btn-dark"
    );

    const hasFinePointer =
        window.matchMedia("(pointer: fine)").matches;


    if (
        hasFinePointer &&
        !prefersReducedMotion
    ) {

        premiumButtons.forEach(button => {

            button.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const moveX =
                        (x / rect.width - 0.5) * 5;

                    const moveY =
                        (y / rect.height - 0.5) * 5;

                    button.style.transform =
                        `translate(${moveX}px, ${moveY}px)`;

                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.transform = "";

                }
            );

        });

    }


    /* =====================================================
       14. FAQ ACCESSIBILITY
    ===================================================== */

    const faqItems = document.querySelectorAll(
        ".faq-item"
    );

    faqItems.forEach(item => {

        const summary =
            item.querySelector("summary");

        if (!summary) return;

        summary.setAttribute(
            "aria-expanded",
            item.open ? "true" : "false"
        );

        item.addEventListener("toggle", () => {

            summary.setAttribute(
                "aria-expanded",
                item.open ? "true" : "false"
            );

        });

    });


    /* =====================================================
       15. MOBILE RESIZE SAFETY
    ===================================================== */

    let previousWidth = window.innerWidth;

    window.addEventListener("resize", () => {

        const currentWidth = window.innerWidth;

        /*
         * If the user rotates/resizes from mobile to
         * desktop, make sure the mobile menu doesn't
         * remain locked open.
         */
        if (
            previousWidth <= 850 &&
            currentWidth > 850
        ) {
            closeMenu();
        }

        previousWidth = currentWidth;

    });


    /* =====================================================
       16. PAGE LOAD STATE
    ===================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );


    /* =====================================================
       17. CONSOLE BRANDING
    ===================================================== */

    console.log(
        "%cDASH BEAUTY",
        "font-family: Georgia, serif; font-size: 22px; font-weight: bold;"
    );

    console.log(
        "%cConcept designed by Hipronia",
        "font-size: 12px;"
    );

});
