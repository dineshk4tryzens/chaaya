import { type PropsWithChildren } from "react";

export const NavBar = ({ children }: PropsWithChildren) => (
  <div
    className={`sticky top-0 flex w-full mx-auto my-5 max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4 rounded-xl shadow-md backdrop-saturate-200 bg-opacity-80
   backdrop-blur-md bg-white/10 z-20 dark:text-white`}
  >
    <span className="inline-flex w-full flex-row flex-nowrap items-center gap-1.5">
      {children}
    </span>
  </div>
);
