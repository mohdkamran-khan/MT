import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const RichTextEditor = ({ placeholder, input, setInput }) => {
  const editor = useRef(null);
  const handleChange = (content) => {
    setInput({ ...input, description: content });
  };

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Enter a detailed course description...",
    }),
    [placeholder]
  );

  return (
    <JoditEditor
      ref={editor}
      value={input.description}
      config={config}
      theme="snow"
      tabIndex={1} // tabIndex of textarea
      onChange={handleChange}
    />
  );
};
export default RichTextEditor;
