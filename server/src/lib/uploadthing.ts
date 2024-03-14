import { nanoid } from "nanoid";
import { UTFiles } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: { maxFileCount: 4, maxFileSize: "4MB" },
  })
    .middleware(async ({ req, files }) => {
      const fileOverrides = files.map((file) => {
        const newName = file.name;
        const myIdentifier = nanoid();
        return { ...file, name: newName, customId: myIdentifier };
      });

      return { foo: "bar" as const, [UTFiles]: fileOverrides };
    })
    .onUploadComplete((data) => {
      console.log("upload completed", data);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
