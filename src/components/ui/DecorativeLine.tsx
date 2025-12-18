import { cn } from "@/lib/utils/cn";

type DecorativeLineProps = {
  className?: string;
  title?: string;
};

export function DecorativeLine({ className, title }: DecorativeLineProps) {
  return (
    <svg
      viewBox="0 0 387 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
      className={cn("w-full h-auto", className)}
      role="img"
      aria-label={title ?? "Decorative line"}
    >
      <path
        d="M333.87 73.8186C345.86 73.8186 355.58 64.0987 355.58 52.1086C355.58 40.1185 345.86 30.3986 333.87 30.3986C321.88 30.3986 312.16 40.1185 312.16 52.1086C312.16 64.0987 321.88 73.8186 333.87 73.8186Z"
        stroke="#9DACFD"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />

      <path
        d="M333.87 52.1087H15.3C7.4 52.1087 1 45.7087 1 37.8087C1 29.9087 7.4 23.5087 15.3 23.5087H28.95"
        stroke="#9DACFD"
        strokeWidth="2"
        strokeMiterlimit="10"
        vectorEffect="non-scaling-stroke"
      />

      <path
        d="M333.87 58.5186C337.41 58.5186 340.28 55.6488 340.28 52.1086C340.28 48.5685 337.41 45.6986 333.87 45.6986C330.33 45.6986 327.46 48.5685 327.46 52.1086C327.46 55.6488 330.33 58.5186 333.87 58.5186Z"
        fill="#C7D2FF"
      />
    </svg>
  );
}
