import React from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import pattern from "assets/images/illustrations/pattern-tree.svg";
import masterCardLogo from "assets/images/logos/mastercard.png";

// Define a type for the props
interface MasterCardProps {
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'dark';
  number: string; // Assuming number is a string to include spaces, change to number if it's purely numeric
  holder: string;
  expires: string;
}

const MasterCard = ({ color, number, holder, expires }:any) => {
  const numberStr = number.toString(); // Convert number to string to use .match
  const numGroups = numberStr.match(/.{1,4}/g) || [];
  if (numGroups.length !== 4) {
    throw new Error(
      "Invalid value for the prop number, the value for the number prop should be exactly 16 digits"
    );
  }

  return (
    <Card
      sx={({ palette: { gradients }, functions: { linearGradient }, boxShadows: { xl } }:any) => ({
        background: gradients[color]
          ? linearGradient(gradients[color].main, gradients[color].state)
          : linearGradient(gradients.dark.main, gradients.dark.state),
        boxShadow: xl,
        position: "relative",
      })}
    >
      <MDBox
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        opacity={0.2}
        sx={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
        }}
      />
      <MDBox position="relative" zIndex={2} p={2}>
        <MDBox color="white" p={1} lineHeight={0} display="inline-block">
          <Icon fontSize="small">wifi</Icon>
        </MDBox>
        <MDTypography variant="h5" color="white" fontWeight="medium" sx={{ mt: 3, mb: 5, pb: 1 }}>
          {numGroups.join("  ")} {/* Replaced manual spacing with join for simplicity */}
        </MDTypography>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox display="flex" alignItems="center">
            <MDBox mr={3} lineHeight={1}>
              <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>
                Card Holder
              </MDTypography>
              <MDTypography variant="h6" color="white" fontWeight="medium" textTransform="capitalize">
                {holder}
              </MDTypography>
            </MDBox>
            <MDBox lineHeight={1}>
              <MDTypography variant="button" color="white" fontWeight="regular" opacity={0.8}>
                Expires
              </MDTypography>
              <MDTypography variant="h6" color="white" fontWeight="medium">
                {expires}
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox display="flex" justifyContent="flex-end" width="20%">
            <MDBox component="img" src={masterCardLogo} alt="master card" width="60%" mt={1} />
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
};

export default MasterCard;
