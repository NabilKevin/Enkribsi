/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({setContent, content}) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (!quillInstance.current && editorRef.current) {
      // Inisialisasi Quill Editor
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow", // Tema Snow
      });
      quillInstance.current.on("text-change", () => {
        const content = quillInstance.current.root.innerHTML; 
        setContent(content)
      });
    }
    if(content) {
      quillInstance.current.root.innerHTML = content
    }
  }, []);

  return (
    <div ref={editorRef} style={{ height: "300px" }}></div>
  )
};

export default QuillEditor;