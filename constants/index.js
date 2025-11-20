import {
  Search,
  Home,
  Heart,
  UserPlus,
  Music,
  Image,
} from "lucide-react";
//侧边栏遍历
export const sidebarLinks = [
  {
    imgURL: Home,
    route: "/",
    label: "Home",
  },
  {
    imgURL: Music,
    route: "/musicGenerator",
    label: "MusicGenerator",
  },
  {
    imgURL: Image,
    route: "/imageGenerator",
    label: "ImageGenerator",
  },
  {
    imgURL: Search,
    route: "/search",
    label: "Search",
  },
  {
    imgURL: Heart,
    route: "/activity",
    label: "Activity",
  },

  {
    imgURL: UserPlus,
    route: "/community",
    label: "Community",
  },
];
