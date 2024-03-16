"use client";

import {
  FixedCropper,
  FixedCropperRef,
  ImageRestriction,
} from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useToggle } from "ahooks";
import { XIcon } from "lucide-react";
import { Editor } from "@tiptap/react";
import { RefObject, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileWithPreview } from "@/types";
import { Icons } from "@/components/icons";
import useFilter from "@/hooks/use-filter";
// import FilterTabs from "./filter/filter-tabs";
import { Button } from "@/components/ui/button";
import PostEditor from "@/components/post-editor";
import { Separator } from "@/components/ui/separator";
import { ZoomSlider } from "@/components/ui/zoom-slider";
import { getZoomFactor } from "advanced-cropper/extensions/absolute-zoom";
import { AdjustableCropperBackground } from "./cropper/adjustable-cropper-background";
import { Swiper as SwiperType } from "swiper/types";
import { useAspectRatio } from "@/hooks/use-aspect-ratio";

type ZoomLevelsState = Record<string, number>;

type ImageEditorProps = {
  files: FileWithPreview[];
  imageRef: RefObject<FixedCropperRef>[];
  inputRef: RefObject<HTMLInputElement>;
  onDelete: (imageId: string) => void;
  postStep: "image" | "filter" | "post";
  editor: Editor | null;
  onSelect: (data: string) => void;
};

const ImageEditor = ({
  files,
  imageRef,
  inputRef,
  onDelete,
  postStep,
  editor,
  onSelect,
}: ImageEditorProps) => {
  const [newMediaOpen, { set: setNewMediaOpen, toggle: toggleNewMediaOpen }] =
    useToggle();
  const { selectedPreset, setSelectedFilter } = useFilter((state) => state);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | undefined>(
    undefined
  );
  const [zoomLevels, setZoomLevels] = useState<ZoomLevelsState>({});

  useEffect(() => {
    const newZoomLevels: Record<string, number> = {};
    files.forEach((file) => {
      if (!zoomLevels[file.id]) {
        newZoomLevels[file.id] = 0;
      }
    });

    setZoomLevels((prevZoomLevels) => ({
      ...prevZoomLevels,
      ...newZoomLevels,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const onZoom = (
    zoomValue: number,
    ref: RefObject<FixedCropperRef>,
    imageId: string
  ) => {
    setZoomLevels((prevZoomLevels) => ({
      ...prevZoomLevels,
      [imageId]: zoomValue * 200,
    }));
    const cropper = ref.current;
    if (cropper) {
      cropper.zoomImage(
        getZoomFactor(cropper.getState(), cropper.getSettings(), zoomValue),
        {
          transitions: true,
        }
      );
    }
  };

  const slideTo = (index: number) => thumbsSwiper?.slideTo(index);

  useEffect(() => {
    if (currentImage) {
      setSelectedFilter("original");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImage]);

  const { setAspectRatio, ratio, aspectRatio } = useAspectRatio(
    (state) => state
  );

  return (
    <div className="h-[692px] w-full flex">
      <div className="relative h-[692px] w-[692px] border-b-xl flex justify-between">
        <Swiper
          modules={[Navigation, EffectFade, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          effect={"fade"}
          navigation
          draggable={false}
          noSwiping={true}
          allowTouchMove={false}
          pagination={{ clickable: true }}
          onSwiper={setThumbsSwiper}
          onSlideChange={(swiper) => setCurrentImage(swiper.activeIndex)}
        >
          {files.map((file, index) => (
            <SwiperSlide key={index}>
              <FixedCropper
                ref={imageRef[index]}
                stencilProps={{
                  movable: false,
                  grid: true,
                  handlers: false,
                  lines: false,
                  aspectRatio: ratio.x / ratio.y,
                }}
                stencilSize={{
                  width: 692,
                  height: 692,
                }}
                transformImage={{
                  adjustStencil: false,
                }}
                imageRestriction={ImageRestriction.stencil}
                className={cn(
                  "rounded-b-xl w-[692px] h-[692px] outline-none z-50",
                  postStep === "filter" || postStep === "post"
                    ? "rounded-br-none"
                    : ""
                )}
                src={file.preview}
                transitions={true}
                backgroundWrapperProps={{
                  scaleImage: false,
                }}
                backgroundComponent={AdjustableCropperBackground}
                backgroundProps={selectedPreset}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between z-50">
          <div className="flex gap-3 bg-contain">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={newMediaOpen}
                  size="icon"
                  className="bg-black/70 rounded-full h-8 w-8 hover:bg-black/50 data-[state=open]:bg-white"
                >
                  <Icons.selectCrop className="fill-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={16}
                className="w-[118px] bg-black/70 p-0 border-none"
              >
                <Button
                  onClick={() => {
                    // dispatch({
                    //   type: "SET_ASPECT_RATIO",
                    //   aspectRatio: "original",
                    // });
                    setAspectRatio("original");
                    setTimeout(() => {
                      onZoom(
                        0 / 200,
                        imageRef[currentImage],
                        files[currentImage].id
                      );
                    }, 100);
                  }}
                  className={cn(
                    "w-full h-12 bg-transparent rounded-b-none hover:bg-transparent text-igSecondaryText text-sm flex gap-2 justify-start items-center",
                    aspectRatio === "original" && "text-white"
                  )}
                >
                  Original
                  <Icons.photoOutline />
                </Button>
                <Separator orientation="horizontal" className="bg-black" />
                <Button
                  onClick={() => {
                    // dispatch({
                    //   type: "SET_ASPECT_RATIO",
                    //   aspectRatio: "square",
                    // });
                    setAspectRatio("square");
                    setTimeout(() => {
                      onZoom(
                        0 / 200,
                        imageRef[currentImage],
                        files[currentImage].id
                      );
                    }, 100);
                  }}
                  className={cn(
                    "w-full h-12 bg-transparent rounded-b-none hover:bg-transparent text-igSecondaryText text-sm flex gap-2 justify-start items-center",
                    aspectRatio === "square" && "text-white"
                  )}
                >
                  1:1
                  <Icons.cropSquare />
                </Button>
                <Separator orientation="horizontal" className="bg-black" />
                <Button
                  onClick={() => {
                    // dispatch({
                    //   type: "SET_ASPECT_RATIO",
                    //   aspectRatio: "portrait",
                    // });

                    setAspectRatio("portrait");

                    setTimeout(() => {
                      onZoom(
                        0 / 200,
                        imageRef[currentImage],
                        files[currentImage].id
                      );
                    }, 100);
                  }}
                  className={cn(
                    "w-full h-12 bg-transparent rounded-b-none hover:bg-transparent text-igSecondaryText text-sm flex gap-2 justify-start items-center",
                    aspectRatio === "portrait" && "text-white"
                  )}
                >
                  4:5
                  <Icons.cropPortrait />
                </Button>
                <Separator orientation="horizontal" className="bg-black" />
                <Button
                  onClick={() => {
                    // dispatch({
                    //   type: "SET_ASPECT_RATIO",
                    //   aspectRatio: "landscape",
                    // });
                    setAspectRatio("landscape");
                    setTimeout(() => {
                      onZoom(
                        0 / 200,
                        imageRef[currentImage],
                        files[currentImage].id
                      );
                    }, 100);
                  }}
                  className={cn(
                    "w-full h-12 bg-transparent rounded-b-none hover:bg-transparent text-igSecondaryText text-sm flex gap-2 justify-start items-center",
                    aspectRatio === "landscape" && "text-white"
                  )}
                >
                  16:9
                  <Icons.cropLandscape />
                </Button>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  disabled={newMediaOpen}
                  size="icon"
                  className="bg-black/70 rounded-full h-8 w-8 hover:bg-black/50 data-[state=open]:bg-white"
                >
                  <Icons.zoomIn className="fill-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={16}
                className="w-[132px] h-8 bg-black/70 p-0 border-none flex items-center justify-center rounded-lg px-3 py-2"
              >
                <ZoomSlider
                  value={[zoomLevels[files[currentImage]?.id]]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(zoom: number[]) => {
                    const [value] = zoom;
                    onZoom(
                      value / 200,
                      imageRef[currentImage],
                      files[currentImage].id
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Popover open={newMediaOpen} onOpenChange={setNewMediaOpen}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => toggleNewMediaOpen()}
                size="icon"
                className="bg-black/70 rounded-full h-8 w-8 hover:bg-black/50 data-[state=open]:bg-white"
              >
                <Icons.openMedia className="fill-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              sideOffset={16}
              className="h-fit w-fit bg-black/70 border-none flex items-center justify-center rounded-lg p-3"
            >
              <div className="flex gap-3">
                <div className="relative flex gap-2">
                  {files.length > 0 &&
                    files.map((file, index) => (
                      <div
                        role="button"
                        aria-label="Image thumbnail"
                        key={index}
                        onClick={() => slideTo(index)}
                      >
                        <div className="relative">
                          <div className="h-[94px] w-[94px]">
                            <div
                              className={cn(
                                "absolute inset-0 rounded-sm",
                                currentImage === index
                                  ? "bg-transparent"
                                  : "bg-black/40 z-10"
                              )}
                            />
                            <img
                              src={file.preview}
                              alt="post image"
                              className={
                                "rounded-sm overflow-hidden bg-black/80 h-[94px] w-[94px]"
                              }
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <Button
                            className="rounded-full border-none bg-black/70 hover:bg-black/30 h-5 w-5 p-0 absolute top-1 right-1 z-20"
                            variant="nav"
                            onClick={() => {
                              onDelete(file.id);
                            }}
                          >
                            <XIcon className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                <Button
                  className="rounded-full border hover:bg-transparent h-12 w-12 p-0"
                  variant="nav"
                  onClick={() => {
                    if (inputRef && inputRef.current) {
                      inputRef.current.click();
                    }
                  }}
                >
                  <Icons.plusIcon className="fill-igSecondaryTextV2" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* {postStep === "filter" && <FilterTabs />} */}
      {postStep === "filter" && <p>Filter here</p>}
      {postStep === "post" && (
        <PostEditor editor={editor} onSelect={onSelect} />
      )}
    </div>
  );
};
export default ImageEditor;
