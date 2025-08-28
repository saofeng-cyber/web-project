import Quill from "quill";
import { QuillBinding } from "y-quill";
import "quill/dist/quill.snow.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import QuillCursors from "quill-cursors";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

Quill.register("modules/cursors", QuillCursors);

const quill = new Quill("#editor", {
  modules: {
    cursors: true,
    toolbar: toolbarOptions,
  },
  theme: "snow", // 'bubble' is also great
});

const yDoc = new Y.Doc();
const yText = yDoc.getText("quill");

new QuillBinding(yText, quill);

const wsProvider = new WebsocketProvider(
  "ws://localhost:1234",
  "my-roomName",
  yDoc
);

wsProvider.on("status", (event) => {
  console.log("连接状态:", event.status); // 如：connected, disconnected
});

wsProvider.on("connection-error", (event) => {
  console.error("连接错误:", event); // 如：连接错误信息
});

quill.on("text-change", (delta, oldDelta, source) => {
  if (source === "user") {
    console.log("用户输入:", delta);
  } else if (source === "api") {
    console.log("API调用:", delta);
  }
});

// =================== 测试 =======================

const btn = document.getElementById("btn");
btn?.addEventListener("click", () => {
  console.log("点击了按钮");
  quill.insertEmbed(
    0,
    "image",
    "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png"
  );
});
