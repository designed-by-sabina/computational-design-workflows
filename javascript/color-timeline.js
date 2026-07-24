// ==========================================
// COLOR FORECAST TIMELINE
// Pantone, Benjamin Moore,
// Sherwin-Williams, Coloro × WGSN, Vogue
// ==========================================


// ==========================================
// SETTINGS
// ==========================================

const COLOR_TIMELINE_DATA_PATH =
    "data/color-timeline.csv";


const COLOR_TIMELINE_START_YEAR = 2000;
const COLOR_TIMELINE_END_YEAR = 2026;


const COLOR_TIMELINE_SOURCES = [
    "Pantone",
    "Benjamin Moore",
    "Sherwin-Williams",
    "Coloro × WGSN",
    "Vogue"
];


// ==========================================
// GLOBAL VARIABLES
// ==========================================

let colorTimelineData = [];

let activeTimelineEntry = null;

let colorTimelineResizeTimer = null;


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeColorTimeline
);


async function initializeColorTimeline() {

    const timelineContainer =
        document.querySelector(
            "#color-timeline"
        );


    if (!timelineContainer) {

        console.error(
            "Missing HTML element: #color-timeline"
        );

        return;

    }


    if (typeof d3 === "undefined") {

        console.error(
            "D3 is not loaded. Load D3 before color-timeline.js."
        );


        timelineContainer.innerHTML = `
            <p class="timeline-error-message">
                D3 could not be loaded.
            </p>
        `;

        return;

    }


    ensureComparisonPanelElements();


    try {

        colorTimelineData =
            await d3.csv(
                COLOR_TIMELINE_DATA_PATH,
                parseColorTimelineRow
            );


        colorTimelineData =
            colorTimelineData.filter(
                isValidTimelineEntry
            );


        if (
            colorTimelineData.length === 0
        ) {

            throw new Error(
                "The CSV contains no valid color entries."
            );

        }


        drawColorTimeline(
            colorTimelineData
        );


        const initialEntry =
            getInitialTimelineEntry(
                colorTimelineData
            );


        if (initialEntry) {

            activateTimelineEntry(
                initialEntry
            );

        }

    } catch (error) {

        console.error(
            "The color timeline could not be loaded:",
            error
        );


        timelineContainer.innerHTML = `
            <p class="timeline-error-message">
                The color timeline could not be loaded.
                Check that data/color-timeline.csv exists
                and that the page is running through a server.
            </p>
        `;

    }

}


// ==========================================
// CONFIRM COMPARISON PANEL ELEMENTS
// ==========================================

function ensureComparisonPanelElements() {

    const comparisonPanel =
        document.querySelector(
            "#color-comparison-panel"
        );


    if (!comparisonPanel) {

        console.error(
            "Missing HTML element: #color-comparison-panel"
        );

        return;

    }


    let yearElement =
        document.querySelector(
            "#comparison-year"
        );


    if (!yearElement) {

        const yearColumn =
            document.createElement("div");


        yearColumn.className =
            "comparison-year-column";


        yearColumn.innerHTML = `
            <p
                id="comparison-year"
                class="comparison-year"
            >
                ${COLOR_TIMELINE_END_YEAR}
            </p>

            <p class="comparison-year-label">
                YEAR SELECTED
            </p>
        `;


        comparisonPanel.prepend(
            yearColumn
        );

    }


    let colorsContainer =
        document.querySelector(
            "#comparison-colors"
        );


    if (!colorsContainer) {

        colorsContainer =
            document.createElement("div");


        colorsContainer.id =
            "comparison-colors";


        colorsContainer.className =
            "comparison-colors";


        comparisonPanel.appendChild(
            colorsContainer
        );

    }

}


// ==========================================
// PARSE CSV
// ==========================================

function parseColorTimelineRow(row) {

    return {
        year:
            Number(row.year),

        source:
            cleanText(row.source),

        domain:
            cleanText(row.domain),

        colorName:
            cleanText(row.color_name),

        colorGroup:
            cleanText(row.color_group),

        hex:
            normalizeHex(row.hex),

        colorCode:
            cleanText(row.color_code),

        rank:
            Number(row.rank) || 1,

        selectionType:
            cleanText(
                row.selection_type
            )
    };

}


// ==========================================
// CLEAN TEXT
// ==========================================

function cleanText(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value).trim();

}


// ==========================================
// NORMALIZE HEX
// ==========================================

function normalizeHex(value) {

    const cleanedValue =
        cleanText(value);


    if (!cleanedValue) {

        return "#cccccc";

    }


    if (
        cleanedValue.startsWith("#")
    ) {

        return cleanedValue;

    }


    return `#${cleanedValue}`;

}


// ==========================================
// VALIDATE DATA ENTRY
// ==========================================

function isValidTimelineEntry(entry) {

    return (
        Number.isFinite(entry.year) &&
        entry.year >=
            COLOR_TIMELINE_START_YEAR &&
        entry.year <=
            COLOR_TIMELINE_END_YEAR &&
        entry.source.length > 0 &&
        entry.colorName.length > 0
    );

}


// ==========================================
// INITIAL ENTRY
// ==========================================

function getInitialTimelineEntry(data) {

    const latestYear =
        d3.max(
            data,
            entry => entry.year
        );


    const latestEntries =
        data
            .filter(
                entry =>
                    entry.year ===
                    latestYear
            )
            .sort(
                compareTimelineEntries
            );


    return (
        latestEntries[0] ||
        data[0] ||
        null
    );

}


// ==========================================
// ACTIVATE ENTRY
// ==========================================

function activateTimelineEntry(entry) {

    activeTimelineEntry =
        entry;


    updateColorComparisonPanel(
        entry,
        colorTimelineData
    );


    highlightTimelineSelection(
        entry
    );

}


// ==========================================
// DRAW TIMELINE
// ==========================================

function drawColorTimeline(data) {

    const container =
        d3.select(
            "#color-timeline"
        );


    if (container.empty()) {

        return;

    }


    container
        .selectAll("*")
        .remove();


    const containerNode =
        container.node();


    const measuredWidth =
        containerNode
            .getBoundingClientRect()
            .width;


    const width =
        Math.max(
            measuredWidth,
            700
        );


    const years =
        d3.range(
            COLOR_TIMELINE_START_YEAR,
            COLOR_TIMELINE_END_YEAR + 1
        );


    const margin = {
        top: 58,
        right: 8,
        bottom: 20,
        left: 240
    };


    const innerWidth =
        width -
        margin.left -
        margin.right;


    const yearColumnWidth =
        innerWidth /
        years.length;


    const squareSize =
        Math.max(
            12,
            Math.min(
                32,
                yearColumnWidth * 0.68
            )
        );


    const rowHeight =
        Math.max(
            60,
            squareSize + 30
        );


    const innerHeight =
        COLOR_TIMELINE_SOURCES.length *
        rowHeight;


    const height =
        margin.top +
        innerHeight +
        margin.bottom;


    const svg =
        container
            .append("svg")
            .attr(
                "class",
                "color-timeline-svg"
            )
            .attr(
                "width",
                "100%"
            )
            .attr(
                "height",
                height
            )
            .attr(
                "viewBox",
                `0 0 ${width} ${height}`
            )
            .attr(
                "preserveAspectRatio",
                "xMidYMid meet"
            );


    const chart =
        svg
            .append("g")
            .attr(
                "transform",
                `translate(${margin.left}, ${margin.top})`
            );


    const xScale =
        d3
            .scaleBand()
            .domain(years)
            .range(
                [0, innerWidth]
            )
            .paddingInner(0)
            .paddingOuter(0);


    const yScale =
        d3
            .scaleBand()
            .domain(
                COLOR_TIMELINE_SOURCES
            )
            .range(
                [0, innerHeight]
            )
            .paddingInner(0);


    const groupedData =
        d3.group(
            data,
            entry => entry.source,
            entry => entry.year
        );


    drawTimelineYearLabels(
        chart,
        years,
        xScale
    );


    drawTimelineSourceRows(
        chart,
        years,
        groupedData,
        xScale,
        yScale,
        squareSize,
        data
    );


    if (activeTimelineEntry) {

        highlightTimelineSelection(
            activeTimelineEntry
        );

    }

}


// ==========================================
// YEAR LABELS
// ==========================================

function drawTimelineYearLabels(
    chart,
    years,
    xScale
) {

    chart
        .selectAll(
            ".timeline-year-label"
        )
        .data(years)
        .join("text")
        .attr(
            "class",
            "timeline-year-label"
        )
        .attr(
            "data-year",
            year => year
        )
        .attr(
            "x",
            year =>
                xScale(year) +
                xScale.bandwidth() / 2
        )
        .attr(
            "y",
            -22
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            year => year
        );

}


// ==========================================
// SOURCE ROWS
// ==========================================

function drawTimelineSourceRows(
    chart,
    years,
    groupedData,
    xScale,
    yScale,
    squareSize,
    fullData
) {

    COLOR_TIMELINE_SOURCES.forEach(
        function(source) {

            const rowY =
                yScale(source);


            const rowHeight =
                yScale.bandwidth();


            const squareY =
                rowY +
                (
                    rowHeight -
                    squareSize
                ) / 2;


            drawTimelineRowDivider(
                chart,
                rowY,
                xScale.range()[1]
            );


            drawTimelineSourceLabel(
                chart,
                source,
                rowY,
                rowHeight
            );


            years.forEach(
                function(year) {

                    const cellX =
                        xScale(year);


                    const squareX =
                        cellX +
                        (
                            xScale.bandwidth() -
                            squareSize
                        ) / 2;


                    const entries =
                        groupedData
                            .get(source)
                            ?.get(year);


                    if (
                        !entries ||
                        entries.length === 0
                    ) {

                        drawTimelinePlaceholder(
                            chart,
                            year,
                            source,
                            squareX,
                            squareY,
                            squareSize
                        );


                        return;

                    }


                    entries.sort(
                        (first, second) =>
                            first.rank -
                            second.rank
                    );


                    drawTimelineYearSwatches(
                        chart,
                        entries,
                        squareX,
                        squareY,
                        squareSize,
                        fullData
                    );

                }
            );

        }
    );


    drawTimelineRowDivider(
        chart,
        yScale.range()[1],
        xScale.range()[1]
    );

}


// ==========================================
// ROW DIVIDER
// ==========================================

function drawTimelineRowDivider(
    chart,
    y,
    chartWidth
) {

    chart
        .append("line")
        .attr(
            "class",
            "timeline-row-divider"
        )
        .attr(
            "x1",
            -240
        )
        .attr(
            "x2",
            chartWidth
        )
        .attr(
            "y1",
            y
        )
        .attr(
            "y2",
            y
        );

}


// ==========================================
// SOURCE LABEL
// ==========================================

function drawTimelineSourceLabel(
    chart,
    source,
    rowY,
    rowHeight
) {

    chart
        .append("text")
        .attr(
            "class",
            "timeline-source-label"
        )
        .attr(
            "x",
            -220
        )
        .attr(
            "y",
            rowY +
            rowHeight / 2
        )
        .attr(
            "text-anchor",
            "start"
        )
        .attr(
            "dominant-baseline",
            "middle"
        )
        .text(
            source.toUpperCase()
        );

}


// ==========================================
// PLACEHOLDER CELL
// ==========================================

function drawTimelinePlaceholder(
    chart,
    year,
    source,
    x,
    y,
    squareSize
) {

    chart
        .append("rect")
        .attr(
            "class",
            "timeline-placeholder"
        )
        .attr(
            "data-year",
            year
        )
        .attr(
            "data-source",
            source
        )
        .attr(
            "x",
            x
        )
        .attr(
            "y",
            y
        )
        .attr(
            "width",
            squareSize
        )
        .attr(
            "height",
            squareSize
        );

}


// ==========================================
// DRAW COLOR SWATCHES
// ==========================================

function drawTimelineYearSwatches(
    chart,
    entries,
    x,
    y,
    squareSize,
    fullData
) {

    const segmentWidth =
        squareSize /
        entries.length;


    const group =
        chart
            .append("g")
            .attr(
                "class",
                "timeline-swatch-group"
            );


    group
        .append("rect")
        .attr(
            "class",
            "timeline-swatch-outline"
        )
        .attr(
            "x",
            x
        )
        .attr(
            "y",
            y
        )
        .attr(
            "width",
            squareSize
        )
        .attr(
            "height",
            squareSize
        );


    group
        .selectAll(
            ".timeline-color-swatch"
        )
        .data(entries)
        .join("rect")
        .attr(
            "class",
            "timeline-color-swatch"
        )
        .attr(
            "data-year",
            entry => entry.year
        )
        .attr(
            "data-source",
            entry => entry.source
        )
        .attr(
            "data-color-name",
            entry => entry.colorName
        )
        .attr(
            "data-rank",
            entry => entry.rank
        )
        .attr(
            "x",
            (entry, index) =>
                x +
                index *
                segmentWidth
        )
        .attr(
            "y",
            y
        )
        .attr(
            "width",
            segmentWidth
        )
        .attr(
            "height",
            squareSize
        )
        .attr(
            "fill",
            entry => entry.hex
        )
        .attr(
            "tabindex",
            0
        )
        .attr(
            "role",
            "button"
        )
        .attr(
            "aria-label",
            entry =>
                `${entry.year}, ${entry.source}, ${entry.colorName}`
        )
        .on(
            "pointerenter",
            function(event, entry) {

                activateTimelineEntry(
                    entry
                );

            }
        )
        .on(
            "focus",
            function(event, entry) {

                activateTimelineEntry(
                    entry
                );

            }
        )
        .on(
            "click",
            function(event, entry) {

                activateTimelineEntry(
                    entry
                );

            }
        );

}


// ==========================================
// COMPARISON PANEL
// ==========================================

function updateColorComparisonPanel(
    hoveredEntry,
    data
) {

    ensureComparisonPanelElements();


    const yearElement =
        document.querySelector(
            "#comparison-year"
        );


    const colorsContainer =
        document.querySelector(
            "#comparison-colors"
        );


    if (!yearElement) {

        console.error(
            "Missing HTML element: #comparison-year"
        );

        return;

    }


    if (!colorsContainer) {

        console.error(
            "Missing HTML element: #comparison-colors"
        );

        return;

    }


    yearElement.textContent =
        hoveredEntry.year;


    const yearEntries =
        data
            .filter(
                entry =>
                    entry.year ===
                    hoveredEntry.year
            )
            .sort(
                compareTimelineEntries
            );


    const remainingEntries =
        yearEntries.filter(
            entry =>
                !isSameTimelineEntry(
                    entry,
                    hoveredEntry
                )
        );


    const orderedEntries = [
        hoveredEntry,
        ...remainingEntries
    ];


    colorsContainer.innerHTML =
        orderedEntries
            .map(
                function(entry, index) {

                    return createComparisonCard(
                        entry,
                        index === 0
                    );

                }
            )
            .join("");


    colorsContainer.scrollLeft = 0;

}


// ==========================================
// COMPARISON CARD
// ==========================================

function createComparisonCard(
    entry,
    isPrimary
) {

    const cardClass =
        isPrimary
            ? "comparison-color-card-primary"
            : "comparison-color-card-secondary";


    const swatchClass =
        isPrimary
            ? "comparison-swatch-primary"
            : "comparison-swatch-secondary";


    const safeSource =
        escapeTimelineHTML(
            entry.source ||
            "Unknown source"
        );


    const safeName =
        escapeTimelineHTML(
            entry.colorName ||
            "Unnamed color"
        );


    const safeFamily =
        escapeTimelineHTML(
            entry.colorGroup ||
            "Not available"
        );


    const safeCode =
        escapeTimelineHTML(
            entry.colorCode ||
            "Not available"
        );


    const safeHex =
        normalizeHex(
            entry.hex
        );


    const safeDomain =
        escapeTimelineHTML(
            entry.domain ||
            "Not available"
        );


    const safeSelectionType =
        escapeTimelineHTML(
            entry.selectionType ||
            "Not available"
        );


    return `
        <article
            class="
                comparison-color-card
                ${cardClass}
            "
        >

            <div
                class="
                    comparison-swatch
                    ${swatchClass}
                "
                style="
                    background-color: ${safeHex};
                "
                aria-label="${safeName}"
            ></div>


            <div
                class="comparison-color-information"
            >

                <p class="comparison-source">
                    ${safeSource}
                </p>


                <h2 class="comparison-color-name">
                    ${safeName}
                </h2>


                <dl class="comparison-color-details">

                    <div>
                        <dt>Family</dt>
                        <dd>${safeFamily}</dd>
                    </div>

                    <div>
                        <dt>Code</dt>
                        <dd>${safeCode}</dd>
                    </div>

                    <div>
                        <dt>Hex</dt>
                        <dd>${safeHex}</dd>
                    </div>

                    <div>
                        <dt>Domain</dt>
                        <dd>${safeDomain}</dd>
                    </div>

                    <div>
                        <dt>Type</dt>
                        <dd>${safeSelectionType}</dd>
                    </div>

                </dl>

            </div>

        </article>
    `;

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeTimelineHTML(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            "\"",
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// ==========================================
// SORT ENTRIES
// ==========================================

function compareTimelineEntries(
    first,
    second
) {

    const firstSourceIndex =
        COLOR_TIMELINE_SOURCES.indexOf(
            first.source
        );


    const secondSourceIndex =
        COLOR_TIMELINE_SOURCES.indexOf(
            second.source
        );


    const normalizedFirstIndex =
        firstSourceIndex === -1
            ? COLOR_TIMELINE_SOURCES.length
            : firstSourceIndex;


    const normalizedSecondIndex =
        secondSourceIndex === -1
            ? COLOR_TIMELINE_SOURCES.length
            : secondSourceIndex;


    if (
        normalizedFirstIndex !==
        normalizedSecondIndex
    ) {

        return (
            normalizedFirstIndex -
            normalizedSecondIndex
        );

    }


    return (
        first.rank -
        second.rank
    );

}


// ==========================================
// HIGHLIGHT TIMELINE
// ==========================================

function highlightTimelineSelection(
    activeEntry
) {

    d3
        .selectAll(
            ".timeline-color-swatch"
        )
        .classed(
            "is-muted",
            function() {

                return (
                    Number(
                        this.dataset.year
                    ) !==
                    activeEntry.year
                );

            }
        )
        .classed(
            "is-selected",
            function() {

                return (
                    Number(
                        this.dataset.year
                    ) ===
                        activeEntry.year &&

                    this.dataset.source ===
                        activeEntry.source &&

                    this.dataset.colorName ===
                        activeEntry.colorName &&

                    Number(
                        this.dataset.rank
                    ) ===
                        activeEntry.rank
                );

            }
        );


    d3
        .selectAll(
            ".timeline-placeholder"
        )
        .classed(
            "is-muted",
            function() {

                return (
                    Number(
                        this.dataset.year
                    ) !==
                    activeEntry.year
                );

            }
        );


    d3
        .selectAll(
            ".timeline-year-label"
        )
        .classed(
            "is-selected",
            function() {

                return (
                    Number(
                        this.dataset.year
                    ) ===
                    activeEntry.year
                );

            }
        );

}


// ==========================================
// ENTRY COMPARISON
// ==========================================

function isSameTimelineEntry(
    first,
    second
) {

    return (
        first.year ===
            second.year &&

        first.source ===
            second.source &&

        first.colorName ===
            second.colorName &&

        first.rank ===
            second.rank
    );

}


// ==========================================
// RESPONSIVE REDRAW
// ==========================================

window.addEventListener(
    "resize",
    function() {

        clearTimeout(
            colorTimelineResizeTimer
        );


        colorTimelineResizeTimer =
            setTimeout(
                function() {

                    if (
                        colorTimelineData.length >
                        0
                    ) {

                        drawColorTimeline(
                            colorTimelineData
                        );

                    }


                    if (
                        activeTimelineEntry
                    ) {

                        activateTimelineEntry(
                            activeTimelineEntry
                        );

                    }

                },
                200
            );

    }
);