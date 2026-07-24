// ==========================================
// CMYK COLOR GENEALOGY
// D3.js relational structure
// ==========================================

(function () {

    const container = d3.select("#cmykGenealogy");

    if (container.empty()) {
        console.warn("The #cmykGenealogy container was not found.");
        return;
    }


    // ==========================================
    // CONFIGURATION
    // ==========================================

    const SVG_WIDTH = 820;
    const SVG_HEIGHT = 710;

    const MAX_SELECTIONS = 2;

    const GENERATION_RADIUS = {
        0: 46,
        1: 35,
        2: 27,
        3: 21,
        4: 17,
        5: 14
    };

    const PRIMARY_POSITIONS = {
        cyan: {
            x: SVG_WIDTH / 2,
            y: 135
        },

        magenta: {
            x: 235,
            y: 350
        },

        yellow: {
            x: SVG_WIDTH - 235,
            y: 350
        },

        black: {
            x: SVG_WIDTH / 2,
            y: 565
        }
    };


    // ==========================================
    // STATE
    // ==========================================

    let nodes = [];
    let links = [];
    let selectedNodes = [];
    let latestCreatedNodeId = null;
    let mixCounter = 0;
    let simulation;


    // ==========================================
    // SVG
    // ==========================================

    const svg = container
        .append("svg")
        .attr("viewBox", `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr(
            "aria-label",
            "Interactive CMYK color genealogy. Select any two color circles to create a new mixed color."
        );


    // Invisible background for zooming and panning.
    svg
        .append("rect")
        .attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .attr("fill", "transparent");


    const zoomLayer = svg
        .append("g")
        .attr("class", "genealogy-zoom-layer");


    const generationLayer = zoomLayer
        .append("g")
        .attr("class", "genealogy-generation-layer");


    const linkLayer = zoomLayer
        .append("g")
        .attr("class", "genealogy-link-layer");


    const nodeLayer = zoomLayer
        .append("g")
        .attr("class", "genealogy-node-layer");


    const zoomBehavior = d3
        .zoom()
        .scaleExtent([0.65, 3.5])
        .on("zoom", function (event) {

            zoomLayer.attr("transform", event.transform);

        });


    svg.call(zoomBehavior);


    // ==========================================
    // TOOLTIP
    // ==========================================

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "genealogy-tooltip");


    // ==========================================
    // INTERFACE REFERENCES
    // ==========================================

    const firstSelectedSwatch = document.getElementById("firstSelectedSwatch");
    const secondSelectedSwatch = document.getElementById("secondSelectedSwatch");

    const firstSelectedName = document.getElementById("firstSelectedName");
    const secondSelectedName = document.getElementById("secondSelectedName");

    const mixingResultSwatch = document.getElementById("mixingResultSwatch");
    const mixingResultName = document.getElementById("mixingResultName");
    const mixingResultGeneration = document.getElementById("mixingResultGeneration");

    const recipeCyan = document.getElementById("recipeCyan");
    const recipeMagenta = document.getElementById("recipeMagenta");
    const recipeYellow = document.getElementById("recipeYellow");
    const recipeBlack = document.getElementById("recipeBlack");

    const resetButton = document.getElementById("resetMixingButton");


    // ==========================================
    // LOAD INITIAL CSV DATA
    // ==========================================

    Promise
        .all([
            d3.csv("data/cmyk-genealogy-nodes.csv"),
            d3.csv("data/cmyk-genealogy-edges.csv")
        ])
        .then(function ([nodeData, edgeData]) {

            nodes = nodeData.map(parseNode);
            links = edgeData.map(parseLink);

            initializePrimaryPositions();
            createSimulation();
            render();

        })
        .catch(function (error) {

            console.error("CMYK genealogy data could not be loaded:", error);

            container
                .append("p")
                .style("padding", "40px")
                .style("color", "#777777")
                .text(
                    "The CMYK data could not be loaded. View the project through GitHub Pages or a local server."
                );

        });


    // ==========================================
    // DATA PARSING
    // ==========================================

    function parseNode(d) {

        return {
            id: d.id,
            name: d.name,
            shortLabel: d.shortLabel,
            generation: Number(d.generation),

            c: Number(d.c),
            m: Number(d.m),
            y: Number(d.y),
            k: Number(d.k),

            color: d.color,
            parentOne: d.parentOne || "",
            parentTwo: d.parentTwo || "",

            x: null,
            yPosition: null
        };

    }


    function parseLink(d) {

        return {
            source: d.source,
            target: d.target,
            relationship: d.relationship
        };

    }


    // ==========================================
    // PRIMARY POSITIONS
    // ==========================================

    function initializePrimaryPositions() {

        nodes.forEach(function (node) {

            const position = PRIMARY_POSITIONS[node.id];

            if (!position) {
                return;
            }

            node.x = position.x;
            node.y = position.y;

            // The four primaries remain fixed in their initial composition.
            node.fx = position.x;
            node.fy = position.y;

        });

    }


    // ==========================================
    // FORCE SIMULATION
    // ==========================================

    function createSimulation() {

        simulation = d3
            .forceSimulation(nodes)

            .force(
                "link",
                d3
                    .forceLink(links)
                    .id(function (d) {
                        return d.id;
                    })
                    .distance(function (link) {

                        const child = getNodeObject(link.target);
                        const generation = child ? child.generation : 1;

                        return Math.max(78, 132 - generation * 10);

                    })
                    .strength(0.55)
            )

            .force(
                "charge",
                d3
                    .forceManyBody()
                    .strength(function (node) {

                        return node.generation === 0 ? -500 : -185;

                    })
            )

            .force(
                "collision",
                d3
                    .forceCollide()
                    .radius(function (node) {

                        return getNodeRadius(node) + 18;

                    })
                    .strength(1)
            )

            .force(
                "center",
                d3.forceCenter(
                    SVG_WIDTH / 2,
                    SVG_HEIGHT / 2
                )
            )

            .force(
                "x",
                d3
                    .forceX(SVG_WIDTH / 2)
                    .strength(0.025)
            )

            .force(
                "y",
                d3
                    .forceY(SVG_HEIGHT / 2)
                    .strength(0.025)
            )

            .alphaDecay(0.035)

            .on("tick", updatePositions);

    }


    // ==========================================
    // RENDER
    // ==========================================

    function render() {

        renderGenerationLabels();
        renderLinks();
        renderNodes();

        simulation.nodes(nodes);

        simulation
            .force("link")
            .links(links);

        simulation
            .alpha(0.85)
            .restart();

        updateSelectionPanel();

    }


    // ==========================================
    // GENERATION LABELS
    // ==========================================

    function renderGenerationLabels() {

        const generations = d3
            .groups(nodes, function (node) {
                return node.generation;
            })
            .map(function ([generation]) {
                return Number(generation);
            })
            .sort(d3.ascending);


        generationLayer
            .selectAll("text")
            .data(generations, function (generation) {
                return generation;
            })
            .join(
                function (enter) {

                    return enter
                        .append("text")
                        .attr("class", "genealogy-generation-label")
                        .attr("x", 24)
                        .attr("y", function (generation) {
                            return 30 + generation * 16;
                        })
                        .text(function (generation) {

                            if (generation === 0) {
                                return "PRIMARY COLORS";
                            }

                            return `GENERATION ${generation}`;

                        });

                },

                function (update) {

                    return update
                        .attr("y", function (generation) {
                            return 30 + generation * 16;
                        });

                },

                function (exit) {

                    return exit.remove();

                }
            );

    }


    // ==========================================
    // LINKS
    // ==========================================

    function renderLinks() {

        linkLayer
            .selectAll("line")
            .data(
                links,
                function (link) {

                    return `${getNodeId(link.source)}-${getNodeId(link.target)}`;

                }
            )
            .join(
                function (enter) {

                    return enter
                        .append("line")
                        .attr("class", "genealogy-link")
                        .attr("x1", function (link) {

                            const source = getNodeObject(link.source);
                            return source ? source.x : SVG_WIDTH / 2;

                        })
                        .attr("y1", function (link) {

                            const source = getNodeObject(link.source);
                            return source ? source.y : SVG_HEIGHT / 2;

                        })
                        .attr("x2", function (link) {

                            const source = getNodeObject(link.source);
                            return source ? source.x : SVG_WIDTH / 2;

                        })
                        .attr("y2", function (link) {

                            const source = getNodeObject(link.source);
                            return source ? source.y : SVG_HEIGHT / 2;

                        })
                        .call(function (selection) {

                            selection
                                .transition()
                                .duration(520)
                                .attr("x2", function (link) {

                                    const target = getNodeObject(link.target);
                                    return target ? target.x : SVG_WIDTH / 2;

                                })
                                .attr("y2", function (link) {

                                    const target = getNodeObject(link.target);
                                    return target ? target.y : SVG_HEIGHT / 2;

                                });

                        });

                },

                function (update) {

                    return update;

                },

                function (exit) {

                    return exit
                        .transition()
                        .duration(250)
                        .style("opacity", 0)
                        .remove();

                }
            );

    }


    // ==========================================
    // NODES
    // ==========================================

    function renderNodes() {

        const nodeSelection = nodeLayer
            .selectAll("g.genealogy-node")
            .data(
                nodes,
                function (node) {
                    return node.id;
                }
            );


        const nodeEnter = nodeSelection
            .enter()
            .append("g")
            .attr("class", "genealogy-node")
            .attr(
                "transform",
                function (node) {

                    const x = Number.isFinite(node.x)
                        ? node.x
                        : SVG_WIDTH / 2;

                    const y = Number.isFinite(node.y)
                        ? node.y
                        : SVG_HEIGHT / 2;

                    return `translate(${x}, ${y}) scale(0)`;

                }
            )
            .attr("tabindex", 0)
            .attr(
                "aria-label",
                function (node) {
                    return `${node.name}. Generation ${node.generation}.`;
                }
            )
            .call(createNodeDrag());


        nodeEnter
            .append("circle")
            .attr("r", function (node) {
                return getNodeRadius(node);
            })
            .attr("fill", function (node) {
                return node.color;
            });


        nodeEnter
            .filter(function (node) {
                return node.generation === 0;
            })
            .append("text")
            .attr("class", "genealogy-primary-letter")
            .attr("dy", "-0.05em")
            .attr(
                "fill",
                function (node) {
                    return getReadableTextColor(node.color);
                }
            )
            .text(function (node) {
                return node.shortLabel;
            });


        nodeEnter
            .filter(function (node) {
                return node.generation === 0;
            })
            .append("text")
            .attr("class", "genealogy-primary-name")
            .attr("dy", "1.65em")
            .attr(
                "fill",
                function (node) {
                    return getReadableTextColor(node.color);
                }
            )
            .text(function (node) {
                return node.name.toUpperCase();
            });


        nodeEnter
            .filter(function (node) {
                return node.generation > 0;
            })
            .append("text")
            .attr("class", "genealogy-child-label")
            .attr(
                "dy",
                function (node) {
                    return getNodeRadius(node) + 17;
                }
            )
            .text(function (node) {
                return node.name.toUpperCase();
            });


        nodeEnter
            .on("click", function (event, node) {

                event.stopPropagation();
                selectNode(node);

            })

            .on("keydown", function (event, node) {

                if (event.key === "Enter" || event.key === " ") {

                    event.preventDefault();
                    selectNode(node);

                }

            })

            .on("mouseenter focus", function (event, node) {

                highlightNodeFamily(node);
                showTooltip(event, node);

            })

            .on("mousemove", moveTooltip)

            .on("mouseleave blur", function () {

                resetNodeHighlight();
                hideTooltip();

            });


        nodeEnter
            .transition()
            .delay(function (node) {

                return node.id === latestCreatedNodeId
                    ? 120
                    : 0;

            })
            .duration(560)
            .ease(d3.easeBackOut.overshoot(1.15))
            .attr(
                "transform",
                function (node) {
                    return `translate(${node.x}, ${node.y}) scale(1)`;
                }
            );


        nodeSelection
            .merge(nodeEnter)
            .classed(
                "is-selected",
                function (node) {

                    return selectedNodes.some(function (selected) {
                        return selected.id === node.id;
                    });

                }
            );


        nodeSelection
            .exit()
            .transition()
            .duration(260)
            .style("opacity", 0)
            .remove();

    }


    // ==========================================
    // SELECT + MIX
    // ==========================================

    function selectNode(node) {

        const existingIndex = selectedNodes.findIndex(function (selected) {
            return selected.id === node.id;
        });


        // Clicking an already-selected node deselects it.
        if (existingIndex !== -1) {

            selectedNodes.splice(existingIndex, 1);
            latestCreatedNodeId = null;

            updateSelectionPanel();
            renderNodes();

            return;

        }


        // Start a new pair when two selections are already present.
        if (selectedNodes.length >= MAX_SELECTIONS) {

            selectedNodes = [];

        }


        selectedNodes.push(node);

        latestCreatedNodeId = null;

        updateSelectionPanel();
        renderNodes();


        if (selectedNodes.length === MAX_SELECTIONS) {

            window.setTimeout(function () {

                createMixedNode(
                    selectedNodes[0],
                    selectedNodes[1]
                );

            }, 280);

        }

    }


    function createMixedNode(parentOne, parentTwo) {

        const recipe = averageRecipes(
            parentOne,
            parentTwo
        );

        const generation =
            Math.max(
                parentOne.generation,
                parentTwo.generation
            ) + 1;

        const duplicate = findExistingRecipe(recipe);


        // If the exact recipe already exists, reveal it rather than duplicate it.
        if (duplicate) {

            latestCreatedNodeId = duplicate.id;
            selectedNodes = [];

            updateResultPanel(duplicate);
            renderNodes();
            pulseExistingNode(duplicate.id);

            return;

        }


        mixCounter += 1;


        const child = {
            id: `mix-${Date.now()}-${mixCounter}`,

            name: createColorName(recipe),

            shortLabel: "",

            generation: generation,

            c: recipe.c,
            m: recipe.m,
            y: recipe.y,
            k: recipe.k,

            color: cmykToHex(
                recipe.c,
                recipe.m,
                recipe.y,
                recipe.k
            ),

            parentOne: parentOne.id,
            parentTwo: parentTwo.id,

            x: (
                parentOne.x +
                parentTwo.x
            ) / 2,

            y: (
                parentOne.y +
                parentTwo.y
            ) / 2
        };


        nodes.push(child);


        links.push(
            {
                source: parentOne.id,
                target: child.id,
                relationship: "parent"
            },

            {
                source: parentTwo.id,
                target: child.id,
                relationship: "parent"
            }
        );


        latestCreatedNodeId = child.id;
        selectedNodes = [];

        updateResultPanel(child);

        render();

    }


    // ==========================================
    // RECIPE CALCULATIONS
    // ==========================================

    function averageRecipes(first, second) {

        return normalizeRecipe({
            c: (first.c + second.c) / 2,
            m: (first.m + second.m) / 2,
            y: (first.y + second.y) / 2,
            k: (first.k + second.k) / 2
        });

    }


    function normalizeRecipe(recipe) {

        return {
            c: roundToOneDecimal(recipe.c),
            m: roundToOneDecimal(recipe.m),
            y: roundToOneDecimal(recipe.y),
            k: roundToOneDecimal(recipe.k)
        };

    }


    function roundToOneDecimal(value) {

        return Math.round(value * 10) / 10;

    }


    function findExistingRecipe(recipe) {

        return nodes.find(function (node) {

            return (
                Math.abs(node.c - recipe.c) < 0.05 &&
                Math.abs(node.m - recipe.m) < 0.05 &&
                Math.abs(node.y - recipe.y) < 0.05 &&
                Math.abs(node.k - recipe.k) < 0.05
            );

        });

    }


    // ==========================================
    // DIGITAL CMYK APPROXIMATION
    // ==========================================

    function cmykToHex(c, m, y, k) {

        const cyan = c / 100;
        const magenta = m / 100;
        const yellow = y / 100;
        const black = k / 100;


        const red = Math.round(
            255 * (1 - cyan) * (1 - black)
        );

        const green = Math.round(
            255 * (1 - magenta) * (1 - black)
        );

        const blue = Math.round(
            255 * (1 - yellow) * (1 - black)
        );


        return rgbToHex(red, green, blue);

    }


    function rgbToHex(red, green, blue) {

        return (
            "#" +
            [red, green, blue]
                .map(function (value) {

                    return value
                        .toString(16)
                        .padStart(2, "0");

                })
                .join("")
        );

    }


    // ==========================================
    // COLOR NAME
    // ==========================================

    function createColorName(recipe) {

        const rgb = hexToRgb(
            cmykToHex(
                recipe.c,
                recipe.m,
                recipe.y,
                recipe.k
            )
        );

        const hsl = rgbToHsl(
            rgb.r,
            rgb.g,
            rgb.b
        );


        let family;


        if (hsl.s < 0.09) {

            family = "Neutral";

        } else if (hsl.h < 15 || hsl.h >= 345) {

            family = "Red";

        } else if (hsl.h < 40) {

            family = "Orange";

        } else if (hsl.h < 70) {

            family = "Yellow";

        } else if (hsl.h < 155) {

            family = "Green";

        } else if (hsl.h < 190) {

            family = "Teal";

        } else if (hsl.h < 250) {

            family = "Blue";

        } else if (hsl.h < 290) {

            family = "Violet";

        } else if (hsl.h < 330) {

            family = "Magenta";

        } else {

            family = "Rose";

        }


        let modifier;


        if (recipe.k >= 55 || hsl.l < 0.22) {

            modifier = "Deep";

        } else if (hsl.s < 0.2) {

            modifier = "Muted";

        } else if (hsl.l > 0.72) {

            modifier = "Pale";

        } else if (hsl.l > 0.58) {

            modifier = "Light";

        } else if (hsl.s > 0.7) {

            modifier = "Vivid";

        } else {

            modifier = "Soft";

        }


        return `${modifier} ${family}`;

    }


    function hexToRgb(hex) {

        const value = hex.replace("#", "");

        return {
            r: parseInt(value.substring(0, 2), 16),
            g: parseInt(value.substring(2, 4), 16),
            b: parseInt(value.substring(4, 6), 16)
        };

    }


    function rgbToHsl(red, green, blue) {

        let r = red / 255;
        let g = green / 255;
        let b = blue / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let hue = 0;
        let saturation = 0;

        const lightness = (max + min) / 2;
        const difference = max - min;


        if (difference !== 0) {

            saturation =
                lightness > 0.5
                    ? difference / (2 - max - min)
                    : difference / (max + min);


            if (max === r) {

                hue = (
                    (g - b) / difference +
                    (g < b ? 6 : 0)
                );

            } else if (max === g) {

                hue = (
                    (b - r) / difference +
                    2
                );

            } else {

                hue = (
                    (r - g) / difference +
                    4
                );

            }


            hue *= 60;

        }


        return {
            h: hue,
            s: saturation,
            l: lightness
        };

    }


    // ==========================================
    // NODE SIZE
    // ==========================================

    function getNodeRadius(node) {

        if (GENERATION_RADIUS[node.generation]) {

            return GENERATION_RADIUS[node.generation];

        }

        return 11;

    }


    // ==========================================
    // INTERFACE PANEL
    // ==========================================

    function updateSelectionPanel() {

        updateSelectedSlot(
            selectedNodes[0],
            firstSelectedSwatch,
            firstSelectedName
        );

        updateSelectedSlot(
            selectedNodes[1],
            secondSelectedSwatch,
            secondSelectedName
        );


        if (
            selectedNodes.length === 0 &&
            latestCreatedNodeId === null
        ) {

            clearResultPanel();

        }

    }


    function updateSelectedSlot(node, swatch, nameElement) {

        if (!node) {

            swatch.style.backgroundColor = "#ffffff";
            swatch.classList.add("is-empty");
            swatch.innerHTML = "<span>+</span>";

            nameElement.textContent = "SELECT COLOR";

            return;

        }


        swatch.style.backgroundColor = node.color;
        swatch.classList.remove("is-empty");
        swatch.innerHTML = "";

        nameElement.textContent = node.name.toUpperCase();

    }


    function updateResultPanel(node) {

        mixingResultSwatch.style.backgroundColor = node.color;
        mixingResultSwatch.classList.remove("is-empty");

        mixingResultName.textContent = node.name.toUpperCase();

        mixingResultGeneration.textContent =
            node.generation === 0
                ? "PRIMARY COLOR"
                : `GENERATION ${node.generation}`;

        recipeCyan.textContent = formatPercentage(node.c);
        recipeMagenta.textContent = formatPercentage(node.m);
        recipeYellow.textContent = formatPercentage(node.y);
        recipeBlack.textContent = formatPercentage(node.k);

    }


    function clearResultPanel() {

        mixingResultSwatch.style.backgroundColor = "#ffffff";
        mixingResultSwatch.classList.add("is-empty");

        mixingResultName.textContent = "WAITING FOR TWO COLORS";
        mixingResultGeneration.textContent = "—";

        recipeCyan.textContent = "—";
        recipeMagenta.textContent = "—";
        recipeYellow.textContent = "—";
        recipeBlack.textContent = "—";

    }


    function formatPercentage(value) {

        return `${Number(value.toFixed(1))}%`;

    }


    // ==========================================
    // HIGHLIGHT FAMILY
    // ==========================================

    function highlightNodeFamily(node) {

        const connectedIds = new Set([node.id]);


        links.forEach(function (link) {

            const sourceId = getNodeId(link.source);
            const targetId = getNodeId(link.target);


            if (sourceId === node.id) {

                connectedIds.add(targetId);

            }


            if (targetId === node.id) {

                connectedIds.add(sourceId);

            }

        });


        nodeLayer
            .selectAll(".genealogy-node")
            .classed(
                "is-muted",
                function (candidate) {
                    return !connectedIds.has(candidate.id);
                }
            );


        linkLayer
            .selectAll(".genealogy-link")
            .classed(
                "is-active",
                function (link) {

                    return (
                        getNodeId(link.source) === node.id ||
                        getNodeId(link.target) === node.id
                    );

                }
            );

    }


    function resetNodeHighlight() {

        nodeLayer
            .selectAll(".genealogy-node")
            .classed("is-muted", false);


        linkLayer
            .selectAll(".genealogy-link")
            .classed("is-active", false);

    }


    function pulseExistingNode(nodeId) {

        nodeLayer
            .selectAll(".genealogy-node")
            .filter(function (node) {
                return node.id === nodeId;
            })
            .raise()
            .transition()
            .duration(180)
            .attr(
                "transform",
                function (node) {
                    return `translate(${node.x}, ${node.y}) scale(1.25)`;
                }
            )
            .transition()
            .duration(260)
            .attr(
                "transform",
                function (node) {
                    return `translate(${node.x}, ${node.y}) scale(1)`;
                }
            );

    }


    // ==========================================
    // TOOLTIP
    // ==========================================

    function showTooltip(event, node) {

        const parentOne = nodes.find(function (candidate) {
            return candidate.id === node.parentOne;
        });

        const parentTwo = nodes.find(function (candidate) {
            return candidate.id === node.parentTwo;
        });


        const parentsText =
            node.generation === 0
                ? "Original CMYK color"
                : `${parentOne ? parentOne.name : "Unknown"} + ${parentTwo ? parentTwo.name : "Unknown"}`;


        tooltip
            .html(
                `
                    <strong>${node.name}</strong>
                    <span>${parentsText}</span>
                    <span>Generation ${node.generation}</span>
                    <span>C ${formatPercentage(node.c)} · M ${formatPercentage(node.m)}</span>
                    <span>Y ${formatPercentage(node.y)} · K ${formatPercentage(node.k)}</span>
                    <span>${node.color}</span>
                `
            )
            .classed("is-visible", true);


        moveTooltip(event);

    }


    function moveTooltip(event) {

        if (
            !event ||
            event.clientX === undefined
        ) {

            return;

        }


        const tooltipNode = tooltip.node();

        const width = tooltipNode.offsetWidth;
        const height = tooltipNode.offsetHeight;

        const gap = 14;

        let left = event.clientX + gap;
        let top = event.clientY + gap;


        if (
            left + width >
            window.innerWidth - 10
        ) {

            left =
                event.clientX -
                width -
                gap;

        }


        if (
            top + height >
            window.innerHeight - 10
        ) {

            top =
                event.clientY -
                height -
                gap;

        }


        tooltip
            .style(
                "left",
                `${Math.max(10, left)}px`
            )
            .style(
                "top",
                `${Math.max(10, top)}px`
            );

    }


    function hideTooltip() {

        tooltip.classed("is-visible", false);

    }


    // ==========================================
    // DRAGGING
    // ==========================================

    function createNodeDrag() {

        return d3
            .drag()

            .on("start", function (event, node) {

                event.sourceEvent.stopPropagation();


                if (!event.active) {

                    simulation
                        .alphaTarget(0.25)
                        .restart();

                }


                node.fx = node.x;
                node.fy = node.y;

            })

            .on("drag", function (event, node) {

                node.fx = event.x;
                node.fy = event.y;

            })

            .on("end", function (event, node) {

                if (!event.active) {

                    simulation.alphaTarget(0);

                }


                // Keep primaries fixed.
                if (node.generation === 0) {

                    const primaryPosition =
                        PRIMARY_POSITIONS[node.id];


                    node.fx = primaryPosition.x;
                    node.fy = primaryPosition.y;

                    return;

                }


                node.fx = null;
                node.fy = null;

            });

    }


    // ==========================================
    // TICK
    // ==========================================

    function updatePositions() {

        nodes.forEach(function (node) {

            const radius = getNodeRadius(node);

            node.x = Math.max(
                radius + 18,
                Math.min(
                    SVG_WIDTH - radius - 18,
                    node.x
                )
            );

            node.y = Math.max(
                radius + 18,
                Math.min(
                    SVG_HEIGHT - radius - 35,
                    node.y
                )
            );

        });


        linkLayer
            .selectAll(".genealogy-link")
            .attr("x1", function (link) {

                const source = getNodeObject(link.source);
                return source ? source.x : 0;

            })
            .attr("y1", function (link) {

                const source = getNodeObject(link.source);
                return source ? source.y : 0;

            })
            .attr("x2", function (link) {

                const target = getNodeObject(link.target);
                return target ? target.x : 0;

            })
            .attr("y2", function (link) {

                const target = getNodeObject(link.target);
                return target ? target.y : 0;

            });


        nodeLayer
            .selectAll(".genealogy-node")
            .attr(
                "transform",
                function (node) {
                    return `translate(${node.x}, ${node.y})`;
                }
            );

    }


    // ==========================================
    // HELPERS
    // ==========================================

    function getNodeId(nodeOrId) {

        return typeof nodeOrId === "object"
            ? nodeOrId.id
            : nodeOrId;

    }


    function getNodeObject(nodeOrId) {

        if (typeof nodeOrId === "object") {

            return nodeOrId;

        }


        return nodes.find(function (node) {
            return node.id === nodeOrId;
        });

    }


    function getReadableTextColor(hexColor) {

        const rgb = hexToRgb(hexColor);

        const luminance =
            (
                0.299 * rgb.r +
                0.587 * rgb.g +
                0.114 * rgb.b
            ) / 255;


        return luminance > 0.58
            ? "#111111"
            : "#ffffff";

    }


    // ==========================================
    // RESET
    // ==========================================

    resetButton.addEventListener(
        "click",
        function () {

            nodes = nodes
                .filter(function (node) {
                    return node.generation === 0;
                })
                .map(function (node) {

                    const position =
                        PRIMARY_POSITIONS[node.id];

                    return {
                        ...node,
                        x: position.x,
                        y: position.y,
                        fx: position.x,
                        fy: position.y
                    };

                });


            links = [];
            selectedNodes = [];
            latestCreatedNodeId = null;
            mixCounter = 0;


            clearResultPanel();
            updateSelectionPanel();


            simulation.stop();
            createSimulation();
            render();


            svg
                .transition()
                .duration(450)
                .call(
                    zoomBehavior.transform,
                    d3.zoomIdentity
                );

        }
    );


    // Click empty canvas to clear current selections.
    svg.on("click", function () {

        selectedNodes = [];
        latestCreatedNodeId = null;

        updateSelectionPanel();
        renderNodes();

    });

})();
