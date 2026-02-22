let cy;
let isTraversing = false;
let dfsStack = [];
function isWeightedGraph() {
  return cy.edges().some((e) => e.data("weight") !== 1);
}
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("collapsed");

  // Resize Cytoscape so graph fills space
  setTimeout(() => {
    if (cy) cy.resize();
  }, 260);
});
// Default edge list (used when textarea is empty)
const DEFAULT_EDGES = [
  [21, 47],
  [4, 41],
  [2, 41],
  [36, 42],
  [32, 45],
  [26, 28],
  [32, 44],
  [5, 41],
  [29, 44],
  [10, 46],
  [1, 6],
  [7, 42],
  [46, 49],
  [17, 46],
  [32, 35],
  [11, 48],
  [37, 48],
  [37, 43],
  [8, 41],
  [16, 22],
  [41, 43],
  [11, 27],
  [22, 44],
  [22, 28],
  [18, 37],
  [5, 11],
  [18, 46],
  [22, 48],
  [1, 17],
  [2, 32],
  [21, 37],
  [7, 22],
  [23, 41],
  [30, 39],
  [6, 41],
  [10, 22],
  [36, 41],
  [22, 25],
  [1, 12],
  [2, 11],
  [45, 46],
  [2, 22],
  [1, 38],
  [47, 50],
  [11, 15],
  [2, 37],
  [1, 43],
  [30, 45],
  [4, 32],
  [28, 37],
  [1, 21],
  [23, 37],
  [5, 37],
  [29, 40],
  [6, 42],
  [3, 11],
  [40, 42],
  [26, 49],
  [41, 50],
  [13, 41],
  [20, 47],
  [15, 26],
  [47, 49],
  [5, 30],
  [4, 42],
  [10, 30],
  [6, 29],
  [20, 42],
  [4, 37],
  [28, 42],
  [1, 16],
  [8, 32],
  [16, 29],
  [31, 47],
  [15, 47],
  [1, 5],
  [7, 37],
  [14, 47],
  [30, 48],
  [1, 10],
  [26, 43],
  [15, 46],
  [42, 45],
  [18, 42],
  [25, 42],
  [38, 41],
  [32, 39],
  [6, 30],
  [29, 33],
  [34, 37],
  [26, 38],
  [3, 22],
  [18, 47],
  [42, 48],
  [22, 49],
  [26, 34],
  [22, 36],
  [29, 36],
  [11, 25],
  [41, 44],
  [6, 46],
  [13, 22],
  [11, 16],
  [10, 37],
  [42, 43],
  [12, 32],
  [1, 48],
  [26, 40],
  [22, 50],
  [17, 26],
  [4, 22],
  [11, 14],
  [26, 39],
  [7, 11],
  [23, 26],
  [1, 20],
  [32, 33],
  [30, 33],
  [1, 25],
  [2, 30],
  [2, 46],
  [26, 45],
  [47, 48],
  [5, 29],
  [3, 37],
  [22, 34],
  [20, 22],
  [9, 47],
  [1, 4],
  [36, 46],
  [30, 49],
  [1, 9],
  [3, 26],
  [25, 41],
  [14, 29],
  [1, 35],
  [23, 42],
  [21, 32],
  [24, 46],
  [3, 32],
  [9, 42],
  [33, 37],
  [7, 30],
  [29, 45],
  [27, 30],
  [1, 7],
  [33, 42],
  [17, 47],
  [12, 47],
  [19, 41],
  [3, 42],
  [24, 26],
  [20, 29],
  [11, 23],
  [22, 40],
  [9, 37],
  [31, 32],
  [23, 46],
  [11, 38],
  [27, 29],
  [17, 37],
  [23, 30],
  [14, 42],
  [28, 30],
  [29, 31],
  [1, 8],
  [1, 36],
  [42, 50],
  [21, 41],
  [11, 18],
  [39, 41],
  [32, 34],
  [6, 37],
  [30, 38],
  [21, 46],
  [16, 37],
  [22, 24],
  [17, 32],
  [23, 29],
  [3, 30],
  [8, 30],
  [41, 48],
  [1, 39],
  [8, 47],
  [30, 44],
  [9, 46],
  [22, 45],
  [7, 26],
  [35, 42],
  [1, 27],
  [17, 30],
  [20, 46],
  [18, 29],
  [3, 29],
  [4, 30],
  [3, 46],
];

function parseInputEdges() {
  const textarea = document.getElementById("edges");
  if (!textarea) return [];

  const lines = textarea.value.split(/\n+/);
  const parsed = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 2) continue;

    const u = Number(parts[0]);
    const v = Number(parts[1]);
    if (Number.isFinite(u) && Number.isFinite(v)) {
      parsed.push([u, v]);
    }
  }

  return parsed;
}

function renderGraph() {
  // Prefer user-provided edges; fallback to defaults
  const inputEdges = parseInputEdges();
  const edges = inputEdges.length ? inputEdges : DEFAULT_EDGES;
  const elements = [];
  const nodes = new Set();

  // Build nodes + edges
  edges.forEach(([u, v], i) => {
    nodes.add(u);
    nodes.add(v);

    elements.push({
      data: { id: `e${i}`, source: `${u}`, target: `${v}` },
    });
  });

  nodes.forEach((n) => {
    elements.push({
      data: { id: `${n}` },
    });
  });

  if (cy) cy.destroy();

  cy = cytoscape({
    container: document.getElementById("cy"),
    elements,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#1f77b4",
          label: "data(id)",
          color: "#fff",
          "font-size": 9,
          width: 28,
          height: 28,
          "text-valign": "center",
          "text-halign": "center",
        },
      },
      {
        selector: "edge",
        style: {
          width: 1.5,
          "line-color": "#9e9e9e",
          "target-arrow-shape": "triangle",
          "target-arrow-color": "#333",
          "target-arrow-scale": 1.3,
          "curve-style": "bezier",
          "target-distance-from-node": 3,
          opacity: 0.65,
        },
      },
      {
        selector: ".faded",
        style: {
          opacity: 0.08,
        },
      },
      {
        selector: ".highlighted",
        style: {
          "background-color": "#ff7f0e",
          "line-color": "#ff7f0e",
          "target-arrow-color": "#ff7f0e",
          opacity: 1,
        },
      },
      {
        selector: ".visited",
        style: {
          "background-color": "#2ca02c",
          opacity: 1,
        },
      },
      {
        selector: ".active",
        style: {
          "background-color": "#ff7f0e",
          opacity: 1,
        },
      },
      {
        selector: ".traversed",
        style: {
          "line-color": "#2ca02c",
          "target-arrow-color": "#2ca02c",
          width: 3,
          opacity: 1,
        },
      },
    ],
    layout: {
      name: "cose",
      animate: false,
      animationDuration: 1000,

      nodeRepulsion: 20000, // push nodes apart
      nodeOverlap: 10,
      idealEdgeLength: 180, // longer edges = less clutter
      edgeElasticity: 200,
      gravity: 0.25,
      numIter: 2500,
      padding: 50,
    },
  });

  // Register interactions after cy is initialized
  cy.on("mouseover", "node", (evt) => {
    if (isTraversing) return; // Don't highlight during traversal
    const node = evt.target;

    // Get node + neighbors (nodes + edges)
    const neighborhood = node.neighborhood().add(node);

    // Fade everything
    cy.elements().addClass("faded");

    // Highlight hovered area
    neighborhood.removeClass("faded").addClass("highlighted");
  });

  cy.on("mouseout", "node", () => {
    if (isTraversing) return; // Don't reset during traversal
    // Reset everything
    cy.elements().removeClass("faded highlighted");
  });

  let lockedNode = null;

  cy.on("tap", "node", (evt) => {
    const node = evt.target;
    lockedNode = node;

    const neighbors = node.neighborhood("node");
    const edges = node.connectedEdges();

    // Highlight logic
    cy.elements().addClass("faded");
    node.removeClass("faded").addClass("highlighted");
    neighbors.removeClass("faded").addClass("highlighted");
    edges.removeClass("faded").addClass("highlighted");

    // Degree
    const inDegree = node.indegree();
    const outDegree = node.outdegree();
    const totalDegree = node.degree();

    // Build info text
    let html = `
    <b>Node:</b> ${node.id()}<br/>
    <b>Total Degree:</b> ${totalDegree}<br/>
    <b>In Degree:</b> ${inDegree}<br/>
    <b>Out Degree:</b> ${outDegree}<br/>
    <b>Connections:</b><br/>
  `;

    neighbors.forEach((n) => {
      html += `- ${n.id()}<br/>`;
    });

    document.getElementById("details").innerHTML = html;
  });
}

function showPopup(message, type = "") {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.classList.remove("hidden");
}
function hidePopup(delay = 1500) {
  setTimeout(() => {
    document.getElementById("popup").classList.add("hidden");
  }, delay);
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateTraversalStateTitle(text) {
  document.getElementById("state-title").textContent = text;
}

function updateStateBox(items) {
  const box = document.getElementById("state-box");
  if (!items || items.length === 0) {
    box.innerHTML = "<em>Empty</em>";
    return;
  }
  box.innerHTML = items
    .map((x) => `<div class="state-item">${x}</div>`)
    .join("");
}

function clearStateBox() {
  document.getElementById("state-box").innerHTML = "<em>Idle</em>";
}

function resetTraversal() {
  cy.elements().removeClass("visited active traversed faded highlighted");
}

async function runBFS() {
  console.log("Running BFS...");
  isTraversing = true;

  resetTraversal();

  const startId = document.getElementById("startNode").value.trim();
  const start = cy.getElementById(startId);

  if (!start || !start.nonempty()) {
    alert("Start node not found!");
    return;
  }

  // Show popup with starting node
  showPopup(`Starting BFS from node ${startId}`, "info");
  hidePopup(1200);

  const visited = new Set();
  const queue = [];

  updateTraversalStateTitle("BFS Queue (front → back)");
  updateStateBox(queue.map((n) => n.id()));

  queue.push(start);
  visited.add(start.id());
  console.log(`Starting BFS from node ${start.id()}`);

  while (queue.length > 0) {
    const node = queue.shift();
    updateStateBox(queue.map((n) => n.id()));

    // Highlight active node
    node.addClass("active");
    await sleep(700);

    node.removeClass("active").addClass("visited");

    node.outgoers("edge").forEach((edge) => {
      const nextNode = edge.target();

      if (!visited.has(nextNode.id())) {
        visited.add(nextNode.id());
        queue.push(nextNode);
        updateStateBox(queue.map((n) => n.id()));
        edge.addClass("traversed");
      }
    });
  }
  isTraversing = false;
  clearStateBox();
  updateTraversalStateTitle("Traversal State");
  showPopup("BFS Complete!", "success");
  hidePopup(2000);
}

async function runDFS() {
  console.log("Running DFS...");
  isTraversing = true;
  resetTraversal();
  dfsStack = [];
  updateTraversalStateTitle("DFS Stack (top → bottom)");
  updateStateBox([]);

  const startId = document.getElementById("startNode").value.trim();
  const start = cy.getElementById(startId);

  if (!start || !start.nonempty()) {
    alert("Start node not found!");
    return;
  }

  // Show popup with starting node
  showPopup(`Starting DFS from node ${startId}`, "info");
  hidePopup(1700);

  const visited = new Set();
  await dfsVisit(start, visited);

  isTraversing = false;
  clearStateBox();
  updateTraversalStateTitle("Traversal State");
  showPopup("DFS Complete!", "success");
  hidePopup(2000);
}

async function dfsVisit(node, visited) {
  visited.add(node.id());
  dfsStack.push(node.id());
  updateStateBox([...dfsStack].reverse());

  node.addClass("active");
  await sleep(700);
  node.removeClass("active").addClass("visited");

  for (const edge of node.outgoers("edge")) {
    const nextnode = edge.target();

    if (!visited.has(nextnode.id())) {
      edge.addClass("traversed");
      await dfsVisit(nextnode, visited);
    }
  }
  dfsStack.pop();
  updateStateBox([...dfsStack].reverse());
}

// Auto-render on load
renderGraph();
