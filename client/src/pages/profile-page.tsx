import { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { client, useCurrentSession } from "@/components/session-provider";

import {
  GetPostsByUserIdDocument,
  GetUserByUsernameQuery,
} from "@/lib/graphql/__generated__/graphql";
import { useQuery } from "@tanstack/react-query";
import useContentLoading from "@/hooks/use-content-loading";
import PostImageSkeleton from "./_components/profile/post-image-skeleton";
import GeneralProfilePosts from "./_components/profile/general-profile/general-profile-posts";
import PersonalProfilePosts from "./_components/profile/persona-profile/personal-profile-posts";

export default function ProfilePage() {
  const {
    session: { user },
  } = useCurrentSession();
  const outletContext: GetUserByUsernameQuery = useOutletContext();
  const { setIsLoading } = useContentLoading((state) => state);

  const { data, isLoading: userPostsLoading } = useQuery({
    queryKey: ["postsData", outletContext?.userByUsername?.id],
    queryFn: async () => {
      return await client.request(GetPostsByUserIdDocument, {
        postsByUserId: outletContext?.userByUsername?.id ?? "",
      });
    },
  });

  useEffect(() => {
    if (!userPostsLoading) {
      setIsLoading(false);
    }
  }, [userPostsLoading, setIsLoading]);

  const myProfile = useMemo(
    () => outletContext?.userByUsername?.id === user?.id,
    [outletContext, user]
  );

  if (!data)
    return (
      <PostImageSkeleton postCount={outletContext?.userByUsername?.postCount} />
    );

  return myProfile ? (
    <PersonalProfilePosts userPosts={data} />
  ) : (
    <GeneralProfilePosts userPosts={data} />
  );
}
