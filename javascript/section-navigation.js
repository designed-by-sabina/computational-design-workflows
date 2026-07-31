// ==========================================
// SECTION NAVIGATION
// Scroll-to-section dots + active state
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeSectionNavigation
);


function initializeSectionNavigation() {

    const navigationDots =
        document.querySelectorAll(
            ".section-navigation-dot"
        );


    if (navigationDots.length === 0) {
        return;
    }


    const sectionEntries = [];


    navigationDots.forEach(function (dot) {

        const sectionId =
            dot.dataset.section;


        const section =
            document.getElementById(
                sectionId
            );


        if (!section) {

            console.warn(
                `Navigation section not found: #${sectionId}`
            );

            return;

        }


        sectionEntries.push({
            dot: dot,
            section: section
        });


        dot.addEventListener(
            "click",
            function () {

                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    if (sectionEntries.length === 0) {
        return;
    }


    // ======================================
    // ACTIVE SECTION OBSERVER
    // ======================================

    const observer =
        new IntersectionObserver(
            function (entries) {

                const visibleEntries =
                    entries
                        .filter(function (entry) {
                            return entry.isIntersecting;
                        })
                        .sort(function (a, b) {
                            return (
                                b.intersectionRatio -
                                a.intersectionRatio
                            );
                        });


                if (visibleEntries.length === 0) {
                    return;
                }


                const activeSection =
                    visibleEntries[0].target;


                sectionEntries.forEach(
                    function (entry) {

                        const isActive =
                            entry.section ===
                            activeSection;


                        entry.dot.classList.toggle(
                            "active",
                            isActive
                        );


                        if (isActive) {

                            entry.dot.setAttribute(
                                "aria-current",
                                "true"
                            );

                        } else {

                            entry.dot.removeAttribute(
                                "aria-current"
                            );

                        }

                    }
                );

            },
            {
                /*
                The center portion of the viewport
                determines the active section.
                */

                root: null,

                rootMargin:
                    "-35% 0px -35% 0px",

                threshold: [
                    0,
                    0.1,
                    0.25,
                    0.5,
                    0.75
                ]
            }
        );


    sectionEntries.forEach(
        function (entry) {

            observer.observe(
                entry.section
            );

        }
    );

}