import {
  Home,
  UserPlus,
  Music,
  Image,
  Disc,
  PlusSquare,
  Radio,
} from "lucide-react";
//侧边栏遍历
export const sidebarLinks = [
  {
    imgURL: Home,
    route: "/",
    label: "首页",
  },
  {
    imgURL: Music,
    route: "/musicGenerator",
    label: "音乐生成器",
  },
  {
    imgURL: Image,
    route: "/imageGenerator",
    label: "图片生成器",
  },
  {
    imgURL: PlusSquare,
    route: "/musicGenerator/pricing",
    label: "定价",
  },
];

// 音乐生成器侧边栏链接
export const musicSidebarLinks = [
  {
    id: "inspiration",
    icon: Music,
    label: "灵感音乐",
    route: "/musicGenerator",
  },
  {
    id: "custom",
    icon: Disc,
    label: "自定义音乐",
    route: "/musicGenerator/custom",
  },
  {
    id: "radio",
    icon: Radio,
    label: "纯音乐",
    route: "/musicGenerator/instrumental",
  },
  // {
  //   id: 'custom',
  //   icon: Disc,
  //   label: '自定义音乐',
  //   route: '/musicGenerator/custom',
  // },
  // {
  //   id: 'radio',
  //   icon: Radio,
  //   label: '纯音乐',
  //   route: '/musicGenerator/radio',
  // },
  // {
  //   id: 'lyrics',
  //   icon: FileText,
  //   label: '音乐歌词',
  //   route: '/musicGenerator/lyrics',
  // },
  {
    id: "myGenerates",
    icon: PlusSquare,
    label: "查看我的生成",
    route: "/musicGenerator/myGenerate",
  },
  {
    id: "pricing",
    icon: Disc,
    label: "订阅",
    route: "/musicGenerator/pricing",
  },
  {
    id: "account",
    icon: UserPlus,
    label: "账号",
    route: "/musicGenerator/account",
  },
];
