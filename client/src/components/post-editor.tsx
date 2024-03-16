"use client";

import { EditorContent, Editor } from "@tiptap/react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import EmojiPicker from "@/components/emoji-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentSession } from "./session-provider";
import { LIMIT } from "@/lib/config";

type PostEditorProps = {
  editor: Editor | null;
  onSelect: (data: string) => void;
};

const PostEditor = ({ editor, onSelect }: PostEditorProps) => {
  const {
    session: { user },
  } = useCurrentSession();

  return (
    <div className="h-full w-full p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-7 w-7">
          <AvatarImage src={user?.image || ""} alt={`@${user?.username}`} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold">{user?.username}</span>
      </div>
      <EditorContent
        editor={editor}
        className="h-[160px] min-h-[170px]  mb-2"
      />
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-fit w-fit p-0 bg-transparent hover:bg-transparent border-none"
            >
              <Icons.emoji className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-fit p-0 bg-transparent border-none"
            side="top"
            align="start"
            avoidCollisions
          >
            <EmojiPicker onSelect={onSelect} />
          </PopoverContent>
        </Popover>
        <span className="text-xs text-[#c7c7c7]">
          {editor?.storage.characterCount.characters()}/{LIMIT}
        </span>
      </div>
    </div>
  );
};
export default PostEditor;
