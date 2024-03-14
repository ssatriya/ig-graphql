import { useState } from "react";
import { useToggle } from "ahooks";
import { useQuery } from "@apollo/client";
import useMeasure from "react-use-measure";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useLocation } from "react-router-dom";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";

import LikeStats from "./like-stats";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GET_LIKES } from "@/lib/graphql/queries";
import LikeButton from "./post-button/like-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { useTogglePost } from "@/hooks/use-toggle-post";
import CommentEditor from "@/components/comment-editor";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import PostUserTooltip from "@/components/post-user-tooltip";
import { useCurrentSession } from "@/components/session-provider";
import { GetPostsQuery } from "@/lib/graphql/__generated__/graphql";
import { cn, formatReadableDate, formatTimeToNow } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PostItemProps = {
  post?: NonNullable<GetPostsQuery["posts"]["edges"]>[number];
};

const PostItem = ({ post }: PostItemProps) => {
  const location = useLocation();
  const { theme } = useTheme();
  const [ref, bounds] = useMeasure();
  const { onOpen } = useTogglePost((state) => state);
  const [usernameRef, usernameBounds] = useMeasure();
  const [captionOpen, { toggle: toggleCaptionOpen }] = useToggle();
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const {
    session: { user },
  } = useCurrentSession();

  const { data } = useQuery(GET_LIKES, {
    variables: {
      postId: post!.id,
    },
  });

  const stories = false;
  const createdAt = new Date(post?.createdAt);
  const images: string[] | undefined = post?.images!.split(",");

  const ratio = post!.aspectRatio.split("/");
  const ratioX = Number(ratio[0]);
  const ratioY = Number(ratio[1]);

  const height = (ratioY / ratioX) * 468;

  return (
    <>
      <div className="w-[470px] flex flex-col justify-center pt-5 mb-4">
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2">
            <PostUserTooltip user={post?.user}>
              <Link
                to={`/${post?.user?.username}`}
                className={cn(
                  "h-[42px] w-[42px] flex items-center justify-center p-3 rounded-full",
                  stories
                    ? "bg-gradient-to-br from-yellow-400 to-pink-500"
                    : "bg-transparent"
                )}
              >
                <Avatar
                  className={cn(
                    "h-[38px] w-[38px] border-[3px] flex items-center justify-center",
                    theme === "light" ? "border-white" : "border-black"
                  )}
                >
                  <AvatarImage src={post?.user?.image || ""} />
                  <AvatarFallback>ss</AvatarFallback>
                </Avatar>
              </Link>
            </PostUserTooltip>
            <div className="flex items-end gap-1">
              <PostUserTooltip user={post?.user}>
                <Link
                  to={`/${post?.user?.username}`}
                  className="text-sm font-semibold"
                >
                  {post?.user?.username}
                </Link>
              </PostUserTooltip>
              <span className="scale-75 text-igSecondaryText">•</span>
              <time
                dateTime={createdAt.toISOString()}
                title={formatReadableDate(createdAt)}
                className="text-sm font-medium cursor-pointer text-igSecondaryText"
              >
                {formatTimeToNow(createdAt)}
              </time>
            </div>
          </div>
          <Button
            size="icon"
            className="w-6 h-6 p-0 bg-transparent hover:bg-transparent group"
          >
            <Icons.moreCircle className="fill-primary group-hover:fill-igSecondaryText" />
          </Button>
        </div>
        <div
          className="rounded-sm dark:border-igElevatedSeparatorV2 border-igElevatedSeparator border-[1px] w-[470px]"
          style={{ height: height + 2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            draggable={false}
            noSwiping={true}
            pagination={{ clickable: true }}
            className="rounded-sm "
          >
            {images?.map((image, index) => (
              <SwiperSlide key={image + index}>
                <img
                  src={image}
                  alt="Post Image"
                  className={cn(
                    "w-auto h-auto",
                    imageLoading ? "hidden" : "block"
                  )}
                  onLoad={() => setImageLoading(false)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {imageLoading && (
            <AspectRatio
              ratio={
                Number(post?.aspectRatio[0]) / Number(post?.aspectRatio[2])
              }
              style={{ height }}
            >
              <Skeleton style={{ height }} className="w-full rounded-sm" />
            </AspectRatio>
          )}
        </div>
        <div className="flex items-center justify-between w-full mt-1">
          <div className="flex -ml-2">
            <LikeButton
              postLike={post?.like}
              postId={post?.id}
              loggedInUserId={user?.id}
              loggedInUserUsername={user?.username}
            />
            <Link
              to={`/p/${post?.id}`}
              state={{ background: location }}
              onClick={() => onOpen()}
            >
              <Button
                onClick={() => onOpen()}
                size="icon"
                className="w-10 h-10 p-2 bg-transparent hover:bg-transparent group"
              >
                <Icons.comment className="stroke-primary group-hover:stroke-igSecondaryText" />
              </Button>
            </Link>
            <Button
              size="icon"
              className="w-10 h-10 p-2 bg-transparent hover:bg-transparent group"
            >
              <Icons.share className="stroke-primary group-hover:stroke-igSecondaryText" />
            </Button>
          </div>
          <Button
            size="icon"
            className="p-0 bg-transparent h-fit w-fit hover:bg-transparent group"
            aria-label="Save"
          >
            <Icons.save className="stroke-primary group-hover:stroke-igSecondaryText" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 mt-1">
          <LikeStats data={data} post={post} />
          {/* {openLikedModal && (
                <LikedModal
                  open={openLikedModal}
                  setOpenLikedModal={setOpenLikedModal}
                  postId={post.id}
                />
              )} */}
          <div className="flex flex-col gap-2">
            <div className="relative inline-flex w-auto h-full gap-2 text-sm">
              <span ref={usernameRef} className="absolute font-bold h-fit">
                <Link to={`/${post?.user?.username}`}>
                  {post?.user?.username}
                </Link>
              </span>
              <div
                className={cn(
                  "w-full",
                  captionOpen
                    ? "h-auto overflow-hidden"
                    : "max-h-10 overflow-clip"
                )}
              >
                {post?.caption && usernameBounds.width && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.caption,
                    }}
                    ref={ref}
                    style={{
                      textIndent: `calc(${usernameBounds.width + 6}px)`,
                    }}
                  />
                )}
              </div>
            </div>
            {bounds.height > 40 && !captionOpen && (
              <Button
                onClick={() => toggleCaptionOpen()}
                className="flex justify-start p-0 h-[18px] text-igSecondaryText hover:no-underline w-fit"
                size="sm"
                variant="link"
              >
                more
              </Button>
            )}
            {post?.commentCount
              ? post.commentCount > 0 && (
                  <Link
                    to={`/p/${post.id}`}
                    state={{ background: location, modal: true }}
                  >
                    <Button
                      className="flex justify-start p-0 h-[18px] text-igSecondaryText hover:no-underline w-fit"
                      size="sm"
                      variant="link"
                    >
                      View all {post.commentCount} comments
                    </Button>
                  </Link>
                )
              : ""}
            <CommentEditor postId={post?.id} />
          </div>
        </div>
      </div>
      <Separator className="bg-border w-[470px]" />
      {/* <PostModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        id={post!.id}
      /> */}
    </>
  );
};
export default PostItem;
