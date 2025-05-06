import { createRouter, createWebHashHistory } from 'vue-router';

import AddPost from './components/AddPost.vue';
import PostPage from './components/PostPage.vue';

const routes = [
    { path: '/', component: AddPost },
    { path: '/post/:id', component: PostPage, props: true },
];
const router = createRouter({
    //  createWebHashHistory совместим с file://
    //  createWebHistory - нет
    history: createWebHashHistory(),
    routes,
});

export default router;