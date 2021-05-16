import Dashboard from "views/Dashboard/Dashboard.jsx";
import ErrorPage from "views/Pages/ErrorPage.jsx";
import LockScreenPage from "views/Pages/LockScreenPage.jsx";
import LoginPage from "views/Pages/LoginPage.jsx";
import LogoutPage from "views/Pages/LogoutPage.jsx";
import UserProfile from "views/Pages/UserProfile.jsx";

import SportsPage from "views/Pages/SportsPage.jsx";
import GameStylesPage from "views/Pages/GameStylesPage.jsx";
import UsersPage from "views/Pages/UsersPage.jsx";
import ConfigurationsPage from "views/Pages/ConfigurationsPage.jsx";

import NflPositionsPage from "views/Pages/Nfl/PositionsPage.jsx";
import NflGamesPage from "views/Pages/Nfl/GamesPage.jsx";

import NbaPositionsPage from "views/Pages/Nba/PositionsPage.jsx";
import NbaGamesPage from "views/Pages/Nba/GamesPage.jsx";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";

import { StarRate, SettingsApplications, People, Flag, SportsFootball, SportsBasketball } from "@material-ui/icons";

var dashRoutes = [
  {
    path: "/login",
    name: "Login Page",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: LoginPage,
    layout: "/auth"
  },
  {
    path: "/logout",
    name: "Logout Page",
    rtlName: "هعذاتسجيل الدخول",
    mini: "L",
    rtlMini: "هعذا",
    component: LogoutPage,
    layout: "/auth"
  },
  {
    path: "/lock-screen",
    name: "Lock Screen Page",
    rtlName: "اقفل الشاشة",
    mini: "LS",
    rtlMini: "هذاع",
    component: LockScreenPage,
    layout: "/auth"
  },
  {
    path: "/user",
    name: "My Profile",
    rtlName: "ملف تعريفي للمستخدم",
    mini: "UP",
    rtlMini: "شع",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/error",
    name: "Error Page",
    rtlName: "صفحة الخطأ",
    mini: "E",
    rtlMini: "البريد",
    component: ErrorPage,
    layout: "/auth"
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
    showInAdminSidebar: true
  },
  {
  collapse: true,
  name: "NFL",
  icon: SportsFootball,
  state: "nflGamesCollapse",
  layout: "/admin",
  showInAdminSidebar: true,
  views: [
    {
      path: "/nfl/games",
      name: "Games",
      mini: "G",
      component: NflGamesPage,
      layout: "/admin",
      showInAdminSidebar: true
    },
    {
      path: "/nfl/positions",
      name: "Positions",
      mini: "P",
      component: NflPositionsPage,
      layout: "/admin",
      showInAdminSidebar: true
    },
  ]
  },
  {
  collapse: true,
  name: "NBA",
  icon: SportsBasketball,
  state: "nbaGamesCollapse",
  layout: "/admin",
  showInAdminSidebar: true,
  views: [
    {
      path: "/nba/games",
      name: "Games",
      mini: "G",
      component: NbaGamesPage,
      layout: "/admin",
      showInAdminSidebar: true
    },
    {
      path: "/nba/positions",
      name: "Positions",
      mini: "P",
      component: NbaPositionsPage,
      layout: "/admin",
      showInAdminSidebar: true
    },
  ]
  },
  {
    path: "/sports",
    name: "Sports",
    icon: StarRate,
    component: SportsPage,
    layout: "/admin",
    showInAdminSidebar: true
  },
  {
    path: "/game-styles",
    name: "Game Styles",
    icon: Flag,
    component: GameStylesPage,
    layout: "/admin",
    showInAdminSidebar: true
  },
  {
    path: "/all-users",
    name: "Users",
    icon: People,
    component: UsersPage,
    layout: "/admin",
    showInAdminSidebar: true
  },
  {
    path: "/configurations",
    name: "Configurations",
    icon: SettingsApplications,
    component: ConfigurationsPage,
    layout: "/admin",
    showInAdminSidebar: true
  }
];
export default dashRoutes;
