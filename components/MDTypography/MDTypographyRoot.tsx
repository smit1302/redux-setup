import Typography, { TypographyProps } from "@mui/material/Typography";
import { styled, Theme } from "@mui/material/styles";

// Define TypeScript interface for the ownerState
interface OwnerState {
  color: string;
  textTransform: string;
  verticalAlign: string;
  fontWeight: any;
  opacity: number;
  textGradient: boolean;
  darkMode: boolean;
}

// Define TypeScript interface for the styled component props
interface StyledTypographyProps extends TypographyProps {
  ownerState: OwnerState;
}

// Define the styled component
const StyledTypography = styled(Typography, { shouldForwardProp: (prop) => prop !== 'ownerState' })<
  StyledTypographyProps
>(({ theme, ownerState }:any) => {
  const { palette, typography, functions } :any= theme;
  const { color, textTransform, verticalAlign, fontWeight, opacity, textGradient, darkMode } =
    ownerState;

  const { gradients, transparent, white }:any = palette;
  const { fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold } = typography;
  const { linearGradient } = functions;

  // fontWeight styles
  const fontWeights:any = {
    light: fontWeightLight,
    regular: fontWeightRegular,
    medium: fontWeightMedium,
    bold: fontWeightBold,
  };

  // styles for the typography with textGradient={true}
  const gradientStyles = () => ({
    backgroundImage:
      color !== "inherit" && color !== "text" && color !== "white" && gradients[color]
        ? linearGradient(gradients[color].main, gradients[color].state)
        : linearGradient(gradients.dark.main, gradients.dark.state),
    display: "inline-block",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: transparent.main,
    position: "relative",
    zIndex: 1,
  });

  // color value
  let colorValue = color === "inherit" || !palette[color] ? "inherit" : palette[color].main;

  if (darkMode && (color === "inherit" || !palette[color])) {
    colorValue = "inherit";
  } else if (darkMode && color === "dark") colorValue = white.main;

  return {
    opacity,
    textTransform,
    verticalAlign,
    textDecoration: "none",
    color: colorValue,
    fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
    ...(textGradient && gradientStyles()),
  };
});

export default function MyStyledTypography(props: StyledTypographyProps) {
  return <StyledTypography {...props} />;
}
