import { Search, Home, Heart, Users, UserPlus, LogOut } from 'lucide-react'
export const sidebarLinks = [
  {
    imgURL: Home,
    route: "/",
    label: "Home",
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
    imgURL: Users,
    route: "/create-thread",
    label: "Create Thread",
  },
  {
    imgURL: UserPlus,
    route: "/create-community",
    label: "Create Community",
  },
];
export const ProfileTabs = [
  {
    value: "threads",
    icon: UserPlus,
    label: "Threads",
    route: "/profile/threads",
  },
  {
    value: "replies",
    icon: Users,
    label: "Replies",
    route: "/profile/replies",
  },
  {
    value: "tagged",
    icon: Heart,
    label: "Tagged",
    route: "/profile/tagged",
  },
];

export const CommunitiesTabs = [
  {
    value: "threads",
    icon: Users,
    label: "Threads",
    route: "/communities/threads",
  },
  {
    value: "members",
    icon: Users,
    label: "Members",
    route: "/communities/members",
  },
  {
    value: "activity",
    icon: LogOut,
    label: "Activity",
    route: "/communities/activity",
  },
];
