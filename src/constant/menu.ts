const menu = [
  {
    name: "home",
    path: "/home",
  },
  {
    name: "grid",
    path: "/grid",
  },
  {
    name: "greedSnake",
    path: "/greedSnake",
  },
  {
    name: "tetris",
    path: "/tetris",
  },
  {
    name: "chat",
    path: "/chat",
  },
  {
    name: "map",
    path: "/map",
    routes: [
      {
        path: "/map/leaflet",
        name: "leaflet",
      },
      {
        path: "/map/openlayer",
        name: "openlayer",
      },
    ],
  },
  {
    name: "graph",
    path: "/graph",
    routes: [
      {
        name: "Sigma",
        path: "/graph/Sigma",
      },
      {
        name: "D3",
        path: "/graph/D3",
      },
      {
        name: "P5",
        path: "/graph/P5",
      },
      {
        path: "/graph/bezier",
        name: "bezier canvas",
      },
      {
        path: "/graph/DND",
        name: "drag and drop",
      },
      {
        name: "svg-bezier",
        path: "/graph/svg-bezier",
      },
      {
        name: "canvas curve",
        path: "/graph/CanvasCurve",
      },
      {
        name: "DragAndDrop",
        path: "/graph/DragAndDrop",
      },
      {
        name: "SvgPanZoom",
        path: "/graph/SvgPanZoom",
      },
    ],
  },
];

export default menu;
