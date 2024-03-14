import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GetUserByUsernameQuery } from "@/lib/graphql/__generated__/graphql";
import { cn } from "@/lib/utils";
import { User } from "@/types/auth";
import { Link, useLocation } from "react-router-dom";

type ProfileInfoProps = {
  userByUsername?: GetUserByUsernameQuery;
  loggedInUser: User | null;
};

const ProfileInfo = ({ userByUsername, loggedInUser }: ProfileInfoProps) => {
  const location = useLocation();
  const myProfile = loggedInUser
    ? loggedInUser.id === userByUsername?.userByUsername?.id
    : false;
  const isPending = false;
  const isFollowing = false;

  return (
    <div className="flex">
      <div className="w-[316px] flex justify-center">
        <Avatar className="h-[150px] w-[150px] border-[3px] border-transparent flex items-center justify-center mr-[30px]">
          <AvatarImage src={userByUsername?.userByUsername?.image || ""} />
          <AvatarFallback>ss</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-6">
          <span className="text-xl leading-[25px]">
            {userByUsername?.userByUsername?.username}
          </span>
          <div className="flex items-center gap-2">
            {myProfile && (
              <Button
                variant="nav"
                className="px-4 h-8 bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80 text-sm rounded-lg font-semibold"
              >
                Edit profile
              </Button>
            )}
            {myProfile && (
              <Button
                variant="nav"
                className="px-4 h-8 bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80 text-sm rounded-lg font-semibold"
              >
                View archive
              </Button>
            )}
            {myProfile && (
              <Button variant="text" size="icon" className="h-fit w-fit ml-2">
                <Icons.options />
              </Button>
            )}
            {!myProfile && (
              <Button
                // onClick={followHandler}
                variant="nav"
                className={cn(
                  "px-4 h-8 text-sm rounded-lg",
                  isFollowing
                    ? "bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80"
                    : "bg-igPrimary hover:bg-igPrimaryHover"
                )}
              >
                {isPending ? (
                  <img
                    src="/assets/loading-spinner.svg"
                    alt="Loading"
                    className="animate-spin w-[18px] h-[18px]"
                  />
                ) : !isPending && isFollowing ? (
                  "Following"
                ) : (
                  "Follow"
                )}
              </Button>
            )}
            {!myProfile && (
              <Button
                variant="nav"
                className="px-4 h-8 bg-igElevatedSeparator/50 hover:bg-igElevatedSeparator dark:bg-background-accent dark:hover:bg-background-accent/80 text-sm rounded-lg"
              >
                Message
              </Button>
            )}
            {!myProfile && (
              <Button variant="text" size="icon" className="h-fit w-fit ml-2">
                <Icons.moreCircleLarge />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-12 items-center">
          <span className="text-base font-bold">
            {userByUsername?.userByUsername?.postCount}
            <span className="font-normal"> posts</span>
          </span>
          <Link to={`/${userByUsername?.userByUsername?.username}/followers`}>
            <Button variant="text" className="h-fit w-fit p-0">
              <span className="text-base font-bold">
                {userByUsername?.userByUsername?.followersCount}
                <span className="font-normal"> followers</span>
              </span>
            </Button>
          </Link>

          <Link
            to={`/${userByUsername?.userByUsername?.username}/following`}
            state={{ background: location }}
          >
            <Button
              variant="text"
              className="h-fit w-fit p-0 text-base font-normal"
            >
              <span className="text-base font-bold">
                {/* {userByUsername.followings.length} */}
                {userByUsername?.userByUsername?.followingCount}
                <span className="font-normal"> following</span>
              </span>
            </Button>
          </Link>
        </div>
        <span className="text-sm font-semibold">
          {userByUsername?.userByUsername?.name}
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;
