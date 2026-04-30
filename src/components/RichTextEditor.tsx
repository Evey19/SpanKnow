import { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Highlighter,
  Paintbrush,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RichTextEditorProps = {
  value: string;
  onChange: (nextHtml: string) => void;
  placeholder?: string;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  compact = false,
  className,
}: RichTextEditorProps) {
  const extensions = useMemo(() => {
    return [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: placeholder ?? "",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:float-left before:text-muted-foreground before:pointer-events-none before:h-0",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ];
  }, [placeholder]);

  const editor = useEditor({
    extensions,
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "tiptap min-h-32 w-full rounded-b-xl border border-t-0 border-input bg-background px-4 py-4 text-base outline-none focus-within:bg-muted/50 transition-colors",
          compact && "min-h-24 py-3"
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const normalized = value || "";
    if (editor.isEmpty && normalized === "") return;
    if (current === normalized) return;
    editor.commands.setContent(normalized);
  }, [editor, value]);

  return (
    <div className={cn("flex flex-col shadow-sm rounded-xl", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-input bg-muted/60 px-2 py-1.5 sticky top-0 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("bold") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>加粗 (⌘B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("italic") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>斜体 (⌘I)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("strike") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除线 (⌘⇧X)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
            >
              <Paintbrush size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>清除格式</TooltipContent>
        </Tooltip>
        
        <div className="mx-1 h-4 w-px bg-border" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("heading", { level: 1 }) && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>一级标题 (⌘⌥1)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("heading", { level: 2 }) && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>二级标题 (⌘⌥2)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("heading", { level: 3 }) && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>三级标题 (⌘⌥3)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("heading", { level: 4 }) && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
            >
              <Heading4 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>四级标题 (⌘⌥4)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("heading", { level: 5 }) && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
            >
              <Heading5 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>五级标题 (⌘⌥5)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("heading", { level: 6 }) && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
            >
              <Heading6 size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>六级标题 (⌘⌥6)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative group/color-picker">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
                disabled={disabled || !editor}
              >
                <Highlighter size={16} />
                <div 
                  className="absolute bottom-1 left-1.5 right-1.5 h-[3px] rounded-full" 
                  style={{ backgroundColor: editor?.getAttributes('textStyle').color || 'currentColor' }}
                />
              </Button>
              <input
                type="color"
                onInput={event => editor?.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                value={editor?.getAttributes('textStyle').color || '#000000'}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="选择颜色"
                disabled={disabled || !editor}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>文本颜色</TooltipContent>
        </Tooltip>

        <div className="mx-1 h-4 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("bulletList") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>无序列表 (⌘⇧8)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("orderedList") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>有序列表 (⌘⇧7)</TooltipContent>
        </Tooltip>
        
        <div className="mx-1 h-4 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("blockquote") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>引用块 (⌘⇧9)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("codeBlock") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            >
              <Code size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>代码块 (⌘⌥C)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                editor?.isActive("link") && "bg-accent text-accent-foreground hover:bg-accent/80"
              )}
              disabled={disabled || !editor}
              onClick={() => {
                const prev = editor?.getAttributes("link").href as string | undefined;
                const href = window.prompt("输入链接 URL", prev ?? "");
                if (!href) {
                  editor?.chain().focus().unsetLink().run();
                  return;
                }
                editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
              }}
            >
              <Link2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>插入链接</TooltipContent>
        </Tooltip>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
