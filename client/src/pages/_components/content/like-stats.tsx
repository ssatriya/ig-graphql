import { Link } from "react-router-dom";

import {
  GetLikeByPostIdQuery,
  GetPostsQuery,
} from "@/lib/graphql/__generated__/graphql";

type LikeStatsProps = {
  data?: GetLikeByPostIdQuery;
  post: NonNullable<GetPostsQuery["posts"]["posts"]>[number];
};

const LikeStats = ({ data, post }: LikeStatsProps) => {
  return (
    <>
      {data?.like
        ? data.like.length > 0 && (
            <p className="text-sm">
              Liked by{" "}
              <Link to={`/${data.like[0]?.user?.username}`}>
                <span className="font-semibold">
                  {data.like[0]?.user?.username}
                </span>{" "}
              </Link>
              {data.like.length > 1 && (
                <span>
                  and{" "}
                  <a
                    href={`/p/${post?.id}/liked_by`}
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      // setOpenLikedModal(true);
                    }}
                    role="link"
                    tabIndex={0}
                    className="p-0 w-fit h-fit hover:no-underline"
                  >
                    <span className="font-semibold">others</span>
                  </a>
                </span>
              )}
            </p>
          )
        : post?.likeCount
        ? post.likeCount > 0 && (
            <p className="text-sm">
              Liked by{" "}
              <Link to={`/${post.lastLike}`}>
                <span className="font-semibold">{post.lastLike}</span>{" "}
              </Link>
              {post.likeCount > 1 && (
                <span>
                  and{" "}
                  <a
                    href={`/p/${post.id}/liked_by`}
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      // setOpenLikedModal(true);
                    }}
                    role="link"
                    tabIndex={0}
                    className="p-0 w-fit h-fit hover:no-underline"
                  >
                    <span className="font-semibold">others</span>
                  </a>
                </span>
              )}
            </p>
          )
        : null}
    </>
  );
};
export default LikeStats;
