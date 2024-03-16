import { generateReactHelpers } from "@uploadthing/react";

export const { uploadFiles, useUploadThing } = generateReactHelpers({
  url: `${import.meta.env.VITE_DEV_SERVER}/api/uploadthing`,
});
