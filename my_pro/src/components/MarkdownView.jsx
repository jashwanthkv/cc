import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function renderWithBreaks(node) {
  if (!node) return node;
  if (typeof node === "string") {
    if (/<br\s*\/?>/i.test(node)) {
      const parts = node.split(/<br\s*\/?>/gi);
      return parts.map((part, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <br />}
          {part}
        </React.Fragment>
      ));
    }
    return node;
  }
  if (Array.isArray(node)) {
    return node.map((item, idx) => (
      <React.Fragment key={idx}>{renderWithBreaks(item)}</React.Fragment>
    ));
  }
  if (React.isValidElement(node) && node.props?.children) {
    return React.cloneElement(node, {
      ...node.props,
      children: renderWithBreaks(node.props.children),
    });
  }
  return node;
}

const customComponents = {
  table: ({ node, ...props }) => (
    <div className="table-wrapper">
      <table {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th style={{ textAlign: "left", verticalAlign: "middle" }} {...props} />
  ),
  td: ({ node, children, ...props }) => (
    <td style={{ textAlign: "left", verticalAlign: "top" }} {...props}>
      {renderWithBreaks(children)}
    </td>
  ),
};

export default function MarkdownView({ content }) {
  if (!content) return null;
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
      {content}
    </ReactMarkdown>
  );
}

