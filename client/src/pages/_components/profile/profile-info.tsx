import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { User } from "@/types/auth";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  FollowUserDocument,
  GetUserByUsernameQuery,
} from "@/lib/graphql/__generated__/graphql";
import { client } from "@/components/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowingButton from "./following-button";
import FollowButton from "./follow-button";

type ProfileInfoProps = {
  userByUsername?: GetUserByUsernameQuery;
  loggedInUser: User | null;
};

const ProfileInfo = ({ userByUsername, loggedInUser }: ProfileInfoProps) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const myProfile = useMemo(
    () =>
      loggedInUser
        ? loggedInUser.id === userByUsername?.userByUsername?.id
        : false,
    [loggedInUser, userByUsername]
  );
  const isFollowing = useMemo(
    () =>
      userByUsername?.userByUsername?.followers?.find(
        (user) => user?.followingsId === loggedInUser?.id
      ),
    [userByUsername, loggedInUser]
  );

  const { mutate: followHandler } = useMutation({
    mutationKey: ["followUser", userByUsername?.userByUsername?.id],
    mutationFn: async () => {
      setIsLoading(true);
      return await client.request(FollowUserDocument, {
        userId: userByUsername?.userByUsername?.id
          ? userByUsername?.userByUsername?.id
          : "",
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  return (
    <div className="flex">
      <div className="w-[316px] flex justify-center">
        <Avatar className="h-[150px] w-[150px] border-[3px] border-transparent flex items-center justify-center mr-[30px]">
          <AvatarImage src={userByUsername?.userByUsername?.image || ""} />
          <AvatarFallback>sss</AvatarFallback>
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
              <>
                {isFollowing && (
                  <FollowingButton
                    followHandler={followHandler}
                    isLoading={isLoading}
                  />
                )}
                {!isFollowing && (
                  <FollowButton
                    followHandler={followHandler}
                    isLoading={isLoading}
                  />
                )}
              </>
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
