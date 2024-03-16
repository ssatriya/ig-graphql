import { useState } from "react";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type GeneralProfilePostProps = {
  postImages: string[];
};

const GeneralProfilePost = ({ postImages }: GeneralProfilePostProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative h-[309px] w-[309px] cursor-pointer flex items-center justify-center">
      {postImages.length > 1 && (
        <Copy className="absolute top-4 right-4 w-4 h-4 z-30" />
      )}
      <img
        src={postImages[0]}
        alt="post image"
        style={{ objectFit: "cover" }}
        className={cn("h-[309px] w-[309px]", imageLoading ? "hidden" : "block")}
        onLoad={() => setImageLoading(false)}
      />
      {imageLoading && <Skeleton className="h-[309px] w-[309px]" />}
    </div>
  );
};
export default GeneralProfilePost;
