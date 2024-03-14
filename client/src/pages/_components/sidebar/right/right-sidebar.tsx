"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SuggestedUser from "./suggested-user";

const RightSidebar = () => {
  return (
    <div className="w-[383px] pl-16 pt-4 shrink-0">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Avatar className="w-11 h-11">
              <AvatarImage src="/avatar.jpg" asChild>
                <img src="/avatar.jpg" alt={`ssatriya avatar`} />
              </AvatarImage>
              <AvatarFallback>ss</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold">ssatriya</p>
              <p className="text-sm font-medium text-igSecondaryText">
                Donny Satriya
              </p>
            </div>
          </div>
          <Button
            variant="text"
            className="p-0 text-xs font-medium text-igPrimary"
          >
            Switch
          </Button>
        </div>
        <div className="flex justify-between mt-3 mb-4">
          <p className="text-sm font-semibold text-igSecondaryText">
            Suggested for you
          </p>
          <p className="text-sm font-semibold">See All</p>
        </div>
        <div className="space-y-3">
          {/* {suggestedUser &&
            suggestedUser.map((user) => (
              <SuggestedUser key={user.id} user={user} />
            ))} */}
          <SuggestedUser />
        </div>
      </div>
    </div>
  );
};
export default RightSidebar;
