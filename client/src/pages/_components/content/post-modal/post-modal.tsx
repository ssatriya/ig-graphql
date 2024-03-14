"use client";

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import CommentEditor from "./post-modal/comment-editor";
import { Icons } from "@/components/icons";
import useMeasure from "react-use-measure";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";

import { cn, formatReadableDate, formatTimeToNow } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostUserTooltip from "@/components/post-user-tooltip";
import { useTheme } from "@/components/theme-provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Container from "./container";
import { NavLink } from "react-router-dom";
import { gql } from "@/lib/graphql/__generated__";
import CommentItem from "./comment-item";
import CommentSkeleton from "./comment-skeleton";
import CommentEditor from "./comment-editor";
import { client } from "@/components/session-provider";

import { useTogglePost } from "@/hooks/use-toggle-post";

const GET_POST = gql(/* GraphQL */ `
  query GetPost($postId: ID!) {
    post(id: $postId) {
      id
      images
      caption
      likeCount
      lastLike
      createdAt
      user {
        id
        name
        image
        username
        followingCount
        followersCount
        postCount
      }
    }
  }
`);

const GET_POST_COMMENTS = gql(/* GraphQL */ `
  query GetPostComments($commentsId: ID!) {
    comments(id: $commentsId) {
      id
      comment
      createdAt
      user {
        username
        name
        postCount
        image
        followingCount
        followersCount
      }
    }
  }
`);

export default function PostModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usernameRef, usernameBounds] = useMeasure();
  const { isOpen, onClose } = useTogglePost((state) => state);
  const [caption, setCaption] = useState<string>();
  const [openLikedModal, setOpenLikedModal] = useState(false);
  const queryClient = useQueryClient();
  // const {
  //   session: { user },
  // } = useCurrentSession();
  const { theme } = useTheme();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Add a comment...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "text-primary text-sm leading-[18px] focus-visible:ring-none focus-visible:outline-none placeholder:text-primary min-h-[100%] min-w-[100%]",
      },
    },
  });

  const onSelect = (data: string) => {
    if (!editor) {
      return;
    }
    editor.chain().focus().insertContent(data).run();
  };

  const { data, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      return await client.request(GET_POST, {
        postId: id!,
      });
    },
  });

  const images = data?.post?.images.split(",");
  const stories = true;

  const onDismiss = () => {
    navigate(-1);
    onClose();
  };

  const { data: commentsQuery, isLoading: isLoadingComments } = useQuery({
    queryKey: ["getComments"],
    queryFn: async () => {
      return await client.request(GET_POST_COMMENTS, {
        commentsId: id!,
      });
    },
  });

  // const { data: likesData } = useQuery({
  //   queryKey: ["getLikes"],
  //   queryFn: async () => {
  //     const res = await fetch(`/api/like?postId=${post.id}`);
  //     const data = await res.json();

  //     return data as LikeWithUser[];
  //   },
  //   initialData: post.like,
  // });

  // const { mutate, isPending } = useMutation({
  //   mutationKey: ["createComment"],
  //   mutationFn: async () => {
  //     if (!editor || !user) return;
  //     const res = await fetch("/api/comment", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         comment: editor.getHTML(),
  //         postId: post.id,
  //         userId: user.id,
  //       }),
  //     });

  //     return res;
  //   },
  //   onError: (error) => {},
  //   onSuccess: () => {
  //     editor?.commands.clearContent();
  //     queryClient.invalidateQueries({ queryKey: ["getComments"] });
  //     queryClient.invalidateQueries({ queryKey: ["feedQuery"] });
  //   },
  // });

  const isPending = false;

  const handleComment = () => {
    // mutate();
  };

  const createdAt = new Date(data?.post?.createdAt || "");

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="flex border-none sm:rounded-r-sm lg:max-h-[866px] lg:max-w-[1380px] p-0 gap-0"
        onInteractOutside={() => onDismiss()}
      >
        {!isPostLoading && (
          <>
            <div className="dark:bg-black bg-zinc-200">
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={50}
                slidesPerView={1}
                navigation
                draggable={false}
                noSwiping={true}
                pagination={{ clickable: true }}
                // onSlideChange={(swiper) => setCurrentImage(swiper.activeIndex)}
                className="relative w-[867px]"
              >
                {images?.map((image, index) => (
                  <SwiperSlide key={image + index}>
                    <img
                      src={image}
                      alt="Post Image"
                      className="object-contain h-[867px] w-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="w-[500px] flex flex-col relative border-l dark:border-l-igSeparator border-l-igElevatedSeparator">
              <Container className="border-b dark:border-b-igSeparator border-b-igElevatedSeparator">
                <div className="flex justify-between items-center w-full h-fit">
                  <div className="flex items-center gap-3">
                    <PostUserTooltip user={data?.post?.user}>
                      <NavLink
                        to={`/`}
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
                          <AvatarImage src={data?.post?.user?.image || ""} />
                          <AvatarFallback>ss</AvatarFallback>
                        </Avatar>
                      </NavLink>
                    </PostUserTooltip>
                    <PostUserTooltip user={data?.post?.user}>
                      <NavLink
                        to={`/${data?.post?.user?.username}`}
                        className="text-sm font-semibold"
                      >
                        {data?.post?.user?.username}
                      </NavLink>
                    </PostUserTooltip>
                  </div>
                  <Button
                    size="icon"
                    className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                  >
                    <Icons.moreCircle className="fill-primary group-hover:fill-igSecondaryText" />
                  </Button>
                </div>
              </Container>
              <Container className="pb-0 pt-1">
                <div className="w-full h-[626px] overflow-y-auto">
                  <div className="flex items-start gap-3">
                    <PostUserTooltip user={data?.post?.user}>
                      <NavLink
                        to={`/${data?.post?.user?.username}`}
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
                          <AvatarImage src={data?.post?.user?.image || ""} />
                          <AvatarFallback>ss</AvatarFallback>
                        </Avatar>
                      </NavLink>
                    </PostUserTooltip>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm inline-flex gap-1 relative">
                        <span className="font-bold absolute" ref={usernameRef}>
                          {data?.post?.user?.username}
                        </span>
                        {data?.post?.caption && (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: data?.post?.caption,
                            }}
                            style={{
                              textIndent: `calc(${usernameBounds.width + 6}px)`,
                            }}
                          />
                        )}
                      </div>
                      <time
                        dateTime={createdAt.toISOString()}
                        title={formatReadableDate(createdAt)}
                        className="text-igSecondaryText text-xs font-medium cursor-default"
                      >
                        {formatTimeToNow(createdAt)}
                      </time>
                    </div>
                  </div>
                  {isLoadingComments && (
                    <>
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                    </>
                  )}
                  {!isLoadingComments &&
                    commentsQuery &&
                    commentsQuery.comments.map((comment) => (
                      <CommentItem key={comment?.id} comment={comment} />
                    ))}
                </div>
              </Container>
              <div className="relative mt-1 border-t dark:border-t-igSeparator border-t-igElevatedSeparator w-full bg-background h-fit sm:rounded-br-sm">
                <div className="absolute inset-0">
                  <Container>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex -ml-2">
                        {/* <LikeButton loggedInUserId={loggedInUser.id} post={post} /> */}
                        <Button
                          onClick={() => editor?.commands.focus()}
                          size="icon"
                          className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                        >
                          <Icons.comment className="stroke-primary group-hover:stroke-igSecondaryText" />
                        </Button>
                        <Button
                          size="icon"
                          className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                        >
                          <Icons.share className="stroke-primary group-hover:stroke-igSecondaryText" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        className="p-2 h-10 w-10 bg-transparent hover:bg-transparent group"
                        aria-label="Save"
                      >
                        <Icons.save className="stroke-primary group-hover:stroke-igSecondaryText" />
                      </Button>
                    </div>
                  </Container>
                  <Container className="pt-0">
                    {data?.post?.likeCount
                      ? data.post.likeCount > 0 && (
                          <p className="text-sm">
                            Liked by{" "}
                            <NavLink to={`/${data.post.lastLike}`}>
                              <span className="font-semibold">
                                {data.post.lastLike}
                              </span>{" "}
                            </NavLink>
                            {data.post.likeCount > 1 && (
                              <span>
                                and{" "}
                                <a
                                  href={`/p/${data.post.id}/liked_by`}
                                  target="_blank"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  role="link"
                                  tabIndex={0}
                                  className="w-fit h-fit p-0 hover:no-underline"
                                >
                                  <span className="font-semibold">others</span>
                                </a>
                              </span>
                            )}
                          </p>
                        )
                      : null}
                    {/* {openLikedModal && (
                  <LikedModal
                    open={openLikedModal}
                    setOpenLikedModal={setOpenLikedModal}
                    postId={post.id}
                  />
                )}  */}
                  </Container>
                  <div className="border-t dark:border-t-igSeparator border-t-igElevatedSeparator my-1">
                    <Container className="pr-4 h-[53px]">
                      <CommentEditor
                        editor={editor}
                        onSelect={onSelect}
                        handleComment={handleComment}
                        isPending={isPending}
                      />
                    </Container>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
