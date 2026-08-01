// ==========================================
// SECTION 07 — PALETTE
// AI Color Consultant
// Frontend consultation flow + OpenAI calls
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

    const discoveredColorPanel =
        document.getElementById(
            "paletteDiscoveredColor"
        );

    const websiteThemePanel =
        document.getElementById(
            "paletteWebsiteThemes"
        );

    const followUpLoading =
        document.getElementById(
            "paletteFollowUpLoading"
        );

    const followUpContainer =
        document.getElementById(
            "paletteFollowUpContainer"
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
        followUpQuestions: [],
        followUpAnswers: []
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

            // Follow-up answers are optional.
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
    // OPENAI HELPER
    // Shared by both AI calls below.
    // ==========================================

    async function callOpenAI(messages) {

        const response =
            await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        "Authorization":
                            `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        response_format: {
                            type: "json_object"
                        },
                        messages
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                `OpenAI request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        return data.choices[0].message.content;

    }


    // ==========================================
    // QUESTION 04 — AI-GENERATED FOLLOW-UP
    // Runs when moving from step 3 to step 4.
    // ==========================================

    function buildInspirationSummary() {

        return (
            paletteState.sourceType ===
            "discovered"
                ? `a discovered color described as "${paletteState.discoveredColor}"`
                : `inspiration from: ${paletteState.theme}`
        );

    }


    async function loadFollowUpQuestions() {

        followUpLoading.hidden = false;

        followUpContainer.innerHTML = "";

        generateButton.disabled = true;


        const prompt = `
Project type: ${paletteState.project}
Inspiration: ${buildInspirationSummary()}
Desired mood/qualities: ${paletteState.moods.join(", ")}

Generate 2 to 3 short, specific follow-up questions to ask next, tailored to this exact project type and context. The goal is to gather any missing details needed before creating a 5-color palette (for example: materials, lighting, season, audience, existing colors, print vs digital — whichever are actually relevant to this project type). Keep each question under 12 words.
        `.trim();


        try {

            const raw =
                await callOpenAI([
                    {
                        role: "system",
                        content:
                            'You are a color and design consultant. Respond only with valid JSON in the form {"questions": ["...", "..."]}. Ask exactly 2 or 3 short, specific questions. No markdown, no extra text, JSON only.'
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]);


            const parsed =
                JSON.parse(raw);

            const questions =
                Array.isArray(parsed.questions)
                    ? parsed.questions.slice(0, 3)
                    : [];


            paletteState.followUpQuestions =
                questions;

            paletteState.followUpAnswers =
                new Array(
                    questions.length
                ).fill("");


            renderFollowUpQuestions(
                questions
            );

        } catch (error) {

            console.error(
                "Could not generate follow-up questions:",
                error
            );

            paletteState.followUpQuestions = [];

            paletteState.followUpAnswers = [];

            followUpContainer.innerHTML = `
                <p class="palette-input-note">
                    Could not generate extra questions right now —
                    you can continue without them.
                </p>
            `;

        }


        followUpLoading.hidden = true;

        generateButton.disabled = false;

    }


    function renderFollowUpQuestions(questions) {

        followUpContainer.innerHTML = "";


        questions.forEach(
            (questionText, index) => {

                const wrapper =
                    document.createElement(
                        "div"
                    );

                wrapper.className =
                    "palette-follow-up-question";


                const label =
                    document.createElement(
                        "label"
                    );

                label.className =
                    "palette-text-label";

                label.setAttribute(
                    "for",
                    `paletteFollowUp${index}`
                );

                label.textContent =
                    questionText;


                const input =
                    document.createElement(
                        "input"
                    );

                input.className =
                    "palette-text-input";

                input.type = "text";

                input.id =
                    `paletteFollowUp${index}`;

                input.autocomplete = "off";


                input.addEventListener(
                    "input",
                    () => {

                        paletteState.followUpAnswers[
                            index
                        ] = input.value.trim();

                    }
                );


                wrapper.append(
                    label,
                    input
                );

                followUpContainer.appendChild(
                    wrapper
                );

            }
        );

    }


    // ==========================================
    // NAVIGATION
    // ==========================================

    nextButton.addEventListener(
        "click",
        async () => {

            if (nextButton.disabled) {
                return;
            }


            if (currentStep === 3) {

                showStep(4);

                await loadFollowUpQuestions();

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
    // RENDER RESULT
    // ==========================================

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
    // GENERATE — real OpenAI call
    // ==========================================

    paletteForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


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


            const followUpSummary =
                paletteState.followUpQuestions
                    .map(
                        (question, index) =>
                            `${question} — ${
                                paletteState
                                    .followUpAnswers[
                                        index
                                    ] ||
                                "(no answer given)"
                            }`
                    )
                    .join("\n");


            const prompt = `
Project type: ${paletteState.project}
Inspiration: ${buildInspirationSummary()}
Desired mood/qualities: ${paletteState.moods.join(", ")}
Additional context:
${followUpSummary || "None provided."}

Create a 5-color palette for this project. Draw inspiration from historical pigments, natural dyes, color relationships, transparency, and color trends where relevant.
            `.trim();


            try {

                const raw =
                    await callOpenAI([
                        {
                            role: "system",
                            content:
                                'You are an expert color consultant creating a 5-color palette for a design project. Respond only with valid JSON in this exact form: {"paletteName": "...", "inspiration": "...", "application": "...", "colors": [{"name": "...", "role": "...", "hex": "#RRGGBB"}]}. Always return exactly 5 colors with valid 6-digit hex codes. No markdown, no code fences, JSON only.'
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ]);


                const parsed =
                    JSON.parse(raw);


                renderPalette(
                    parsed.colors,
                    parsed.paletteName ||
                        paletteState.project,
                    parsed.inspiration || "",
                    parsed.application || ""
                );

            } catch (error) {

                console.error(
                    "Could not generate palette:",
                    error
                );

                loadingState.hidden = true;

                emptyState.hidden = false;

                formStatus.textContent =
                    "Something went wrong generating your palette — please try again.";

            }

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
            paletteState.followUpQuestions = [];
            paletteState.followUpAnswers = [];


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


            followUpContainer.innerHTML = "";

            followUpLoading.hidden = false;


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


