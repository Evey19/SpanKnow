import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import DOMPurify from "dompurify";
import { normalizePipeTablesHtml } from "@/lib/normalizePipeTablesHtml";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  const schemaTagNames = (defaultSchema.tagNames ?? []) as string[];
  const schemaAttributes = (defaultSchema.attributes ?? {}) as Record<string, unknown>;
  const tableAttributes = (schemaAttributes.table ?? []) as string[];
  const thAttributes = (schemaAttributes.th ?? []) as string[];
  const tdAttributes = (schemaAttributes.td ?? []) as string[];

  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
      ...schemaTagNames,
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
    ],
    attributes: {
      ...schemaAttributes,
      table: [...tableAttributes],
      th: [
        ...thAttributes,
        "align",
        "colspan",
        "rowspan",
      ],
      td: [
        ...tdAttributes,
        "align",
        "colspan",
        "rowspan",
      ],
    },
  };

  if (isHtml) {
    const normalized = normalizePipeTablesHtml(content);
    const sanitized = DOMPurify.sanitize(normalized, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ["table", "thead", "tbody", "tfoot", "tr", "th", "td"],
      ADD_ATTR: ["colspan", "rowspan", "align", "class", "target", "rel"],
    });

    const wrapperClassName = ["tiptap", className].filter(Boolean).join(" ");
    return <div className={wrapperClassName} dangerouslySetInnerHTML={{ __html: sanitized }} />;
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        components={{
          a: ({ children, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-muted-foreground/70"
            >
              {children}
            </a>
          ),
          p: ({ children }) => (
            <p className="my-1.5 first:mt-0 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-1.5 pl-5 list-disc space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 pl-5 list-decimal space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-border pl-3 text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ children, ...props }) => (
            <code
              {...props}
              className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground"
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-xl bg-foreground p-3 text-[13px] leading-relaxed text-background">
              {children}
            </pre>
          ),
          h1: ({ children }) => (
            <h1 className="mt-2.5 mb-1.5 text-[17px] font-extrabold tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-2.5 mb-1.5 text-[16px] font-bold tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-2.5 mb-1.5 text-[15px] font-bold tracking-tight">
              {children}
            </h3>
          ),
          hr: () => <hr className="my-2 border-border" />,
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto">
              <table className="w-full border-separate border-spacing-0 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-2 py-1 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-2 py-1 align-top">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
