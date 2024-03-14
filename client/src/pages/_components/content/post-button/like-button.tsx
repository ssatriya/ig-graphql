import { useState } from "react";
import { useMutation } from "@apollo/client";

import { Icons } from "@/components/icons";
import {
  GetLikeQuery,
  GetPostsQuery,
} from "@/lib/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import { CREATE_LIKE, GET_LIKES } from "@/lib/graphql/queries";

type LikeButtonProps = {
  postLike: NonNullable<GetPostsQuery["posts"][0]>["like"];
  postId?: string;
  loggedInUserId?: string;
  loggedInUserUsername?: string;
};

const LikeButton = ({
  postLike,
  postId,
  loggedInUserId,
  loggedInUserUsername,
}: LikeButtonProps) => {
  const fromPostQuery = postLike?.some(
    (like) => like?.postId === postId && like?.userId === loggedInUserId
  );

  const [isLiked, setIsLiked] = useState(fromPostQuery);

  const [createLike] = useMutation(CREATE_LIKE, {
    variables: {
      postId: postId ? postId : "",
    },
    update(cache, { data }) {
      const createLike = data?.createLike;

      if (createLike) {
        const data: GetLikeQuery | null = cache.readQuery({
          query: GET_LIKES,
          variables: { postId: postId! },
        });

        const existingLikes = data?.like || [];

        const newLikes = createLike.map((newLike) => {
          const existingLike = existingLikes.find(
            (like) => like?.id === newLike?.id
          );
          if (!existingLike) {
            return newLike;
          }
          return {
            ...existingLike,
            user: existingLike.user || newLike?.user,
          };
        });

        cache.writeQuery({
          query: GET_LIKES,
          variables: { postId: postId! },
          data: { like: newLikes },
        });
      }
    },
  });

  const [scale, setScale] = useState(1);

  return (
    <Button
      onClick={() => {
        createLike({
          optimisticResponse: {
            createLike: [
              {
                __typename: "Like",
                id: String(-1),
                postId: postId ? postId : "",
                userId: loggedInUserId ? loggedInUserId : "",
                user: {
                  __typename: "User",
                  username: loggedInUserUsername!,
                },
              },
            ],
          },
        });
        setIsLiked((prev) => !prev);

        setScale(1.2);

        setTimeout(() => {
          setScale(1.1);
        }, 100);

        setTimeout(() => {
          setScale(1);
        }, 200);
      }}
      size="icon"
      className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
      style={{
        transform: isLiked ? `scale(${scale})` : "",
        transition: "transform 0.2s ease-in-out",
      }}
    >
      {isLiked ? (
        <Icons.liked className={`fill-red-500`} />
      ) : (
        <Icons.like className="fill-primary group-hover:fill-igSecondaryText" />
      )}
    </Button>
  );
};
export default LikeButton;
