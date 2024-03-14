import { GetPostsByUserIdQuery } from "@/lib/graphql/__generated__/graphql";
import GeneralProfilePost from "./general-profile-post";

type GeneralProfilePostsProps = {
  userPosts?: GetPostsByUserIdQuery;
};

const GeneralProfilePosts = ({ userPosts }: GeneralProfilePostsProps) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {userPosts?.postsByUserId?.map((post) => {
        const postImages = post?.images.split(",");
        if (!postImages) return null;
        return (
          <div
            key={post?.id}
            role="button"
            onClick={() => {
              // router.push(`/p/${post.id}`);
            }}
          >
            <GeneralProfilePost postImages={postImages} />
          </div>
        );
      })}
    </div>
  );
};
export default GeneralProfilePosts;
