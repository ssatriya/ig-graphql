import useContentLoading from "@/hooks/use-content-loading";
import { useEffect, useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
  barColors: {
    "0": "rgba(249,206,52,1)",
    "0.5": "rgba(238,42,123,1)",
    "1.0": "rgba(98,40,215,1)",
  },
});

const CustomSwitchModal = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState(false);
  const [prevLoc, setPrevLoc] = useState("");
  const location = useLocation();
  const { isLoading } = useContentLoading((state) => state);

  const background = location.state && location.state.background;

  useEffect(() => {
    setPrevLoc(location.pathname);
    setProgress(true);
    if (location.pathname === prevLoc) {
      setPrevLoc("");
    }
  }, [location]);

  useEffect(() => {
    if (!isLoading) {
      setProgress(false);
    }
  }, [prevLoc, isLoading]);

  return (
    <>
      {progress && <TopBarProgress />}
      <Routes location={background || location}>{children}</Routes>
    </>
  );
};
export default CustomSwitchModal;
