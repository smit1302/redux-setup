import { forwardRef, ReactNode } from 'react';
// Custom styles for MDTypography
import MDTypographyRoot from './MDTypographyRoot';

// Material Dashboard 2 React contexts
import { useMaterialUIController } from '../../context';

// Define TypeScript interface for the component props
interface MDTypographyProps {
  color?: 'inherit' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark' | 'text' | 'white';
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold' | false;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  verticalAlign?: 'unset' | 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom';
  textGradient?: boolean;
  opacity?: number;
  children: ReactNode;
}

const MDTypography = forwardRef(({
  color = 'dark',
  fontWeight = false,
  textTransform = 'none',
  verticalAlign = 'unset',
  textGradient = false,
  opacity = 1,
  children,
  ...rest
}:any, ref:any) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <MDTypographyRoot
      {...rest}
      ref={ref}
      ownerState={{
        color,
        textTransform,
        verticalAlign,
        fontWeight,
        opacity,
        textGradient,
        darkMode,
      }}
    >
      {children}
    </MDTypographyRoot>
  );
});

export default MDTypography;
