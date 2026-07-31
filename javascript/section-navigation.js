// ==========================================
// SECTION NAVIGATION
// Reliable click navigation + active states
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeSectionNavigation
);


function initializeSectionNavigation() {

    const navigationDots =
        Array.from(
            document.querySelectorAll(
                ".section-navigation-dot"
            )
        );


    if (navigationDots.length === 0) {

        console.warn(
            "No section navigation dots were found."
        );

        return;

    }


    const sectionEntries =
        navigationDots
            .map(function (dot) {

                const sectionId =
                    dot.dataset.section;


                const section =
                    document.getElementById(
                        sectionId
                    );


                if (!section) {

                    console.warn(
                        `Navigation target not found: #${sectionId}`
                    );

                    /*
                    Hide unmatched dots instead of
                    leaving a broken button visible.
                    */

                    dot.hidden = true;

                    return null;

                }


                return {
                    dot: dot,
                    section: section,
                    id: sectionId
                };

            })
            .filter(function (entry) {

                return entry !== null;

            });


    if (sectionEntries.length === 0) {

        console.warn(
            "No valid navigation sections were found."
        );

        return;

    }


    // ======================================
    // SET ACTIVE DOT
    // ======================================

    function setActiveEntry(activeEntry) {

        sectionEntries.forEach(
            function (entry) {

                const isActive =
                    entry === activeEntry;


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

    }


    // ======================================
    // CLICK NAVIGATION
    // ======================================

    sectionEntries.forEach(
        function (entry) {

            entry.dot.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();


                    /*
                    Set the active state immediately,
                    rather than waiting for scrolling
                    and observer calculations.
                    */

                    setActiveEntry(
                        entry
                    );


                    const sectionTop =

                        entry.section
                            .getBoundingClientRect()
                            .top

                        +

                        window.scrollY;


                    window.scrollTo({
                        top: sectionTop,
                        behavior: "smooth"
                    });

                }
            );

        }
    );


    // ======================================
    // ACTIVE SECTION FROM VIEWPORT CENTER
    // ======================================

    let scrollFrame = null;


    function updateActiveSection() {

        scrollFrame = null;


        const viewportCenter =
            window.innerHeight / 2;


        let closestEntry =
            sectionEntries[0];


        let closestDistance =
            Infinity;


        sectionEntries.forEach(
            function (entry) {

                const rectangle =
                    entry.section
                        .getBoundingClientRect();


                /*
                Prefer a section that actually
                crosses the viewport center.
                */

                if (
                    rectangle.top <= viewportCenter &&
                    rectangle.bottom >= viewportCenter
                ) {

                    closestEntry =
                        entry;


                    closestDistance =
                        0;

                    return;

                }


                /*
                Otherwise choose the section whose
                center is nearest the viewport center.
                */

                const sectionCenter =

                    rectangle.top +

                    rectangle.height / 2;


                const distance =

                    Math.abs(
                        sectionCenter -
                        viewportCenter
                    );


                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;


                    closestEntry =
                        entry;

                }

            }
        );


        setActiveEntry(
            closestEntry
        );

    }


    function requestActiveSectionUpdate() {

        if (scrollFrame !== null) {

            return;

        }


        scrollFrame =
            requestAnimationFrame(
                updateActiveSection
            );

    }


    window.addEventListener(
        "scroll",
        requestActiveSectionUpdate,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        requestActiveSectionUpdate
    );


    /*
    Set the correct initial active dot.
    */

    updateActiveSection();

}