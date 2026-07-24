// ==========================================
// COLOR FORECAST TIMELINE
// Pantone, Benjamin Moore,
// Sherwin-Williams, Coloro × WGSN, Vogue
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


let colorTimelineData = [];

let activeTimelineEntry = null;

let colorTimelineResizeTimer;


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeColorTimeline
);


async function initializeColorTimeline() {

    const timelineContainer =
        document.querySelector("#color-timeline");


    if (!timelineContainer) {

        console.warn(
            "The #color-timeline element was not found."
        );

        return;

    }


    try {

        colorTimelineData = await d3.csv(
            COLOR_TIMELINE_DATA_PATH,
            parseColorTimelineRow
        );


        drawColorTimeline(
            colorTimelineData
        );


        const initialEntry =
            getInitialTimelineEntry(
                colorTimelineData
            );


        if (initialEntry) {

            activeTimelineEntry =
                initialEntry;


            updateColorComparisonPanel(
                initialEntry,
                colorTimelineData
            );


            highlightTimelineSelection(
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
                and run the project through a local server.
            </p>
        `;

    }

}


// ==========================================
// PARSE CSV
// ==========================================

function parseColorTimelineRow(row) {

    return {
        year: Number(row.year),
        source: row.source.trim(),
        domain: row.domain.trim(),
        colorName: row.color_name.trim(),
        colorGroup: row.color_group.trim(),
        hex: row.hex.trim(),
        colorCode: row.color_code.trim(),
        rank: Number(row.rank),
        selectionType:
            row.selection_type.trim()
    };

}


// ==========================================
// INITIAL ENTRY
// ==========================================

function getInitialTimelineEntry(data) {

    const latestYearEntries =
        data.filter(
            entry =>
                entry.year ===
                COLOR_TIMELINE_END_YEAR
        );


    if (latestYearEntries.length > 0) {

        return latestYearEntries[0];

    }


    return data[data.length - 1] || null;

}


// ==========================================
// DRAW TIMELINE
// ==========================================

function drawColorTimeline(data) {

    const container =
        d3.select("#color-timeline");


    container
        .selectAll("*")
        .remove();


    const containerWidth =
        container
            .node()
            .getBoundingClientRect()
            .width;


    const years = d3.range(
        COLOR_TIMELINE_START_YEAR,
        COLOR_TIMELINE_END_YEAR + 1
    );


    const margin = {
    top: 58,
    right: 8,
    bottom: 20,
    left: 240
};


    const width =
        Math.max(containerWidth, 700);


    const innerWidth =
        width -
        margin.left -
        margin.right;


    const yearColumnWidth =
        innerWidth / years.length;


    /*
    The square size is calculated from the
    available width. The maximum keeps the
    swatches visually controlled on large screens.
    */
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


    const svg = container
        .append("svg")
        .attr(
            "class",
            "color-timeline-svg"
        )
        .attr("width", "100%")
        .attr("height", height)
        .attr(
            "viewBox",
            `0 0 ${width} ${height}`
        )
        .attr(
            "preserveAspectRatio",
            "xMidYMid meet"
        );


    const chart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );


    const xScale = d3
        .scaleBand()
        .domain(years)
        .range([0, innerWidth])
        .paddingInner(0)
        .paddingOuter(0);


    const yScale = d3
        .scaleBand()
        .domain(COLOR_TIMELINE_SOURCES)
        .range([0, innerHeight])
        .paddingInner(0);


    const groupedData = d3.group(
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
        .selectAll(".timeline-year-label")
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
        .attr("y", -22)
        .attr(
            "text-anchor",
            "middle"
        )
        .text(year => year);

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


            // Row divider
            chart
                .append("line")
                .attr(
                    "class",
                    "timeline-row-divider"
                )
                .attr("x1", -240)
                .attr("x2", xScale.range()[1])
                .attr("y1", rowY)
                .attr("y2", rowY);


            // Source label
            chart
                .append("text")
                .attr(
                    "class",
                    "timeline-source-label"
                )
                .attr("x", -24)
                .attr(
                    "y",
                    rowY +
                    rowHeight / 2
                )
                .attr(
                    "text-anchor",
                    "end"
                )
                .attr(
                    "dominant-baseline",
                    "middle"
                )
                .text(
                    source.toUpperCase()
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


                    if (!entries) {

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
                                "x",
                                squareX
                            )
                            .attr(
                                "y",
                                squareY
                            )
                            .attr(
                                "width",
                                squareSize
                            )
                            .attr(
                                "height",
                                squareSize
                            );

                        return;

                    }


                    entries.sort(
                        (a, b) =>
                            a.rank - b.rank
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


    const finalRowY =
        yScale.range()[1];


    chart
        .append("line")
        .attr(
            "class",
            "timeline-row-divider"
        )
        .attr("x1", -240)
        .attr("x2", xScale.range()[1])
        .attr("y1", finalRowY)
        .attr("y2", finalRowY);

}


// ==========================================
// DRAW YEAR SWATCH
// ==========================================

function drawTimelineYearSwatches(
    chart,
    entries,
    x,
    y,
    squareSize,
    fullData
) {

    /*
    A year can contain more than one color.
    The square remains square and is divided
    vertically between all entries.
    */

    const segmentWidth =
        squareSize / entries.length;


    const group = chart
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
        .attr("x", x)
        .attr("y", y)
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
            "x",
            (entry, index) =>
                x +
                index *
                segmentWidth
        )
        .attr("y", y)
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
        .on(
            "mouseenter",
            function(event, entry) {

                activeTimelineEntry =
                    entry;


                updateColorComparisonPanel(
                    entry,
                    fullData
                );


                highlightTimelineSelection(
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

    const yearElement =
        document.querySelector(
            "#comparison-year"
        );


    const colorsContainer =
        document.querySelector(
            "#comparison-colors"
        );


    if (
        !yearElement ||
        !colorsContainer
    ) {
        return;
    }


    yearElement.textContent =
        hoveredEntry.year;


    const yearEntries = data
        .filter(
            entry =>
                entry.year ===
                hoveredEntry.year
        )
        .sort(
            compareTimelineEntries
        );


    /*
    Put the hovered entry first.
    All remaining colors follow in source order.
    */

    const orderedEntries = [
        hoveredEntry,
        ...yearEntries.filter(
            entry =>
                !isSameTimelineEntry(
                    entry,
                    hoveredEntry
                )
        )
    ];


    colorsContainer.innerHTML =
        orderedEntries
            .map(
                function(entry, index) {

                    const primary =
                        index === 0;


                    return createComparisonCard(
                        entry,
                        primary
                    );

                }
            )
            .join("");

}


// ==========================================
// COMPARISON CARD
// ==========================================

function createComparisonCard(
    entry,
    primary
) {

    return `
        <article
            class="
                comparison-color-card
                ${
                    primary
                        ? "comparison-color-card-primary"
                        : "comparison-color-card-secondary"
                }
            "
        >

            <div
                class="
                    comparison-swatch
                    ${
                        primary
                            ? "comparison-swatch-primary"
                            : "comparison-swatch-secondary"
                    }
                "
                style="
                    background-color:
                    ${entry.hex};
                "
            ></div>


            <div class="comparison-color-information">

                <p class="comparison-source">
                    ${entry.source}
                </p>

                <h2 class="comparison-color-name">
                    ${entry.colorName}
                </h2>

                <dl class="comparison-color-details">

                    <div>
                        <dt>Family</dt>
                        <dd>${entry.colorGroup}</dd>
                    </div>

                    <div>
                        <dt>Code</dt>
                        <dd>${entry.colorCode}</dd>
                    </div>

                    <div>
                        <dt>Hex</dt>
                        <dd>${entry.hex}</dd>
                    </div>

                </dl>

            </div>

        </article>
    `;

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


    if (
        firstSourceIndex !==
        secondSourceIndex
    ) {

        return (
            firstSourceIndex -
            secondSourceIndex
        );

    }


    return first.rank - second.rank;

}


// ==========================================
// HIGHLIGHT TIMELINE
// ==========================================

function highlightTimelineSelection(
    activeEntry
) {

    d3.selectAll(
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
                        activeEntry.colorName
                );

            }
        );


    d3.selectAll(
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


    d3.selectAll(
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
        first.year === second.year &&
        first.source === second.source &&
        first.colorName ===
            second.colorName &&
        first.rank === second.rank
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

                },
                200
            );

    }
);