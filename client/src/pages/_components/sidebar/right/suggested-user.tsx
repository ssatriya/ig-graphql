import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SuggestedUser = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src="/avatar.jpg" asChild>
            <img src="/avatar.jpg" alt={`david avatar`} />
          </AvatarImage>
          <AvatarFallback>ss</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">david</p>
          <p className="text-xs font-medium text-igSecondaryText">David</p>
        </div>
      </div>
      {/* {isPending ? (
        <div className="flex justify-center w-10">
          <Image
            src="/assets/loading-spinner.svg"
            height={12}
            width={12}
            alt="Loading"
            className="animate-spin"
          />
        </div>
      ) : (
        <Button
          disabled={isPending}
          onClick={() => followHandler(user.id)}
          variant="text"
          className="p-0 text-xs font-medium text-igPrimary"
        >
          Follow
        </Button>
      )} */}
    </div>
  );
};
export default SuggestedUser;
