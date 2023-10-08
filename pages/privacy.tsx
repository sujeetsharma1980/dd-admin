import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

function Privacy() {
  const [value, setValue] = useState("**Hello world!!!**");
  return (
    <div >
      <MDEditor value={value} onChange={setValue} />
      <button className="bg-white">Save</button>
    </div>
  );
}

export default Privacy;