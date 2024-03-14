import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FollowingModal = () => {
  const navigate = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  return (
    <Dialog defaultOpen>
      <DialogContent
        onInteractOutside={onDismiss}
        className="w-[400px] border-none dark:bg-igSeparator bg-background p-0 sm:rounded-xl gap-0"
      >
        <div className="flex w-full h-[43px] items-center justify-between border-b-[1px] dark:border-igElevatedSeparatorV2 border-igElevatedSeparator">
          <div className="h-[43] w-[48px] block bg-transparent"></div>
          <span className="font-bold">Following</span>
          <Button
            onClick={onDismiss}
            variant="text"
            size="icon"
            className="h-[43] w-[48px] focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <XIcon />
          </Button>
        </div>
        <div className="my-2 overflow-y-auto max-h-[400px]">
          {/* {isLoading && (
            <>
              <UserItemSkeleton />
              <UserItemSkeleton />
              <UserItemSkeleton />
            </>
          )}
          {!isLoading &&
            userFollowingData &&
            userFollowingData.map((following) => (
              <UserFollowingItem
                key={following.id}
                user={following}
                loggedInUserId={loggedInUserId}
                setOpen={setOpen}
              />
            ))} */}
        </div>
        {/* {userFollowingData && userFollowingData.length === 0 && (
          <div className="max-h-[400px] text-center mb-4">
            <span className="text-sm">You aren&apos;t following anyone</span>
          </div>
        )} */}
      </DialogContent>
    </Dialog>
  );
};
export default FollowingModal;
