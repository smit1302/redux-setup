import React, { forwardRef, createContext, useContext, useMemo } from "react";
import MDBox from "components/MDBox";
import MDPaginationItemRoot from "./MDPaginationItemRoot";

interface PaginationContextType {
  size?: 'small' | 'medium' | 'large';
  variant?: 'gradient' | 'contained';
  color?: 'white' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
}
interface MDPaginationProps {
  item?: boolean;
  variant?: 'gradient' | 'contained';
  color?: 'white' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  children: React.ReactNode;
}
const PaginationContext = createContext<PaginationContextType | undefined>(undefined);


const MDPagination = forwardRef(({
  item = false,
  variant = "gradient",
  color = "info",
  size = "medium",
  active = false,
  children,
  ...rest
}:any, ref:any) => {
  const context = useContext(PaginationContext);
  const paginationSize = context ? context.size : null;

  const value = useMemo(() => ({ variant, color, size }), [variant, color, size]);

  return (
    <PaginationContext.Provider value={value}>
      {item ? (
        <MDPaginationItemRoot
          {...rest}
          ref={ref}
          variant={active ? context?.variant || "outlined" : "outlined"}
          color={active ? context?.color || "secondary" : "secondary"}
          iconOnly
          circular
          ownerState={{ variant, active, paginationSize }}
        >
          {children}
        </MDPaginationItemRoot>
      ) : (
        <MDBox
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ listStyle: "none" }}
        >
          {children}
        </MDBox>
      )}
    </PaginationContext.Provider>
  );
});

export default MDPagination;
