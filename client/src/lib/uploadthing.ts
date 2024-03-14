import { generateReactHelpers } from "@uploadthing/react";

export const { uploadFiles, useUploadThing } = generateReactHelpers({
  url: "http://localhost:4000/api/uploadthing",
});
