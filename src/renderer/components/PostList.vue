<template>
    <div>
      <h2>Список постов</h2>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <h3>{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <small>{{ new Date(post.created_at).toLocaleString() }}</small>
          <div>Теги: {{ post.tags.join(', ') }}</div>
        </li>
      </ul>
  
      <h2>Добавить новый пост</h2>
      <form @submit.prevent="addPost">
        <input v-model="newPost.title" placeholder="Заголовок" required />
        <textarea v-model="newPost.content" placeholder="Текст поста" required></textarea>
        <input v-model="newPost.tags" placeholder="Теги (через запятую)" />
        <button type="submit">Добавить пост</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  
  const posts = ref([]);
  const newPost = ref({
    title: '',
    content: '',
    tags: '',
  });
  
  
  const loadPosts = async () => {
    posts.value = await window.api.invoke('load-posts');
  };
  
  
  const addPost = async () => {
    const tags = newPost.value.tags.split(',').map(tag => tag.trim());
    await window.api.invoke('add-post', {
      title: newPost.value.title,
      content: newPost.value.content,
      tags,
    });
    newPost.value = { title: '', content: '', tags: '' }; 
    loadPosts(); 
  };
  
  onMounted(() => {
    loadPosts();
  });
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
  }
  
  input, textarea {
    display: block;
    margin-bottom: 10px;
    width: 100%;
    padding: 10px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  </style>