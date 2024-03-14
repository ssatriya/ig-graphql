import { Skeleton } from "@/components/ui/skeleton";

type PostImageSkeletonProps = {
  postCount?: number | null;
};
const PostImageSkeleton = ({ postCount }: PostImageSkeletonProps) => {
  if (!postCount) return null;
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: postCount })
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} className="h-[309px] w-[309px] rounded-none" />
        ))}
    </div>
  );
};
export default PostImageSkeleton;
