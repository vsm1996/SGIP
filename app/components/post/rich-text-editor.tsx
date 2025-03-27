'use client';

import React, { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface RichTextEditorProps {
  onChange: (text: string, html: string) => void;
  initialContent?: string;
  placeholder?: string;
}

const RichTextEditor = ({ onChange, initialContent = '', placeholder = 'What\'s on your mind?' }: RichTextEditorProps) => {
  // Initialize editor state from HTML content if provided
  const getInitialState = () => {
    if (initialContent) {
      const contentBlock = htmlToDraft(initialContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  };

  const [editorState, setEditorState] = useState(getInitialState());

  const onEditorStateChange = (newState: EditorState) => {
    setEditorState(newState);

    // Get plain text
    const plainText = newState.getCurrentContent().getPlainText();

    // Get HTML
    const rawContentState = convertToRaw(newState.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);

    // Pass both to parent component
    onChange(plainText, htmlContent);
  };

  return (
    <div className="rich-text-editor border border-base-300 rounded-lg overflow-hidden bg-base-100">
      <Editor
        editorState={editorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class p-4 min-h-[150px]"
        toolbarClassName="toolbar-class border-b border-base-300 bg-base-200"
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder}
        toolbar={{
          options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
          blockType: {
            options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote'],
          },
          textAlign: {
            options: ['left', 'center', 'right'],
          },
        }}
      />
    </div>
  );
};

export default RichTextEditor;