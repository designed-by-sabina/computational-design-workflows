// ==========================================
// SECTION 07 — PALETTE
// AI Color Consultant
// Frontend consultation flow
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const paletteForm =
        document.getElementById("paletteForm");

    if (!paletteForm) {
        return;
    }


    // ==========================================
    // ELEMENTS
    // ==========================================

    const steps =
        Array.from(
            document.querySelectorAll(
                ".palette-step"
            )
        );

    const progressSteps =
        Array.from(
            document.querySelectorAll(
                ".palette-progress-step"
            )
        );

    const nextButton =
        document.getElementById(
            "paletteNextButton"
        );

    const backButton =
        document.getElementById(
            "paletteBackButton"
        );

    const generateButton =
        document.getElementById(
            "paletteGenerateButton"
        );

    const restartButton =
        document.getElementById(
            "paletteRestartButton"
        );

    const projectOtherInput =
        document.getElementById(
            "paletteProjectOther"
        );

    const colorInput =
        document.getElementById(
            "paletteColorInput"
        );

    const colorPreview =
        document.getElementById(
            "paletteColorPreview"
        );

    const detailsInput =
        document.getElementById(
            "paletteDetails"
        );

    const discoveredColorPanel =
        document.getElementById(
            "paletteDiscoveredColor"
        );

    const websiteThemePanel =
        document.getElementById(
            "paletteWebsiteThemes"
        );

    const formStatus =
        document.getElementById(
            "paletteFormStatus"
        );

    const emptyState =
        document.getElementById(
            "paletteEmptyState"
        );

    const loadingState =
        document.getElementById(
            "paletteLoadingState"
        );

    const generatedResult =
        document.getElementById(
            "paletteGeneratedResult"
        );

    const resultTitle =
        document.getElementById(
            "paletteResultTitle"
        );

    const swatchesContainer =
        document.getElementById(
            "paletteSwatches"
        );

    const inspirationText =
        document.getElementById(
            "paletteInspirationText"
        );

    const applicationText =
        document.getElementById(
            "paletteApplicationText"
        );
        
const rowHeight =
    Math.max(
        isMobile ? 24 : 26,
        squareSize + 4
    );

    // ==========================================
    // STATE
    // ==========================================

    const totalSteps = 4;

    let currentStep = 1;

    const paletteState = {
        project: "",
        sourceType: "",
        discoveredColor: "",
        theme: "",
        moods: [],
        details: ""
    };


    // ==========================================
    // GENERAL HELPERS
    // ==========================================

    function clearSelectedButtons(selector) {

        document
            .querySelectorAll(selector)
            .forEach((button) => {

                button.classList.remove(
                    "is-selected"
                );

                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

            });

    }


    function selectSingleButton(
        button,
        selector
    ) {

        clearSelectedButtons(selector);

        button.classList.add(
            "is-selected"
        );

        button.setAttribute(
            "aria-pressed",
            "true"
        );

    }


    function showStep(stepNumber) {

        currentStep = stepNumber;


        steps.forEach((step) => {

            const stepValue =
                Number(step.dataset.step);

            const isCurrent =
                stepValue === currentStep;

            step.hidden = !isCurrent;

            step.classList.toggle(
                "is-active",
                isCurrent
            );

        });


        progressSteps.forEach(
            (progressStep) => {

                const progressValue =
                    Number(
                        progressStep.dataset
                            .progressStep
                    );

                progressStep.classList.toggle(
                    "is-active",
                    progressValue === currentStep
                );

                progressStep.classList.toggle(
                    "is-complete",
                    progressValue < currentStep
                );

            }
        );


        backButton.hidden =
            currentStep === 1;

        nextButton.hidden =
            currentStep === totalSteps;

        generateButton.hidden =
            currentStep !== totalSteps;


        updateNavigationState();

        formStatus.textContent = "";

    }


    function updateNavigationState() {

        if (currentStep === 1) {

            nextButton.disabled =
                paletteState.project === "";

            return;

        }


        if (currentStep === 2) {

            const hasDiscoveredColor =
                paletteState.sourceType ===
                    "discovered" &&
                paletteState.discoveredColor
                    .trim() !== "";

            const hasWebsiteTheme =
                paletteState.sourceType ===
                    "website" &&
                paletteState.theme !== "";

            nextButton.disabled =
                !hasDiscoveredColor &&
                !hasWebsiteTheme;

            return;

        }


        if (currentStep === 3) {

            nextButton.disabled =
                paletteState.moods.length === 0;

            return;

        }


        if (currentStep === 4) {

            // Question 04 is optional.
            generateButton.disabled = false;

        }

    }


    function normalizeHex(value) {

        const cleanedValue =
            value.trim();

        const shortHexPattern =
            /^#([0-9a-f]{3})$/i;

        const longHexPattern =
            /^#([0-9a-f]{6})$/i;


        if (longHexPattern.test(cleanedValue)) {
            return cleanedValue.toUpperCase();
        }


        const shortMatch =
            cleanedValue.match(
                shortHexPattern
            );


        if (!shortMatch) {
            return null;
        }


        return (
            "#" +
            shortMatch[1]
                .split("")
                .map(
                    (character) =>
                        character +
                        character
                )
                .join("")
                .toUpperCase()
        );

    }


    function updateColorPreview() {

        const validHex =
            normalizeHex(colorInput.value);


        if (validHex) {

            colorPreview.style.background =
                validHex;

            return;

        }


        colorPreview.removeAttribute(
            "style"
        );

    }


    // ==========================================
    // QUESTION 01 — PROJECT
    // ==========================================

    document
        .querySelectorAll(".palette-option")
        .forEach((button) => {

            button.setAttribute(
                "aria-pressed",
                "false"
            );


            button.addEventListener(
                "click",
                () => {

                    selectSingleButton(
                        button,
                        ".palette-option"
                    );

                    paletteState.project =
                        button.dataset.value;

                    projectOtherInput.value =
                        "";

                    updateNavigationState();

                }
            );

        });


    projectOtherInput.addEventListener(
        "input",
        () => {

            clearSelectedButtons(
                ".palette-option"
            );

            paletteState.project =
                projectOtherInput
                    .value
                    .trim();

            updateNavigationState();

        }
    );


    // ==========================================
    // QUESTION 02 — INSPIRATION
    // ==========================================

    document
        .querySelectorAll(
            ".palette-source-card"
        )
        .forEach((button) => {

            button.setAttribute(
                "aria-pressed",
                "false"
            );


            button.addEventListener(
                "click",
                () => {

                    selectSingleButton(
                        button,
                        ".palette-source-card"
                    );

                    paletteState.sourceType =
                        button.dataset.source;


                    if (
                        paletteState.sourceType ===
                        "discovered"
                    ) {

                        discoveredColorPanel.hidden =
                            false;

                        websiteThemePanel.hidden =
                            true;

                        paletteState.theme = "";

                        clearSelectedButtons(
                            ".palette-theme-option"
                        );

                        colorInput.focus();

                    } else {

                        discoveredColorPanel.hidden =
                            true;

                        websiteThemePanel.hidden =
                            false;

                        paletteState.discoveredColor =
                            "";

                        colorInput.value = "";

                        updateColorPreview();

                    }


                    updateNavigationState();

                }
            );

        });


    colorInput.addEventListener(
        "input",
        () => {

            paletteState.discoveredColor =
                colorInput.value.trim();

            updateColorPreview();

            updateNavigationState();

        }
    );


    document
        .querySelectorAll(
            ".palette-theme-option"
        )
        .forEach((button) => {

            button.setAttribute(
                "aria-pressed",
                "false"
            );


            button.addEventListener(
                "click",
                () => {

                    selectSingleButton(
                        button,
                        ".palette-theme-option"
                    );

                    paletteState.theme =
                        button.dataset.theme;

                    updateNavigationState();

                }
            );

        });


    // ==========================================
    // QUESTION 03 — MOOD
    // ==========================================

    document
        .querySelectorAll(
            ".palette-mood-option"
        )
        .forEach((button) => {

            button.setAttribute(
                "aria-pressed",
                "false"
            );


            button.addEventListener(
                "click",
                () => {

                    const selectedMood =
                        button.dataset.mood;

                    const selectedIndex =
                        paletteState.moods
                            .indexOf(selectedMood);


                    if (selectedIndex >= 0) {

                        paletteState.moods.splice(
                            selectedIndex,
                            1
                        );

                        button.classList.remove(
                            "is-selected"
                        );

                        button.setAttribute(
                            "aria-pressed",
                            "false"
                        );

                    } else {

                        if (
                            paletteState.moods
                                .length >= 3
                        ) {

                            formStatus.textContent =
                                "Choose no more than three qualities.";

                            return;

                        }


                        paletteState.moods.push(
                            selectedMood
                        );

                        button.classList.add(
                            "is-selected"
                        );

                        button.setAttribute(
                            "aria-pressed",
                            "true"
                        );

                    }


                    formStatus.textContent = "";

                    updateNavigationState();

                }
            );

        });


    // ==========================================
    // QUESTION 04 — DETAILS
    // ==========================================

    detailsInput.addEventListener(
        "input",
        () => {

            paletteState.details =
                detailsInput.value.trim();

        }
    );


    // ==========================================
    // NAVIGATION
    // ==========================================

    nextButton.addEventListener(
        "click",
        () => {

            if (nextButton.disabled) {
                return;
            }


            if (currentStep < totalSteps) {

                showStep(
                    currentStep + 1
                );

            }

        }
    );


    backButton.addEventListener(
        "click",
        () => {

            if (currentStep > 1) {

                showStep(
                    currentStep - 1
                );

            }

        }
    );


    // ==========================================
    // TEMPORARY SAMPLE PALETTE
    // This will later be replaced by Firebase.
    // ==========================================

    const samplePalette = [
        {
            name: "Ultramarine",
            role: "Primary",
            hex: "#2647A7"
        },
        {
            name: "Madder",
            role: "Accent",
            hex: "#B94B52"
        },
        {
            name: "Weld",
            role: "Highlight",
            hex: "#D8BF58"
        },
        {
            name: "Green Earth",
            role: "Secondary",
            hex: "#78836B"
        },
        {
            name: "Chalk",
            role: "Background",
            hex: "#ECE8DC"
        }
    ];


    function renderPalette(
        palette,
        title,
        inspiration,
        application
    ) {

        resultTitle.textContent =
            title.toUpperCase();

        inspirationText.textContent =
            inspiration;

        applicationText.textContent =
            application;

        swatchesContainer.innerHTML = "";


        palette.forEach((color) => {

            const swatch =
                document.createElement(
                    "article"
                );

            swatch.className =
                "palette-result-swatch";


            const colorArea =
                document.createElement(
                    "div"
                );

            colorArea.className =
                "palette-result-swatch-color";

            colorArea.style.backgroundColor =
                color.hex;


            const information =
                document.createElement(
                    "div"
                );

            information.className =
                "palette-result-swatch-copy";


            const colorName =
                document.createElement("p");

            colorName.className =
                "palette-result-swatch-name";

            colorName.textContent =
                color.name;


            const colorRole =
                document.createElement("p");

            colorRole.className =
                "palette-result-swatch-role";

            colorRole.textContent =
                color.role.toUpperCase();


            const colorHex =
                document.createElement("p");

            colorHex.className =
                "palette-result-swatch-hex";

            colorHex.textContent =
                color.hex.toUpperCase();


            information.append(
                colorName,
                colorRole,
                colorHex
            );

            swatch.append(
                colorArea,
                information
            );

            swatchesContainer.appendChild(
                swatch
            );

        });


        loadingState.hidden = true;

        generatedResult.hidden = false;

    }


    // ==========================================
    // GENERATE
    // ==========================================

    paletteForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            paletteState.details =
                detailsInput.value.trim();


            if (!paletteState.project) {

                showStep(1);

                formStatus.textContent =
                    "Choose or enter a project.";

                return;

            }


            if (!paletteState.sourceType) {

                showStep(2);

                formStatus.textContent =
                    "Choose how the palette should begin.";

                return;

            }


            if (
                paletteState.moods.length === 0
            ) {

                showStep(3);

                formStatus.textContent =
                    "Choose at least one quality.";

                return;

            }


            emptyState.hidden = true;

            generatedResult.hidden = true;

            loadingState.hidden = false;


            const inspiration =
                paletteState.sourceType ===
                "discovered"
                    ? (
                        "The palette begins with " +
                        paletteState.discoveredColor +
                        " and expands it through ideas explored " +
                        "across the website, including pigments, " +
                        "natural dyes, transparency, trends, " +
                        "mixing and color relationships."
                    )
                    : (
                        "The palette is inspired by " +
                        paletteState.theme +
                        " from the COLOR playground."
                    );


            let application =
                "Designed for " +
                paletteState.project +
                " with a " +
                paletteState.moods
                    .join(", ")
                    .toLowerCase() +
                " character.";


            if (paletteState.details) {

                application +=
                    " It also responds to: " +
                    paletteState.details;

            }


            window.setTimeout(
                () => {

                    renderPalette(
                        samplePalette,
                        paletteState.project,
                        inspiration,
                        application
                    );

                },
                700
            );

        }
    );


    // ==========================================
    // RESTART
    // ==========================================

    restartButton.addEventListener(
        "click",
        () => {

            paletteForm.reset();


            paletteState.project = "";
            paletteState.sourceType = "";
            paletteState.discoveredColor = "";
            paletteState.theme = "";
            paletteState.moods = [];
            paletteState.details = "";


            clearSelectedButtons(
                ".palette-option"
            );

            clearSelectedButtons(
                ".palette-source-card"
            );

            clearSelectedButtons(
                ".palette-theme-option"
            );

            clearSelectedButtons(
                ".palette-mood-option"
            );


            discoveredColorPanel.hidden =
                true;

            websiteThemePanel.hidden =
                true;


            updateColorPreview();


            generatedResult.hidden =
                true;

            loadingState.hidden =
                true;

            emptyState.hidden =
                false;


            showStep(1);

        }
    );


    // ==========================================
    // INITIALIZE
    // ==========================================

    showStep(1);

});