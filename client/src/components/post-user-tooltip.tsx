"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Icons } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "./theme-provider";
import { NavLink } from "react-router-dom";
import { client } from "./session-provider";
import { GetUserByIdDocument, User } from "@/lib/graphql/__generated__/graphql";

type PostUserTooltipProps = {
  children: React.ReactNode;
  user?: User | null;
};

const PostUserTooltip = ({ user, children }: PostUserTooltipProps) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["userPostsQuery", user!.id],
    queryFn: async () => {
      return await client.request(GetUserByIdDocument, {
        userId: user!.id,
      });
    },
    enabled: open,
    gcTime: 60 * 1000,
  });

  const slicedPost = data?.userById?.post?.slice(0, 3);

  const stories = false;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip open={open} onOpenChange={setOpen} defaultOpen={false}>
        <TooltipTrigger
          ref={(ref: HTMLButtonElement | null) => {
            if (!ref) return;
            ref.onfocus = (e) => {
              e.preventDefault();
              e.stopPropagation();
            };
          }}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={6}
          align="start"
          className="w-96 h-fit border-none space-y-4 px-0"
        >
          <div className="px-2 py-3">
            <div className="flex gap-3 items-center">
              <NavLink
                to={`/${user?.username}`}
                className={cn(
                  "h-[68px] w-[68px] flex items-center justify-center p-3 rounded-full",
                  stories
                    ? "bg-gradient-to-br from-yellow-400 to-pink-500"
                    : "bg-transparent"
                )}
              >
                <Avatar
                  className={cn(
                    "h-16 w-16 border-[3px] flex items-center justify-center",
                    theme === "light" ? "border-white" : "border-black"
                  )}
                >
                  <AvatarImage src={user?.image || ""} />

                  <AvatarFallback>ss</AvatarFallback>
                </Avatar>
              </NavLink>
              <div className="flex flex-col gap-1">
                <NavLink
                  to={`/${user?.username}`}
                  className="font-bold text-sm"
                >
                  {user?.username}
                </NavLink>
                <span className="text-xs font-semibold text-igSecondaryText">
                  {user?.name}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 mt-4">
              <div className="flex flex-col items-center">
                <span className="font-bold">{user?.postCount}</span>
                <span>posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{user?.followersCount}</span>
                <span>followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{user?.followingCount}</span>
                <span>following</span>
              </div>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-1">
            {!slicedPost && (
              <>
                <Skeleton className="h-[125px] w-[124px]" />
                <Skeleton className="h-[125px] w-[124px]" />
                <Skeleton className="h-[125px] w-[124px]" />
              </>
            )}
            {slicedPost &&
              slicedPost.map((post, index) => {
                const postImages = post!.images.split(",");
                return (
                  <img
                    key={index}
                    src={postImages[0]}
                    alt="post image"
                    style={{ objectFit: "cover" }}
                    className="h-[125px] w-[125px]"
                  />
                );
              })}
          </div>
          <div className="flex gap-2 w-full px-4 pb-3">
            <Button variant="primary" className="rounded-lg w-full h-8">
              <Icons.message className="mr-2" />
              Message
            </Button>
            <Button
              variant="text"
              className="bg-igElevatedSeparatorV2 hover:bg-igSeparator rounded-lg w-full h-8"
            >
              Following
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default PostUserTooltip;
