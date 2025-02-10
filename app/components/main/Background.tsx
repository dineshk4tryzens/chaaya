import { BackgroundProps } from "~/types";

export default function MainBackground({ children, theme }: BackgroundProps) {
  return (
    <div
      className={`flex h-screen flex-col bg-image-light bg-cover fixed overflow-y-scroll inset-0 z-10 transition-opacity duration-[750ms] ease-in-out opacity-95 visible bg-bottom md:bg-[cover] dark:bg-image-dark max-md:${
        theme !== "dark" ? "bg-x-0 bg-200-100" : "bg-x-10 bg-170-100"
      }`}
    >{children}</div>
  );
}
