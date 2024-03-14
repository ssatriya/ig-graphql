import { Icons } from "@/components/icons";
import { GetPostsByUserIdQuery } from "@/lib/graphql/__generated__/graphql";
import { Copy } from "lucide-react";

type PersonalProfilePostProps = {
  postImages: string[];
  post: GetPostsByUserIdQuery["postsByUserId"][number];
};

const PersonalProfilePost = ({
  postImages,
  post,
}: PersonalProfilePostProps) => {
  return (
    <div className="relative h-[309px] w-[309px] cursor-pointer flex items-center justify-center group">
      {postImages.length > 1 && (
        <Copy className="absolute top-4 right-4 w-4 h-4 z-30" />
      )}
      <div className="absolute inset-0 bg-transparent group-hover:bg-black/25 z-20" />
      <img
        src={postImages[0]}
        alt="post image"
        style={{ objectFit: "cover" }}
        className="h-[309px] w-[309px]"
      />
      <div className="absolute top-1/2  gap-9 hidden group-hover:flex z-30">
        <div className="flex items-start gap-2">
          <Icons.loveActive className="text-white h-5 w-5" fill="white" />
          <span className="font-bold text-sm text-white">
            {post?.likeCount}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Icons.comment
            className="fill-white stroke-white h-5 w-5"
            fill="white"
          />
          <span className="font-bold text-sm text-white">
            {post?.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
};
export default PersonalProfilePost;
