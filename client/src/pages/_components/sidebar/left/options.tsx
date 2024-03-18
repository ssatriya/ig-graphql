import { useToggle } from "ahooks";
import { ChevronLeft } from "lucide-react";

import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { useCurrentSession } from "@/components/session-provider";
import { useState } from "react";

const Options = () => {
  const {
    session: { session },
  } = useCurrentSession();
  const { setTheme, theme } = useTheme();
  const [
    isDarkModeOpen,
    { toggle: toggleDarkModeOpen, set: setToggleDarkModeOpen },
  ] = useToggle();
  const [checkedDarkMode, { toggle: toggleCheckedDarkMode }] = useToggle();
  const [isLoading, setIsLoading] = useState(false);

  const dark = theme === "dark";
  const light = theme === "light";

  const onLogout = async () => {
    if (!session?.id) {
      return null;
    }

    setIsLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_DEV_SERVER}/api/user/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.id}`,
        },
      }
    );

    if (response.ok) {
      window.location.href = import.meta.env.VITE_URL;
    }
    if (!response.ok) {
      setIsLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="nav"
          className="my-[2px] p-3 flex items-center justify-start h-12 rounded-lg w-full"
        >
          <div className="flex items-center justify-start">
            <Icons.more />
            <p className="pl-4 leading-5">More</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={() => {
          setTimeout(() => {
            setToggleDarkModeOpen(false);
          }, 500);
        }}
        align="start"
        side="top"
        className="w-[266px] p-0 rounded-xl border-none bg-background-accent shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        {isDarkModeOpen && (
          <>
            <div className="flex items-center justify-between h-[52px] p-4">
              <div className="flex items-center">
                <Button
                  variant="text"
                  className="w-6 h-6 p-0"
                  onClick={() => {
                    setToggleDarkModeOpen(false);
                  }}
                >
                  <ChevronLeft className="w-4 h-4 -ml-2 text-igSecondaryText" />
                </Button>
                <p className="text-sm font-semibold leading-5">
                  Switch appearance
                </p>
              </div>
              {dark && <Icons.moon />}
              {light && <Icons.sun />}
            </div>
            <Separator
              orientation="horizontal"
              className="bg-muted-foreground/30"
            />
            <div className="w-full h-full p-2">
              <div
                onClick={() => {
                  toggleCheckedDarkMode();
                  setTheme(!checkedDarkMode ? "dark" : "light");
                }}
                role="button"
                tabIndex={0}
                className="p-4 flex items-center justify-between h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions cursor-pointer"
              >
                <p className="text-sm font-light leading-5 select-none">
                  Dark mode
                </p>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="switch-appearance"
                    className="data-[state=checked]:bg-igPrimary"
                    checked={theme === "dark" ? true : false}
                    onCheckedChange={toggleCheckedDarkMode}
                  />
                  <Label htmlFor="switch-appearance" className="sr-only">
                    Dark mode
                  </Label>
                </div>
              </div>
            </div>
          </>
        )}
        {!isDarkModeOpen && (
          <div className="p-2">
            <Button
              variant="nav"
              className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
            >
              <div className="flex items-center justify-center">
                <Icons.settings />
                <p className="pl-4 text-sm font-light leading-5">Settings</p>
              </div>
            </Button>
            <Button
              variant="nav"
              className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
            >
              <div className="flex items-center justify-center">
                <Icons.yourActivity />
                <p className="pl-4 text-sm font-light leading-5">
                  Your activity
                </p>
              </div>
            </Button>
            <Button
              variant="nav"
              className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
            >
              <div className="flex items-center justify-center">
                <Icons.saved />
                <p className="pl-4 text-sm font-light leading-5">Saved</p>
              </div>
            </Button>
            <Button
              onClick={() => {
                toggleDarkModeOpen();
              }}
              variant="nav"
              className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
            >
              <div className="flex items-center justify-center">
                {dark && <Icons.moon />}
                {light && <Icons.sun />}
                <p className="pl-4 text-sm font-light leading-5">
                  Switch appearance
                </p>
              </div>
            </Button>
            <Button
              variant="nav"
              className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
            >
              <div className="flex items-center justify-center">
                <Icons.report />
                <p className="pl-4 text-sm font-light leading-5">
                  Report a problem
                </p>
              </div>
            </Button>
            <Separator
              orientation="horizontal"
              className="bg-hoverOptions h-[6px] -ml-2 w-[266px] my-2"
            />
            <Button
              variant="nav"
              className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
            >
              <p className="pl-4 text-sm font-light leading-5 ">
                Switch accounts
              </p>
            </Button>
            <Separator
              orientation="horizontal"
              className="bg-hoverOptions h-[2px] -ml-2 w-[266px] my-2"
            />
            <Button
              disabled={isLoading}
              onClick={onLogout}
              variant="nav"
              className="p-4 flex items-center justify-start h-[50px] w-[250px] rounded-lg hover:bg-hoverOptions"
            >
              <p className="pl-4 text-sm font-light leading-5 ">Log out</p>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
export default Options;
