import { MutateOptions } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FollowUserMutation } from "@/lib/graphql/__generated__/graphql";

type FollowButtonProps = {
  followHandler: (
    variables: void,
    options?:
      | MutateOptions<FollowUserMutation, Error, void, unknown>
      | undefined
  ) => void;
  isLoading: boolean;
};

const FollowingButton = ({ followHandler, isLoading }: FollowButtonProps) => {
  return (
    <Button
      onClick={() => followHandler()}
      variant="nav"
      className={cn(
        "px-4 h-8 text-sm rounded-lg bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80"
      )}
    >
      {isLoading ? (
        <img
          src="/assets/loading-spinner.svg"
          alt="Loading"
          className="animate-spin w-[18px] h-[18px]"
        />
      ) : (
        "Following"
      )}
    </Button>
  );
};
export default FollowingButton;
