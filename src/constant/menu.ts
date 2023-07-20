const menu = [
  {
    name: "首页",
    path: "/home",
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
  {
    name: "售卖管理",
    path: "/sell",
    icon: "shopping",
    routes: [
      {
        name: "商品管理",
        path: "/sell/product",
      },
      {
        name: "新建商品",
        path: "/sell/newProduct",
      },
      {
        name: "专辑管理",
        path: "/sell/album",
      },
      {
        name: "营销活动",
        path: "/sell/marketing",
      },
      {
        name: "新建营销活动",
        path: "/sell/marketing/new",
      },
      {
        name: "新建专辑",
        path: "/sell/newAlbum",
      },
      {
        name: "编辑专辑单品",
        path: "/sell/editAlbumProduct",
      },
    ],
  },
  {
    name: "订单管理",
    path: "/order",
    routes: [
      {
        name: "商品订单",
        path: "/order/product",
      },
      {
        name: "订单详情",
        path: "/order/detail",
      },
    ],
  },
  {
    name: "推荐管理",
    path: "/recommend",
    routes: [
      {
        path: "/recommend/banner",
        name: "BANNER推荐",
      },
      {
        path: "/recommend/homeList",
        name: "首页列表推荐",
      },
    ],
  },
  {
    name: "权限管理",
    path: "/manage",
    routes: [
      {
        path: "/manage/role",
        name: "角色管理",
      },
      {
        path: "/manage/role/createRole",
        name: "创建角色",
      },
      {
        path: "/manage/role/editMember",
        name: "编辑成员",
      },
    ],
  },
  {
    name: "空投管理",
    path: "/airdrop",
    routes: [
      {
        path: "/airdrop/list",
        name: "空投品列表",
      },
      {
        path: "/airdrop/create",
        name: "创建空投品",
      },
      {
        path: "/airdrop/activityList",
        name: "空投活动列表",
      },
    ],
  },
  {
    name: "转赠管理",
    path: "/send",
    routes: [
      {
        path: "/send/list",
        name: "转赠列表",
      },
      {
        name: "转赠控制",
        path: "/send/control",
      },
    ],
  },
  {
    name: "部落管理",
    path: "/tribe",
    routes: [
      {
        path: "/tribe/list",
        name: "部落列表",
      },
      {
        name: "新建部落",
        path: "/tribe/newTribe",
      },
      {
        name: "编辑部落资产",
        path: "/tribe/tribeAssets",
      },
    ],
  },
  {
    name: "实物权益管理",
    path: "/material_object",
    routes: [
      {
        path: "/material_object/list",
        name: "实物品类",
      },
      {
        name: "实物订单",
        path: "/material_object/order_list",
      },
    ],
  },
  {
    name: "消息管理",
    path: "/message_manage",
    routes: [
      {
        path: "/message_manage/stationLetter",
        name: "站内信",
      },
      {
        path: "/message_manage/StationLetter/NewStationLetter",
        name: "新建站内信",
      },
    ],
  },
];

export default menu;
