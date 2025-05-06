<template>
  <div  class="p-4 post-page">
    <div v-if="!isEditing">
      <h1 class="text-2xl font-bold">{{ post.title }}</h1>
      <div class="mt-2 text-gray-700" v-html="post.content"></div>
      <p class="mt-2 text-sm text-gray-500">Дата создания: {{ formatDate(post.created_at) }}</p>
      <button
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
        @click="startEditing"
      >
        Редактировать
      </button>
      <button
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded-md mr-2"
        @click="deletePostHandler"
      >
        Удалить
      </button>
      <button
        class="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
        @click="goBack"
      >
        Назад
      </button>
    </div>

    <div v-else>
      <h2 class="text-xl font-bold mb-4">Редактировать пост</h2>
      <form @submit.prevent="saveChanges" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Заголовок</label>
          <input
            v-model="editedPost.title"
            id="title"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700">Содержание</label>
          <TextEditor v-model="editedPost.content" />
        </div>
        <button
          type="submit"
          class="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Сохранить
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-md"
          @click="cancelEditing"
        >
          Отмена
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TextEditor from './TextEditor.vue';

const route = useRoute(); 
const router = useRouter(); 
const post = ref({ title: '', content: '', created_at: '' });
const isEditing = ref(false); 
const editedPost = ref({ title: '', content: '' }); 

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

watchEffect(async () => {
    const postId = route.params.id; 
    if (postId) {
        try {
            const postData = await window.api.invoke('get-post-by-id', postId); 
            post.value = postData || { title: '', content: '', created_at: '' }; 
            editedPost.value = { ...post.value }; 
        } catch (error) {
            console.error('Ошибка при загрузке поста:', error);
        }
    }
});

const startEditing = () => {
    isEditing.value = true;
};

const cancelEditing = () => {
    isEditing.value = false;
    editedPost.value = { ...post.value }; 
};

const saveChanges = async () => {
    try {
        const postId = route.params.id;
        await window.api.invoke('update-post', {
            postId,
            title: editedPost.value.title,
            content: editedPost.value.content,
        });

        post.value = { ...editedPost.value }; 
        isEditing.value = false; 
    } catch (error) {
        console.error('Ошибка при сохранении изменений:', error);
    }
};

const deletePostHandler = async () => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот пост?');
    if (confirmDelete) {
        try {
            const postId = route.params.id;
            await window.api.invoke('delete-post', postId);
            alert('Пост успешно удален!');
            router.push('/'); 
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
            alert('Произошла ошибка при удалении поста.');
        }
    }
};


const goBack = () => {
    router.push('/'); 
};
</script>