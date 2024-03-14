import { useCurrentSession } from "@/components/session-provider";
import {
  GetPostsByUserIdDocument,
  GetUserByUsernameDocument,
} from "@/lib/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import PersonalProfilePosts from "./_components/profile/persona-profile/personal-profile-posts";
import GeneralProfilePosts from "./_components/profile/general-profile/general-profile-posts";
import PostImageSkeleton from "./_components/profile/post-image-skeleton";
import { useEffect, useMemo } from "react";
import useUserPosts from "@/hooks/use-user-posts";

export default function ProfilePage() {
  const { username } = useParams();
  const {
    session: { user },
  } = useCurrentSession();
  const { setUserPosts, userPosts } = useUserPosts((state) => state);

  const { data: userByUsername } = useQuery(GetUserByUsernameDocument, {
    variables: {
      username: username ? username : "",
    },
  });

  const { data, loading: userPostsLoading } = useQuery(
    GetPostsByUserIdDocument,
    {
      variables: {
        postsByUserId: userByUsername?.userByUsername?.id ?? "",
      },
    }
  );

  useEffect(() => {
    if (data && !userPosts) {
      setUserPosts(data);
    }
  }, [data, setUserPosts, userPosts]);

  const myProfile = useMemo(
    () => userByUsername?.userByUsername?.id === user?.id,
    [userByUsername, user]
  );

  if (userPostsLoading)
    return (
      <PostImageSkeleton
        postCount={userByUsername?.userByUsername?.postCount}
      />
    );

  return myProfile ? (
    <PersonalProfilePosts userPosts={userPosts} />
  ) : (
    <GeneralProfilePosts userPosts={userPosts} />
  );
}
