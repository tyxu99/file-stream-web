const menu = [
  {
    name: "首页",
    path: "/home",
  },
  {
    name: "grid",
    path: "/grid",
  },
  {
    name: "账户管理",
    path: "/user",
    routes: [
      {
        path: "/user/list",
        name: "账户列表",
      },
      {
        name: "用户详情",
        path: "/user/info/:id",
      },
      {
        name: "创建用户",
        path: "/user/create",
      },
    ],
  },
  {
    name: "藏品管理",
    path: "/collection",
    routes: [
      {
        path: "/collection/list",
        name: "藏品列表",
        exact: true,
        access: "collect_manage_menu",
      },
      {
        path: "/collection/info",
        name: "藏品详情",
      },
      {
        path: "/collection/upload",
        name: "藏品上传",
      },
      {
        path: "/collection/record-query",
        name: "流转记录查询",
      },
    ],
  },
];

export default menu;
