"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { InputRule, useEditor, wrappingInputRule } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import js from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import shell from "highlight.js/lib/languages/shell";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

import { createLowlight } from "lowlight";
// highlight.js 스타일시트 가져오기

import Details from "@tiptap-pro/extension-details";
import DetailsContent from "@tiptap-pro/extension-details-content";
import DetailsSummary from "@tiptap-pro/extension-details-summary";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Blockquote from "@tiptap/extension-blockquote";
import "highlight.js/styles/tokyo-night-dark.css";
import ImageResize from "tiptap-extension-resize-image";
import "./index.css";

const lowlight = createLowlight();

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("go", go);
lowlight.register("shell", shell);
lowlight.register("json", json);
lowlight.register("python", python);

const useTiptapEditor = (options?: { editable?: boolean; initialContent?: string | null }) =>
  useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        blockquote: false,
      }),
      ImageResize.configure({
        allowBase64: true,
      }),
      Blockquote.extend({
        addInputRules() {
          return [
            wrappingInputRule({
              find: /^\s*\|\s$/,
              type: this.type,
            }),
          ];
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),

      Details.configure({
        persist: true,
        HTMLAttributes: {
          class: "details",
        },
      }).extend({
        addInputRules() {
          return [
            new InputRule({
              find: /^\s*\>\s$/,
              handler({ chain, range }) {
                chain().focus().setTextSelection({ from: range.from, to: range.to }).deleteSelection().setDetails().run();
              },
            }),
          ];
        },
      }),
      DetailsSummary,
      DetailsContent,

      FileHandler.configure({
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
        onDrop: (currentEditor, files, pos) => {
          files.forEach((file) => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach((file) => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent);
              return false;
            }

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: "image",
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run();
            };
          });
        },
      }),
    ],
    content: options?.initialContent,
    immediatelyRender: false, // SSR 환경에서 hydration 불일치 방지
    editable: options?.editable,
  });

export default useTiptapEditor;
