import { useState, ReactNode } from "react";
import Fade from "@mui/material/Fade";
import MDBox from "components/MDBox";
import MDAlertRoot from "components/MDAlert/MDAlertRoot";
import MDAlertCloseIcon from "components/MDAlert/MDAlertCloseIcon";

type MDAlertProps = {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark";
  dismissible?: boolean;
  children: ReactNode;
};

function MDAlert({ color = "info", dismissible = false, children, ...rest }: any) {
  const [alertStatus, setAlertStatus] = useState<"mount" | "fadeOut" | "unmount">("mount");
  const handleAlertStatus :any= () => setAlertStatus("fadeOut");

  const alertTemplate = (mount: any = true) => (
    <Fade in={mount} timeout={300}>
      <MDAlertRoot ownerState={{ color }} {...rest}>
        <MDBox display="flex" alignItems="center" color="white">
          {children}
        </MDBox>
        {dismissible ? (
          <MDAlertCloseIcon onClick={mount ? handleAlertStatus : null}>&times;</MDAlertCloseIcon>
        ) : null}
      </MDAlertRoot>
    </Fade>
  );

  switch (alertStatus) {
    case "mount":
      return alertTemplate();
    case "fadeOut":
      setTimeout(() => setAlertStatus("unmount"), 400);
      return alertTemplate(false);
    default:
      return alertTemplate();
  }
}

export default MDAlert;

