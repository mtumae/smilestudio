// components/BlogEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

export default function BlogEditor({ 
  initialContent, 
  onUpdate 
}: { 
  initialContent?: string
  onUpdate: (content: string) => void 
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    }
  })

  return <EditorContent editor={editor} />
}