import ProfileInfo from "./_components/profile/profile-info";
import { Outlet, useParams } from "react-router-dom";
import ProfileHighlight from "./_components/profile/profile-highlight";
import { GetUserByUsernameDocument } from "@/lib/graphql/__generated__/graphql";
import TabsWrapper from "./_components/profile/tabs-wrapper";
import ProfileFooter from "./_components/profile/profile-footer";
import { useCurrentSession } from "@/components/session-provider";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import useUserProfile from "@/hooks/use-user-profile";

const ProfileLayout = () => {
  const { username } = useParams();

  const {
    session: { user },
  } = useCurrentSession();
  const { setUserData, userData } = useUserProfile((state) => state);

  const { data } = useQuery(GetUserByUsernameDocument, {
    variables: {
      username: username ? username : "",
    },
  });

  useEffect(() => {
    setUserData(undefined);
  }, []);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data, setUserData]);

  if (userData)
    return (
      <div className="w-[975px] py-[38px] px-5 space-y-14 flex flex-col min-h-screen">
        <ProfileInfo loggedInUser={user} userByUsername={userData} />
        <ProfileHighlight loggedInUser={user} userByUsername={userData} />
        <TabsWrapper userByUsername={userData}>
          <Outlet />
        </TabsWrapper>
        <div className="relative">
          <ProfileFooter />
        </div>
      </div>
    );
};

export default ProfileLayout;
