<template>
    <div class="text-editor">
      <div class="editor-toolbar mb-2">
        <button
          @click.prevent="editor?.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor?.isActive('bold') }"
        >
          <b>B</b>
        </button>
        <button
          @click.prevent="editor?.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor?.isActive('italic') }"
        >
          <i>I</i>
        </button>
        <button
          @click.prevent="editor?.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor?.isActive('strike') }"
        >
          <s>S</s>
        </button>
        <button
          @click.prevent="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
        >
          H1
        </button>
        <button
          @click.prevent="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
        >
          H2
        </button>
        <button
          @click.prevent.prevent="editor?.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor?.isActive('bulletList') }"
        >
          UL
        </button>
        <button
          @click.prevent="editor?.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor?.isActive('orderedList') }"
        >
          OL
        </button>
      </div>
  
      <editor-content :editor="editor" class="editor-content border border-gray-300 rounded-md p-4 min-h-[150px]" />
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  import { useEditor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML());
    },
  });
  
  watch(
    () => props.modelValue,
    (newValue) => {
      if (editor.value && newValue !== editor.value.getHTML()) {
        editor.value.commands.setContent(newValue, false);
      }
    }
  );

  onUnmounted(() => {
    editor.value?.destroy();
  });
  </script>
  
  <style>
  .editor-toolbar button {
    margin-right: 8px;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .editor-toolbar button.is-active {
    background-color: #007bff;
    color: white;
  }
  
  .editor-content {
    outline: none;
  }
  .tiptap{
    min-height: 150px;
    outline: none;
  }
  </style>