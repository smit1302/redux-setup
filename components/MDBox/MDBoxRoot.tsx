// Import necessary elements from @mui/material
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material/styles/createTheme";

// Define an interface for the ownerState to ensure type safety
interface OwnerState {
  variant?: 'gradient';
  bgColor?: string;
  color?: string;
  opacity?: number;
  borderRadius?: string;
  shadow?: string;
  coloredShadow?: string;
}

// Extend the Box component with styled API, using the defined interface for ownerState
export default styled(Box)<{ theme: Theme; ownerState: OwnerState }>(({ theme, ownerState }) => {
  
  const { palette, functions, borders, boxShadows } :any= theme;
  const { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow }:any = ownerState;

  const { gradients, grey, white } = palette;
  const { linearGradient } = functions;
  const { borderRadius: radius } = borders;
  const { colored } = boxShadows;

  const greyColors :any= {
    "grey-100": grey[100],
    "grey-200": grey[200],
    "grey-300": grey[300],
    "grey-400": grey[400],
    "grey-500": grey[500],
    "grey-600": grey[600],
    "grey-700": grey[700],
    "grey-800": grey[800],
    "grey-900": grey[900],
  };

  const validGradients = [
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ];

  const validColors = [
    "transparent",
    "white",
    "black",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
    "text",
    "grey-100",
    "grey-200",
    "grey-300",
    "grey-400",
    "grey-500",
    "grey-600",
    "grey-700",
    "grey-800",
    "grey-900",
  ];

  const validBorderRadius = ["xs", "sm", "md", "lg", "xl", "xxl", "section"];
  const validBoxShadows = ["xs", "sm", "md", "lg", "xl", "xxl", "inset"];

  // background value
  let backgroundValue = bgColor;

  if (variant === "gradient") {
    backgroundValue = validGradients.includes(bgColor ?? '')
      ? linearGradient(gradients[bgColor].main, gradients[bgColor].state)
      : white.main;
  } else if (validColors.includes(bgColor ?? '')) {
    backgroundValue = palette[bgColor] ? palette[bgColor].main : greyColors[bgColor] ?? bgColor;
  } else {
    backgroundValue = bgColor;
  }

  // color value
  let colorValue = color;

  if (validColors.includes(color ?? '')) {
    colorValue = palette[color] ? palette[color].main : greyColors[color] ?? color;
  }

  // borderRadius value
  let borderRadiusValue = borderRadius;

  if (validBorderRadius.includes(borderRadius ?? '')) {
    borderRadiusValue = radius[borderRadius];
  }

  // boxShadow value
  let boxShadowValue = "none";

  if (validBoxShadows.includes(shadow ?? '')) {
    boxShadowValue = boxShadows[shadow];
  } else if (coloredShadow && colored[coloredShadow]) {
    boxShadowValue = colored[coloredShadow];
  }

  return {
    opacity,
    background: backgroundValue,
    color: colorValue,
    borderRadius: borderRadiusValue,
    boxShadow: boxShadowValue,
  };
});
