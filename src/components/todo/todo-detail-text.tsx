"use client";

import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { TodoList } from "@/components/todo/type";
import { handleTextSave } from "@/components/todo/action";
import { Button, Card, Group, TypographyStylesProvider } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TodoDetailText = ({ todo }: { todo: TodoList }) => {
  const text = todo.text;
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: todo.text || "",
  });

  const handleSave = async () => {
    if (!editor) return;

    try {
      const editorText = editor.getHTML();

      await handleTextSave({
        id: todo.id,
        text: editorText,
      });
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setIsEdit(false);
    }
  };

  return (
    <div>
      {isEdit ? (
        <>
          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
          <Group mt="md" justify="flex-end">
            <Button onClick={() => setIsEdit(false)}>キャンセル</Button>
            <Button onClick={handleSave} color="orange">
              テキストを保存
            </Button>
          </Group>
        </>
      ) : (
        <>
          {text ? (
            <>
              <Group mb="md">
                <Button onClick={() => setIsEdit(true)}>テキスト編集</Button>
              </Group>
              <Card
                key={todo.id}
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
              >
                <TypographyStylesProvider>
                  <div dangerouslySetInnerHTML={{ __html: text }} />
                </TypographyStylesProvider>
              </Card>
            </>
          ) : (
            <Group mb="md">
              <Button onClick={() => setIsEdit(true)} color="orange">テキスト追加</Button>
            </Group>
          )}
          <Group justify="center" mt="lg">
            <Button onClick={() => router.back()} fullWidth maw={300}>
              戻る
            </Button>
          </Group>
        </>
      )}
    </div>
  );
};

export default TodoDetailText;
