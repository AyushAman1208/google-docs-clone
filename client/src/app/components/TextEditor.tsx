"use client";
import "react-quill/dist/quill.snow.css";
import { Quill } from "react-quill";
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function TextEditor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  },[]);

  useEffect(() =>{
    if(socket == null || quill ==null) {
      return;
    }
    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on("receive-change",handler);

    return () => {
      quill.off("receive-change",handler);
    }

  },[socket,quill])
  useEffect(() =>{
    if(socket == null || quill ==null) {
      return;
    }
    const handler = (delta, oldDelta, source) => {
      if(source!= 'user')return;
      socket.emit("send-changes",delta)
    }
    quill.on("text-change",handler);

    return () => {
      quill.off("text-change",handler);
    }

  },[socket,quill])
  const wrapperRef = useCallback((wrapper: any) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q= new Quill(editor, { theme: "snow" });
    setQuill(q);
  }, []);
  return (
    <>
      <div ref={wrapperRef}>
        Hello
      </div>
    </>
  );
}

export default TextEditor;
