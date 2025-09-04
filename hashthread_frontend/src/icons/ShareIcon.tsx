import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#999"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 5.5H4l6.154 5.94M20 5.5l-8.205 14-1.641-8.06M20 5.5l-9.846 5.94"
    />
  </svg>
);
export default SvgComponent;
