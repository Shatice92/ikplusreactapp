interface RouteItem {
  path: string;
  component: string;
}

const routes: RouteItem[] = [
  {
    path: "/homepage",
    component: "Home",
  },
];

export default routes;
