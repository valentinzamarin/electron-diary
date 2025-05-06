<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Добавить пост</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Заголовок</label>
        <input
          v-model="post.title"
          id="title"
          type="text"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700">Содержание</label>
        <TextEditor v-model="post.content" />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md">
        Добавить пост
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TextEditor from './TextEditor.vue';

const post = ref({
  title: '',
  content: '',
});

const handleSubmit = async () => {
  try {
    await window.api.invoke('add-post', {
      title: post.value.title,
      content: post.value.content,
    });

    post.value = { title: '', content: '' };
  } catch (error) {
    console.error('Ошибка при добавлении поста:', error);
  }
};
</script>