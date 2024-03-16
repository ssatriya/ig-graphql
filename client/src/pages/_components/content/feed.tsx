import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

import PostItem from "./post-item";
import FeedLoading from "./feed-loading";
import {
  GetPostsQuery,
  GetPostsQueryVariables,
  GetPostsDocument,
} from "@/lib/graphql/__generated__/graphql";
import { client } from "@/components/session-provider";
import useContentLoading from "@/hooks/use-content-loading";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/lib/config";

const Feed = () => {
  const lastPostRef = useRef();
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 0.4,
  });
  const { setIsLoading } = useContentLoading((state) => state);

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam }) => {
      const res = await client.request<GetPostsQuery, GetPostsQueryVariables>(
        GetPostsDocument,
        {
          page: pageParam,
          limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
        }
      );

      return res.posts;
    },
    getNextPageParam: (_, pages) => {
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Apollo
  // const { data: apolloData, fetchMore } = useQuery(GetPostsDocument, {
  //   variables: {
  //     limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
  //     page: 1,
  //   },
  // });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
      // fetchMore({
      //   query: GetPostsDocument,
      //   variables: {
      //     limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
      //     page: apolloData?.posts.pageInfo.currentPage,
      //   },
      // });
    }
  }, [entry?.isIntersecting]);

  const feedPosts = data?.pages.flatMap((page) => page.edges) ?? [];

  return (
    <ul className="w-[630px] h-full flex flex-col items-center">
      {feedPosts?.map((post, index) => {
        if (index === feedPosts.length - 1) {
          return (
            <li key={post?.id} ref={ref} className="list-none">
              <PostItem post={post} />
            </li>
          );
        } else {
          return (
            <li key={post?.id} className="list-none">
              <PostItem post={post} />
            </li>
          );
        }
      })}
      {hasNextPage && isFetchingNextPage && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <img
            src="/assets/loading-spinner.svg"
            className="animate-spin h-6 w-6"
            alt="loading spinner"
          />
        </li>
      )}
      {!hasNextPage && !isFetching && !isLoading && (
        <li className="pb-6 h-full flex justify-center items-start mt-6">
          <span className="text-sm font-semibold text-igSecondaryText">
            End of content
          </span>
        </li>
      )}
      {isLoading && <FeedLoading />}
    </ul>
  );
};
export default Feed;
