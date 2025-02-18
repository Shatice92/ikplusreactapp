import { Suspense } from "react";
import RouterPage from "../routerpage";

const Router = () => {
  return (
    <Suspense fallback={null}>
      <RouterPage />
    </Suspense>
  );
};

export default Router;
