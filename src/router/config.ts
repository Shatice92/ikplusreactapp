interface RouteItem {
  path: string;
  component: string;
}

const routes: RouteItem[] = [
  {
    path: "/",
    component: "Home",
  },
];

export default routes;
