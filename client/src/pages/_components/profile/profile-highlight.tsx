import { Icons } from "@/components/icons";
import { GetUserByUsernameQuery } from "@/lib/graphql/__generated__/graphql";
import { User } from "@/types/auth";

type ProfileHighlightProps = {
  userByUsername?: GetUserByUsernameQuery;
  loggedInUser: User | null;
};

const ProfileHighlight = ({
  loggedInUser,
  userByUsername,
}: ProfileHighlightProps) => {
  const myProfile = loggedInUser
    ? loggedInUser.id === userByUsername?.userByUsername?.id
    : false;

  if (!myProfile) return null;

  return (
    <div className="h-[130px] px-7 flex items-center">
      <div
        role="menuitem"
        className="px-[15px] py-[10px] flex flex-col items-center justify-center gap-3 cursor-pointer"
      >
        <div className="rounded-full h-[87px] w-[87px] border flex items-center justify-center">
          <div className="h-[77px] w-[77px] rounded-full bg-igSecondaryBackground dark:bg-igSeparator/40 flex items-center justify-center">
            <Icons.plusIconLarge className="dark:fill-igSecondaryText fill-igSecondaryTextV2" />
          </div>
        </div>
        <span className="text-xs font-semibold">New</span>
      </div>
    </div>
  );
};
export default ProfileHighlight;
