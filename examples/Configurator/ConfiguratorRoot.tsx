import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { DrawerProps } from "@mui/material/Drawer";

interface ConfiguratorRootProps extends DrawerProps {
  ownerState: {
    openConfigurator: boolean;
  };
}
export default  styled(Drawer)<ConfiguratorRootProps>(({ theme, ownerState }) => {
  const { boxShadows, functions, transitions } :any= theme;
  const { openConfigurator } = ownerState;

  const configuratorWidth = 360;
  const { lg } = boxShadows;
  const { pxToRem } = functions;

  const drawerOpenStyles = {
    width: configuratorWidth,
    left: "initial",
    right: 0,
    transition: transitions.create("right", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.short,
    }),
  };

  const drawerCloseStyles = {
    left: "initial",
    right: pxToRem(-350),
    transition: transitions.create("all", {
      easing: transitions.easing.sharp,
      duration: transitions.duration.short,
    }),
  };

  return {
    "& .MuiDrawer-paper": {
      height: "100vh",
      margin: 0,
      padding: `0 ${pxToRem(10)}`,
      borderRadius: 0,
      boxShadow: lg,
      overflowY: "auto",
      ...(openConfigurator ? drawerOpenStyles : drawerCloseStyles),
    },
  };
});
