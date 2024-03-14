import { EditorContent, useEditor } from "@tiptap/react";

import EmojiPicker from "./emoji-picker";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  CreateCommentDocument,
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from "@/lib/graphql/__generated__/graphql";

const CommentEditor = ({ postId }: { postId?: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const editor = useEditor({
    onCreate() {
      setIsLoading(false);
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Add a comment...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "text-primary text-sm leading-[18px] focus-visible:ring-none focus-visible:outline-none placeholder:text-primary min-h-[100%] min-w-[100%] anti-aliased",
      },
    },
  });

  const onSelect = (data: string) => {
    if (!editor) {
      return;
    }
    editor.chain().focus().insertContent(data).run();
  };

  const [mutate, { loading }] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(CreateCommentDocument, {
    variables: {
      comment: {
        comment: editor?.getHTML() ?? "",
        postId: postId ? postId : "",
      },
    },
    onCompleted: () => {
      editor?.commands.clearContent();
    },
  });

  const handleComment = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="tiptap ProseMirror text-sm leading-[18px] h-[18px]">
        <div className="flex items-center justify-between gap-2">
          <p
            data-placeholder="Add a comment..."
            className="is-empty is-editor-empty"
          >
            <br className="ProseMirror-trailingBreak" />
          </p>
          <Button variant="outline" size="icon" className="p-0 h-fit w-fit">
            <Icons.emoji />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-1">
      {loading ? (
        <div className="flex items-center justify-center w-full">
          <img
            src="/assets/loading-spinner.svg"
            width={18}
            height={18}
            alt="Loading spinner"
            className="animate-spin"
          />
        </div>
      ) : (
        <EditorContent editor={editor} className="w-[88%]" />
      )}
      <div className="flex items-center gap-2 w-fit">
        {!editor?.isEmpty && (
          <Button
            onClick={handleComment}
            className="text-sm font-semibold hover:bg-transparent text-igPrimary p-0 h-[18px] w-fit"
            variant="ghost"
          >
            Post
          </Button>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="p-0 h-fit w-fit">
              <Icons.emoji />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80"
            side="top"
            align="start"
            avoidCollisions
          >
            <EmojiPicker onSelect={onSelect} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
export default CommentEditor;
