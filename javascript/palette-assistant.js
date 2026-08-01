// ==========================================
// SECTION 07 — PALETTE
// Frontend question flow
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const paletteForm =
        document.getElementById("paletteForm");

    if (!paletteForm) {
        return;
    }


    // ------------------------------------------
    // DOM ELEMENTS
    // ------------------------------------------

    const steps =
        Array.from(
            document.querySelectorAll(".palette-step")
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


    // ------------------------------------------
    // STATE
    // ------------------------------------------

    let currentStep = 1;

    const paletteState = {
        project: "",
        sourceType: "",
        discoveredColor: "",
        theme: "",
        moods: [],
        details: ""
    };


    // ------------------------------------------
    // HELPERS
    // ------------------------------------------

    function clearSelectedButtons(selector) {

        document
            .querySelectorAll(selector)
            .forEach((button) => {

                button.classList.remove(
                    "is-selected"
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

    }


    function showStep(stepNumber) {

        currentStep = stepNumber;

        steps.forEach((step) => {

            const stepValue =
                Number(step.dataset.step);

            const isCurrent =
                stepValue === stepNumber;

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
                    progressValue === stepNumber
                );

                progressStep.classList.toggle(
                    "is-complete",
                    progressValue < stepNumber
                );

            }
        );


        backButton.hidden =
            stepNumber === 1;

        nextButton.hidden =
            stepNumber === 3;

        generateButton.hidden =
            stepNumber !== 3;

        updateNavigationState();

        formStatus.textContent = "";

    }


    function updateNavigationState() {

        if (currentStep === 1) {

            nextButton.disabled =
                !paletteState.project;

        }


        if (currentStep === 2) {

            const discoveredIsValid =
                paletteState.sourceType ===
                    "discovered" &&
                paletteState.discoveredColor
                    .trim() !== "";

            const themeIsValid =
                paletteState.sourceType ===
                    "website" &&
                paletteState.theme !== "";

            nextButton.disabled =
                !discoveredIsValid &&
                !themeIsValid;

        }


        if (currentStep === 3) {

            generateButton.disabled =
                paletteState.moods.length === 0;

        }

    }


    function normalizeHex(value) {

        const trimmedValue =
            value.trim();

        const shortHexPattern =
            /^#([0-9a-f]{3})$/i;

        const longHexPattern =
            /^#([0-9a-f]{6})$/i;


        if (longHexPattern.test(trimmedValue)) {
            return trimmedValue;
        }


        const shortMatch =
            trimmedValue.match(
                shortHexPattern
            );


        if (shortMatch) {

            const characters =
                shortMatch[1].split("");

            return (
                "#" +
                characters
                    .map(
                        (character) =>
                            character +
                            character
                    )
                    .join("")
            );

        }


        return null;

    }


    function updateColorPreview() {

        const validHex =
            normalizeHex(colorInput.value);

        if (validHex) {

            colorPreview.style.background =
                validHex;

        } else {

            colorPreview.removeAttribute(
                "style"
            );

        }

    }


    // ------------------------------------------
    // QUESTION 01 — PROJECT
    // ------------------------------------------

    document
        .querySelectorAll(".palette-option")
        .forEach((button) => {

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
                projectOtherInput.value.trim();

            updateNavigationState();

        }
    );


    // ------------------------------------------
    // QUESTION 02 — INSPIRATION SOURCE
    // ------------------------------------------

    document
        .querySelectorAll(
            ".palette-source-card"
        )
        .forEach((button) => {

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

                        paletteState.theme =
                            "";

                        clearSelectedButtons(
                            ".palette-theme-option"
                        );

                        colorInput.focus();

                    } else {

                        discoveredColorPanel.hidden =
                            true;

                        websiteThemePanel.hidden =
                            false;

                        paletteState
                            .discoveredColor = "";

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


    // ------------------------------------------
    // QUESTION 03 — MOOD
    // ------------------------------------------

    document
        .querySelectorAll(
            ".palette-mood-option"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const mood =
                        button.dataset.mood;

                    const existingIndex =
                        paletteState.moods
                            .indexOf(mood);


                    if (existingIndex >= 0) {

                        paletteState.moods.splice(
                            existingIndex,
                            1
                        );

                        button.classList.remove(
                            "is-selected"
                        );

                    } else {

                        if (
                            paletteState.moods
                                .length >= 3
                        ) {

                            formStatus.textContent =
                                "Select no more than three moods.";

                            return;

                        }

                        paletteState.moods.push(
                            mood
                        );

                        button.classList.add(
                            "is-selected"
                        );

                    }

                    formStatus.textContent =
                        "";

                    updateNavigationState();

                }
            );

        });


    detailsInput.addEventListener(
        "input",
        () => {

            paletteState.details =
                detailsInput.value.trim();

        }
    );


    // ------------------------------------------
    // NAVIGATION
    // ------------------------------------------

    nextButton.addEventListener(
        "click",
        () => {

            if (
                currentStep < 3 &&
                !nextButton.disabled
            ) {

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


    // ------------------------------------------
    // TEMPORARY SAMPLE GENERATOR
    // Replace with Firebase/OpenAI later
    // ------------------------------------------

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


            const copy =
                document.createElement(
                    "div"
                );

            copy.className =
                "palette-result-swatch-copy";


            const name =
                document.createElement("p");

            name.className =
                "palette-result-swatch-name";

            name.textContent =
                color.name;


            const role =
                document.createElement("p");

            role.className =
                "palette-result-swatch-role";

            role.textContent =
                color.role.toUpperCase();


            const hex =
                document.createElement("p");

            hex.className =
                "palette-result-swatch-hex";

            hex.textContent =
                color.hex.toUpperCase();


            copy.append(
                name,
                role,
                hex
            );

            swatch.append(
                colorArea,
                copy
            );

            swatchesContainer.appendChild(
                swatch
            );

        });


        loadingState.hidden = true;

        generatedResult.hidden = false;

    }


    paletteForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            if (
                paletteState.moods.length === 0
            ) {

                formStatus.textContent =
                    "Select at least one mood.";

                return;

            }


            paletteState.details =
                detailsInput.value.trim();


            emptyState.hidden = true;

            generatedResult.hidden = true;

            loadingState.hidden = false;


            const inspiration =
                paletteState.sourceType ===
                "discovered"
                    ? (
                        "Built around " +
                        paletteState
                            .discoveredColor +
                        ", then expanded through " +
                        "historical pigments, natural dyes, " +
                        "transparency, and color relationships."
                    )
                    : (
                        "Inspired by " +
                        paletteState.theme +
                        " from the COLOR playground."
                    );


            const application =
                "Designed for " +
                paletteState.project +
                " with a " +
                paletteState.moods.join(
                    ", "
                ).toLowerCase() +
                " atmosphere." +
                (
                    paletteState.details
                        ? (
                            " Additional context: " +
                            paletteState.details
                        )
                        : ""
                );


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


    // ------------------------------------------
    // RESTART
    // ------------------------------------------

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


    // ------------------------------------------
    // INITIALIZE
    // ------------------------------------------

    showStep(1);

});