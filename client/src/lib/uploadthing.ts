import { generateReactHelpers } from "@uploadthing/react";

export const { uploadFiles, useUploadThing } = generateReactHelpers({
  url: `${import.meta.env.VITE_BACKEND_SERVER}/api/uploadthing`,
});
