import React, { createContext, useContext, useReducer, useMemo, ReactNode } from "react";

interface State {
  miniSidenav: boolean;
  transparentSidenav: boolean;
  whiteSidenav: boolean;
  sidenavColor: string;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
  direction: string;
  layout: string;
  darkMode: boolean;
}

type Action =
  | { type: "MINI_SIDENAV"; value: boolean }
  | { type: "TRANSPARENT_SIDENAV"; value: boolean }
  | { type: "WHITE_SIDENAV"; value: boolean }
  | { type: "SIDENAV_COLOR"; value: string }
  | { type: "TRANSPARENT_NAVBAR"; value: boolean }
  | { type: "FIXED_NAVBAR"; value: boolean }
  | { type: "OPEN_CONFIGURATOR"; value: boolean }
  | { type: "DIRECTION"; value: string }
  | { type: "LAYOUT"; value: string }
  | { type: "DARKMODE"; value: boolean };

const MaterialUI = createContext<[State, React.Dispatch<Action>] | undefined>(undefined);

MaterialUI.displayName = "MaterialUIContext";

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "MINI_SIDENAV":
      return { ...state, miniSidenav: action.value };
    case "TRANSPARENT_SIDENAV":
      return { ...state, transparentSidenav: action.value };
    case "WHITE_SIDENAV":
      return { ...state, whiteSidenav: action.value };
    case "SIDENAV_COLOR":
      return { ...state, sidenavColor: action.value };
    case "TRANSPARENT_NAVBAR":
      return { ...state, transparentNavbar: action.value };
    case "FIXED_NAVBAR":
      return { ...state, fixedNavbar: action.value };
    case "OPEN_CONFIGURATOR":
      return { ...state, openConfigurator: action.value };
    case "DIRECTION":
      return { ...state, direction: action.value };
    case "LAYOUT":
      return { ...state, layout: action.value };
    case "DARKMODE":
      return { ...state, darkMode: action.value };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

interface MaterialUIControllerProviderProps {
  children: ReactNode;
}

function MaterialUIControllerProvider({ children }: MaterialUIControllerProviderProps) {
  const initialState: State = {
    miniSidenav: false,
    transparentSidenav: false,
    whiteSidenav: false,
    sidenavColor: "info",
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: "ltr",
    layout: "dashboard",
    darkMode: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value :any= useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

function useMaterialUIController(): [State, React.Dispatch<Action>] {
  const context = useContext(MaterialUI);
  if (context === undefined) {
    throw new Error("useMaterialUIController must be used within a MaterialUIControllerProvider");
  }
  return context;
}

const setMiniSidenav = (dispatch:any, value: any) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch:any, value: any) => dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch:any, value: any) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch:any, value: any) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch:any, value: any) => dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch:any, value: any) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch: any, value: any) => dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch:any, value: any) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch:any, value: any) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch:any, value: any) => dispatch({ type: "DARKMODE", value });
export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};
