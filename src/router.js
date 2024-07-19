import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from './components/UserLogin.vue';
import HomePage from './components/HomePage.vue';
import Part1_1 from "./components/Part1_1.vue";
import Part2_1 from "./components/Part2_1.vue";
import Part2_9 from "./components/Part2_9.vue";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: UserLogin
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
        props: route => ({ name: route.query.name, permission: Number(route.query.permission) })
    },
    {
        path: '/Part1_1',
        name:'Part1_1',
        component: Part1_1
    },
    {
        path: '/Part2_1',
        name:'Part2_1',
        component: Part2_1
    },
    {
        path: '/Part2_9',
        name:'Part2_9',
        component: Part2_9
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
