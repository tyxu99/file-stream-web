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
    name: "D3",
    path: "/D3",
  },
  {
    name: "P5",
    path: "/P5",
  },
  {
    name: "Sigma",
    path: "/Sigma",
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
