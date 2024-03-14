import { GetPostsByUserIdQuery } from "@/lib/graphql/__generated__/graphql";
import PersonalProfilePost from "./personal-profile-post";

type PersonalProfilePostsProps = {
  userPosts?: GetPostsByUserIdQuery;
};

const PersonalProfilePosts = ({ userPosts }: PersonalProfilePostsProps) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {userPosts?.postsByUserId?.map((post) => {
        const postImages = post?.images.split(",");
        if (!postImages) return null;
        return (
          <div
            role="button"
            key={post?.id}
            onClick={() => {
              // router.push(`/p/${post.id}`);
            }}
          >
            <PersonalProfilePost post={post} postImages={postImages} />
          </div>
        );
      })}
    </div>
  );
};
export default PersonalProfilePosts;
