import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LockResetIcon from '@mui/icons-material/LockReset';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Link as RouterLink } from 'react-router-dom';
interface ListItemProps {
    to: string;
    primary: string;
    icon: React.ReactNode;
  }
  const ListItemLink: React.FC<ListItemProps> = ({ to, primary, icon }) => {
    const renderLink = React.useMemo(
      () =>
        React.forwardRef<HTMLAnchorElement>((itemProps, ref) => (
          <RouterLink to={to} ref={ref} {...itemProps} />
        )),
      [to]
    );
  
    return (
      <li>
        <ListItemButton component={renderLink}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={primary} />
        </ListItemButton>
      </li>
    );
  };
  
  export const mainListItems: JSX.Element = (
    <>
      <ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon />} />
      <ListItemLink to="/my-profile" primary="My Profile" icon={<AccountCircleIcon />} />
      <ListItemLink to="/login" primary="SignIn" icon={<LoginIcon />} />
      <ListItemLink to="/register" primary="SignUp" icon={<AppRegistrationIcon />} />
      <ListItemLink to="/change-password" primary="Change Password" icon={<LockResetIcon />} />
      <ListItemLink to="/forgot-password" primary="Forgot Password" icon={<LockResetIcon />} />
      <ListItemLink to="/user-actions" primary="User" icon={<PeopleIcon />} />
      <ListItemLink to="/customer" primary="Customer Profile" icon={<PeopleIcon />} />
      
    </>
  );
  
  export const secondaryListItems: JSX.Element = (
    <>
      <ListSubheader component="div" inset>
        Saved reports
      </ListSubheader>
      <ListItemLink to="/current-month" primary="Current month" icon={<AssignmentIcon />} />
      <ListItemLink to="/last-quarter" primary="Last quarter" icon={<AssignmentIcon />} />
      <ListItemLink to="/year-end-sale" primary="Year-end sale" icon={<AssignmentIcon />} />
    </>
  );

  export const RegistrationListItems: JSX.Element = (
    <>
      <ListSubheader component="div" inset>
        Registration
      </ListSubheader>
      <ListItemLink to="/select-plan" primary="Select Plan" icon={<AssignmentIcon />} />
      <ListItemLink to="/personal-detail" primary="Personal Detail" icon={<AssignmentIcon />} />
      <ListItemLink to="/company-detail" primary="Company Detail" icon={<AssignmentIcon />} />
      <ListItemLink to="/billing-detail" primary="Billing Detail" icon={<AssignmentIcon />} />
    </>
  );