import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GetUserByUsernameQuery } from "@/lib/graphql/__generated__/graphql";
import { Link, useLocation } from "react-router-dom";

type TabsWrapperProps = {
  children: React.ReactNode;
  userByUsername?: GetUserByUsernameQuery;
};

const TabsWrapper = ({ children, userByUsername }: TabsWrapperProps) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex gap-10 justify-center w-full border-t-[1px] h-[53px]">
        <Link to={`/${userByUsername?.userByUsername?.username}`}>
          <Button
            variant="nav"
            className={cn(
              "hover:bg-transparent rounded-none border-t-[1px] border-t-transparent w-fit px-1 h-full",
              pathname === `/${userByUsername?.userByUsername?.username}` &&
                "border-t-[1px] border-t-foreground"
            )}
          >
            <Icons.grid className="mr-1" />
            <span className="uppercase font-semibold text-xs tracking-wider">
              Posts
            </span>
          </Button>
        </Link>
        <Link to={`/${userByUsername?.userByUsername?.username}/saved`}>
          <Button
            variant="nav"
            className={cn(
              "hover:bg-transparent rounded-none border-t-[1px] border-t-transparent w-fit px-1 h-full",
              pathname ===
                `/${userByUsername?.userByUsername?.username}/saved` &&
                "border-t-[1px] border-t-foreground"
            )}
          >
            <Icons.savedSmall className="mr-1" />
            <span className="uppercase font-semibold text-xs tracking-wider">
              Saved
            </span>
          </Button>
        </Link>
        <Link to={`/${userByUsername?.userByUsername?.username}/tagged`}>
          <Button
            variant="nav"
            className={cn(
              "hover:bg-transparent rounded-none border-t-[1px] border-t-transparent w-fit px-1 h-full",
              pathname ===
                `/${userByUsername?.userByUsername?.username}/tagged` &&
                "border-t-[1px] border-t-foreground"
            )}
          >
            <Icons.tagged className="mr-1" />
            <span className="uppercase font-semibold text-xs tracking-wider">
              Tagged
            </span>
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
};
export default TabsWrapper;
