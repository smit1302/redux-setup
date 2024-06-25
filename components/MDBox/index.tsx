import { forwardRef, ForwardedRef } from "react";

// Import the custom styled component
import MDBoxRoot from "./MDBoxRoot";


interface MDBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  mx?: any;
  mt?: any;
  py?: any;
  px?: any;
  variant?: "contained" | "gradient";
  bgColor?: any; // Consider using a more specific type
  color?: any; // Consider using a more specific type
  opacity?: number;
  borderRadius?: any; // Consider using a more specific type
  shadow?: any; // Consider using a more specific type
  coloredShadow?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "none";
}

const MDBox = forwardRef(({
    variant = "gradient",
    bgColor = "transparent",
    color = "dark",
    opacity = 1,
    borderRadius = "none",
    shadow = "none",
    coloredShadow = "none",
    ...rest
  }:any, ref: any) => (
    <MDBoxRoot
      {...rest}
      ref={ref}
      ownerState={{ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow }}
    />
));

export default MDBox;