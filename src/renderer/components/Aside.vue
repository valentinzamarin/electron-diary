<template>
  <aside class="aside">
    <div class="flex flex-col h-screen">
      <div class="border-b-[1px] border-slate-200 p-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Найти..."
          class="w-full outline-none p-2 border border-gray-300 rounded-md"
          @input="filterPosts"
        />
      </div>
      <div class="overflow-y-scroll no-scrollbar">
        <div v-if="filteredPosts.length > 0" v-for="item in filteredPosts" :key="item.id" class="border-b-[1px] last:border-b-[0px] border-slate-200 cursor-pointer" @click="openPost(item.id)">
        <div class="p-4">
          {{ item.title }}
          <span class="flex text-xs text-gray-500">
            {{ formatDate(item.created_at) }}
          </span>
        </div>
      </div>
      <div v-else>
        <p class="p-4">
          Ничего нет
        </p>
      </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const posts = ref([]);
const searchQuery = ref('');
const filteredPosts = ref([]);

const router = useRouter();

const loadPosts = async () => {
    try {
        const loadedPosts = await window.api.invoke('load-posts');
        posts.value = loadedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        filterPosts();
    } catch (error) {
        console.error('Ошибка при загрузке постов:', error);
    }
};

const filterPosts = () => {
    filteredPosts.value = posts.value.filter(post =>
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const openPost = (postId) => {
    router.push({ path: `/post/${postId}` });
};

onMounted(() => {
    loadPosts();

    window.api.on('post-added', () => {
        loadPosts();
    });

    window.api.on('post-deleted', () => {
        loadPosts();
    });
});
</script>
