import { createRouter, createWebHistory } from 'vue-router';

import AddPost from './components/AddPost.vue';
import PostPage from './components/PostPage.vue';

const routes = [
    { path: '/', component: AddPost },
    { path: '/post/:id', component: PostPage, props: true },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;