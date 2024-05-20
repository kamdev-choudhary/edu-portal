import React from "react";
import { Editor } from "@tinymce/tinymce-react";

export function TinyBox(props) {
  const { content, onContentChange } = props;
  return (
    <Editor
      apiKey="o9adc3d0e8icjmn90btn0tfps73vsqpqqry3xb7do5xyqnxm"
      init={{
        plugins: " image lists table wordcount ",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline  charmap | typography | lineheight | checklist numlist bullist indent outdent | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "kD",
        mergetags_list: [
          { value: "Kamdev", title: "Kamdev CHoudhary" },
          { value: "Email", title: "Email" },
        ],
      }}
      value={content}
      onEditorChange={onContentChange}
    />
  );
}

export function TinyBox2(props) {
  const height = props.height;

  const { content, onContentChange } = props;
  return (
    <Editor
      apiKey="o9adc3d0e8icjmn90btn0tfps73vsqpqqry3xb7do5xyqnxm"
      init={{
        height: 200,
        plugins: " image lists table wordcount",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline  charmap | typography | lineheight | checklist numlist bullist indent outdent | removeformat",
        tinycomments_mode: "embedded",
        tinycomments_author: "kD",
        mergetags_list: [
          { value: "Kamdev", title: "Kamdev CHoudhary" },
          { value: "Email", title: "Email" },
        ],
      }}
      value={content}
      onEditorChange={onContentChange}
    />
  );
}

export function TinyBoxReadOnly(props) {
  const { height, content } = props;
  return (
    <Editor
      apiKey="o9adc3d0e8icjmn90btn0tfps73vsqpqqry3xb7do5xyqnxm"
      init={{
        readonly: true,
        menubar: false,
        height: height,
        width: "100%",
        toolbar: false,
      }}
      value={content}
    />
  );
}
