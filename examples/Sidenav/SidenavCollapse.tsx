import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from 'examples/Sidenav/styles/sidenavCollapse';
import { useMaterialUIController } from 'context';

function SidenavCollapse({ icon, name, active, noCollapse, children, dropdownIcon, isDropdownOpen, dropdown, ...rest }: any) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;


  return (
    <div>
    <ListItem component="li">
      <MDBox
        {...rest}
        sx={(theme: any) =>
          collapseItem(theme, {
            active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor,
          })
        }
      >
        <ListItemIcon
          sx={(theme) =>
            collapseIconBox(theme, { transparentSidenav, whiteSidenav, darkMode, active })
          }
        >
          {typeof icon === 'string' ? (
            <Icon sx={(theme) => collapseIcon(theme, { active })}>{icon}</Icon>
          ) : (
            icon
          )}
        </ListItemIcon>

        <ListItemText
          primary={name}
          sx={(theme) =>
            collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active,
            })
          }
        />

        {/* Render dropdown icon based on the toggle state */}
        {!noCollapse && (
          <div
            className="your-dropdown-icon-class"
            style={{ cursor: 'pointer' }}
          >
            {isDropdownOpen && dropdown && <Icon>keyboard_arrow_up</Icon>}
            {!isDropdownOpen && dropdown && <Icon>keyboard_arrow_down</Icon>}
          </div>
        )}

        {/* Render dropdown content based on the toggle state */}
        {isDropdownOpen && children}
      </MDBox>
    </ListItem>
    </div>
  );
}

// Setting default values for the props of SidenavCollapse
SidenavCollapse.defaultProps = {
  active: false,
};

// Typechecking props for the SidenavCollapse
SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
  noCollapse: PropTypes.bool, // Add this line
  dropdownIcon: PropTypes.node,
  dropdown: PropTypes.bool || undefined,
  isDropdownOpen: PropTypes.bool || undefined,
};

export default SidenavCollapse;
