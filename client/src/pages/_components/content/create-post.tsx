import {
  ElementRef,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { FileWithPath, useDropzone } from "react-dropzone";

import { FileWithPreview } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import ImageEditor from "./image-editor";
import { Icons } from "@/components/icons";
import useFilter from "@/hooks/use-filter";
import { Button } from "@/components/ui/button";
import { usePostModal } from "@/hooks/use-post-modal";
import { FixedCropperRef } from "react-advanced-cropper";
import PostCloseConfirmation from "./post-close-confirmation";
import { usePostCloseConfirmationModal } from "@/hooks/use-post-close-confirmation";
import { useTheme } from "@/components/theme-provider";
import { nanoid } from "nanoid";
import { LIMIT } from "@/lib/config";
import { useUploadThing } from "@/lib/uploadthing";
import { client } from "@/components/session-provider";
import { CREATE_POST } from "@/lib/graphql/queries";
import { useAspectRatio } from "@/hooks/use-aspect-ratio";

const CreatePost = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const light = theme === "light";
  const dark = theme === "dark";
  const { isOpen, onClose } = usePostModal();

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const imageRef = files.map(() => createRef<FixedCropperRef>());
  const { ratio } = useAspectRatio((state) => state);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isDragged, setIsDragged] = useState(false);
  const [postStep, setPostStep] = useState<"image" | "filter" | "post">(
    "image"
  );
  const [posting, setPosting] = useState<
    "idle" | "posting" | "success" | "error"
  >("idle");

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = usePostCloseConfirmationModal();

  useEffect(() => {
    if (!document.body.hasAttribute("data-scroll-locked")) {
      document.body.setAttribute("data-scroll-locked", "");
    }
  }, [isConfirmOpen]);

  useEffect(() => {
    const handleDragOver = () => {
      setIsDragged(true);
    };

    const handleDrop = () => {
      setIsDragged(false);
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          id: nanoid(),
          preview: URL.createObjectURL(file),
        });
        setFiles((prev) => [...(prev ?? []), fileWithPreview]);
      });
    },
    [setFiles]
  );

  useEffect(() => {
    files.map((file) => {
      return () => {
        if (file) {
          URL.revokeObjectURL(file.preview);
        }
      };
    });
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
  });

  const onDelete = (imageId: string) => {
    setFiles((prev) => prev.filter((img) => img.id !== imageId));
  };

  const { setPresetProfile } = useFilter((state) => state);

  useEffect(() => {
    files.forEach((file) => {
      setPresetProfile(file.id, "original");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a caption...",
      }),
      CharacterCount.configure({
        limit: LIMIT,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "text-primary text-base leading-[18px] focus-visible:ring-none focus-visible:outline-none placeholder:text-primary min-h-[100%] min-w-[100%]",
      },
    },
  });

  const onSelect = (data: string) => {
    if (!editor) {
      return;
    }
    editor.chain().focus().insertContent(data).run();
  };

  const getImages = async () => {
    const promises = imageRef.map(async (ref, index) => {
      if (ref.current) {
        const dataUrl = ref.current?.getCanvas()?.toDataURL("image/jpeg");
        if (dataUrl) {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          return new File(
            [blob],
            `${files[index].name.substring(
              0,
              files[index].name.lastIndexOf(".")
            )}.jpeg`,
            {
              type: blob.type,
            }
          );
        }
      }
    });

    return Promise.all(promises);
  };

  const { mutate } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: async ({
      images,
      caption,
      aspectRatio,
    }: {
      images: string;
      caption: string | undefined;
      aspectRatio: string;
    }) => {
      return await client.request(CREATE_POST, {
        post: {
          images,
          caption,
          aspectRatio: aspectRatio,
        },
      });
    },
    onSuccess: () => {
      setPosting("success");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (file) => {
      const fileUrl: string[] = [];
      file.map((f) => fileUrl.push(f.url));

      if (fileUrl.length > 0) {
        mutate({
          caption: editor?.getHTML(),
          images: fileUrl.toString(),
          aspectRatio: `${ratio.x.toString()}/${ratio.y.toString()}`,
        });
      }
    },
  });

  const handlePost = async () => {
    setPosting("posting");
    const images = await getImages();

    const allFiles: File[] = [];
    images.map((file) => {
      if (file) {
        allFiles.push(file);
      }
    });

    startUpload(allFiles);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (posting === "posting") return;
        onClose();
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          if (files.length < 1) return;
          if (posting === "posting") {
            return;
          } else if (posting === "success") {
            onClose();
            return;
          } else {
            e.preventDefault();
            onConfirmOpen();
            setPostStep("image");
          }
        }}
        className={cn(
          "gap-0 flex flex-col items-center max-h-[898px] max-w-[1038px] min-h-[391px] min-w-[348px] w-[692px] h-[734px] border-none p-0 sm:rounded-xl bg-background-accent",
          postStep === "filter" ? "w-[1038px]" : "",
          postStep === "post" ? "w-[1038px]" : "",
          posting === "posting" || posting === "success" || posting === "error"
            ? "w-[692px]"
            : ""
        )}
      >
        <DialogHeader
          className={cn(
            "border-b-[1px] w-full p-0 h-11 flex items-center justify-center",
            theme === "light"
              ? "border-b-[1px]"
              : "border-b-igElevatedSeparatorV2"
          )}
        >
          <DialogTitle className="w-full h-[42px] flex justify-center items-center">
            {files.length === 0 &&
              posting !== "posting" &&
              posting !== "success" &&
              posting !== "error" && (
                <p className="text-base font-semibold leading-6 w-full text-center select-none">
                  Create new post
                </p>
              )}
            {files.length > 0 &&
              posting !== "posting" &&
              posting !== "success" &&
              posting !== "error" && (
                <div className="flex justify-between items-center w-full">
                  <Button
                    variant="icon"
                    onClick={() => {
                      if (postStep === "filter" || postStep == "post") {
                        setPostStep("image");
                        return;
                      }
                      onConfirmOpen();
                    }}
                  >
                    <Icons.arrowLeft />
                  </Button>
                  <p className="text-base font-semibold leading-6 w-full text-center select-none">
                    Crop
                  </p>
                  <Button
                    disabled={isUploading}
                    onClick={() => {
                      if (postStep === "image") {
                        setPostStep("filter");
                      } else if (postStep === "filter") {
                        setPostStep("post");
                      }
                      if (postStep === "post") {
                        handlePost();
                      }
                    }}
                    variant="text"
                    className={cn(
                      "font-medium text-igPrimary bg-transparent w-20",
                      theme === "light" && "hover:text-igGhostButtonHover"
                    )}
                  >
                    {postStep === "image" && "Next"}
                    {postStep === "filter" && "Next"}
                    {postStep === "post" && "Share"}
                  </Button>
                </div>
              )}
            {posting === "posting" && (
              <div className="flex justify-between items-center w-full">
                <span className="text-base font-semibold leading-6 w-full text-center select-none">
                  Sharing
                </span>
              </div>
            )}
            {posting === "success" && (
              <div className="flex justify-between items-center w-full">
                <span className="text-base font-semibold leading-6 w-full text-center select-none">
                  Post shared
                </span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        {files.length > 0 &&
          posting !== "posting" &&
          posting !== "success" &&
          posting !== "error" && (
            <ImageEditor
              files={files}
              imageRef={imageRef}
              inputRef={inputRef}
              onDelete={onDelete}
              postStep={postStep}
              editor={editor}
              onSelect={onSelect}
            />
          )}
        {files.length < 1 &&
          posting !== "posting" &&
          posting !== "success" &&
          posting !== "error" && (
            <div
              {...getRootProps()}
              className={cn(
                "flex flex-col gap-5 items-center justify-center h-full w-full",
                isDragged && dark && "bg-igSeparator rounded-b-lg",
                isDragged && light && "bg-igSecondaryBackground rounded-b-lg"
              )}
            >
              <Icons.photoAndVideo
                className={cn(
                  "fill-primary",
                  isDragged && light && "fill-igPrimary",
                  isDragged && dark && "fill-igPrimary"
                )}
              />
              <p className="text-xl select-none">Drag photos and videos here</p>
              <Button
                className="select-none font-semibold px-4"
                size="xs"
                variant="primary"
                onClick={() => {
                  if (inputRef && inputRef.current) {
                    inputRef.current.click();
                  }
                }}
              >
                Select from computer
              </Button>
            </div>
          )}
        {posting === "posting" && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <img
              src="/assets/create-post-loading.gif"
              alt="Create post loading"
              className="h-[120px] w-[120px]"
            />
            <span className="text-xl text-transparent">Posting.</span>
          </div>
        )}
        {posting === "success" && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <img
              src="/assets/post-success.gif"
              alt="Create post loading"
              className="h-[120px] w-[120px]"
            />
            <span className="text-xl">Your post has been shared.</span>
          </div>
        )}
        <input
          {...getInputProps()}
          type="file"
          className="hidden"
          ref={inputRef}
        />
      </DialogContent>
      {isConfirmOpen && (
        <PostCloseConfirmation
          isConfirmOpen={isConfirmOpen}
          onConfirmClose={onConfirmClose}
          setFiles={setFiles}
        />
      )}
    </Dialog>
  );
};
export default CreatePost;
