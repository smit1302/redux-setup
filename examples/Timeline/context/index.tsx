
import { createContext, useContext } from "react";

// The Timeline main context
const Timeline = createContext<any | null>(null);

// Timeline context provider
function TimelineProvider({ children, value }:any) {
  return <Timeline.Provider value={value}>{children}</Timeline.Provider>;
}

// Timeline custom hook for using context
function useTimeline() {
  return useContext(Timeline);
}

export { TimelineProvider, useTimeline };
/* eslint-enable react/prop-types */
