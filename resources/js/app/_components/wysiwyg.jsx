import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function Wysiwyg({ label, name, value = "", onChange, error }) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        if (value == null) {
            setEditorState(EditorState.createEmpty());
        }
    }, [value]);

    // ✅ Load initial HTML value into editor when `value` changes
    useEffect(() => {
        if (!value) return;

        // Convert current editor to HTML
        const currentHTML = draftToHtml(
            convertToRaw(editorState.getCurrentContent()),
        );

        // Only update editorState if the incoming value is different
        if (value !== currentHTML) {
            const blocksFromHtml = htmlToDraft(value);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
                entityMap,
            );
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [value]);

    // ✅ Handle editor state changes
    const onEditorStateChange = (state) => {
        setEditorState(state);
        const html = draftToHtml(convertToRaw(state.getCurrentContent()));
        onChange(html === "<p></p>\n" ? "" : html);
    };

    return (
        <div className="mb-4">
            {label && <label className="block mb-1 font-medium">{label}</label>}
            <div className="border rounded">
                <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    editorClassName="p-2 min-h-[250px] max-h-[300px] overflow-y-auto"
                    toolbarClassName="border-b"
                    toolbar={{
                        options: [
                            "inline",
                            "blockType",
                            "fontSize",
                            "list",
                            "textAlign",
                            "link",
                            "history",
                        ],
                    }}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
