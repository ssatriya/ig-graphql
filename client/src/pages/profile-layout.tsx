import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router-dom";

import TabsWrapper from "./_components/profile/tabs-wrapper";
import ProfileInfo from "./_components/profile/profile-info";
import ProfileFooter from "./_components/profile/profile-footer";
import ProfileHighlight from "./_components/profile/profile-highlight";
import { client, useCurrentSession } from "@/components/session-provider";
import { GetUserByUsernameDocument } from "@/lib/graphql/__generated__/graphql";

const ProfileLayout = () => {
  const { username } = useParams();

  const {
    session: { user },
  } = useCurrentSession();

  const { data: userData } = useQuery({
    queryKey: ["userData", username],
    queryFn: async () => {
      return await client.request(GetUserByUsernameDocument, {
        username: username ? username : "",
      });
    },
  });

  if (userData)
    return (
      <div className="w-[975px] py-[38px] px-5 space-y-14 flex flex-col min-h-screen">
        <ProfileInfo loggedInUser={user} userByUsername={userData} />
        <ProfileHighlight loggedInUser={user} userByUsername={userData} />
        <TabsWrapper userByUsername={userData}>
          <Outlet context={userData} />
        </TabsWrapper>
        <div className="relative">
          <ProfileFooter />
        </div>
      </div>
    );
};

export default ProfileLayout;
