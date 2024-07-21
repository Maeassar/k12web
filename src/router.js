import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from './components/UserLogin.vue';
import HomePage from './components/HomePage.vue';
import Part1_1 from "./components/Part1_1.vue";
import Part2_1 from "./components/Part2_1.vue";
import Part2_9 from "./components/Part2_9.vue";
import Part1_2 from "./components/Part1_2.vue"
import Part1_3 from "./components/Part1_3.vue"
import Part1_4 from "./components/Part1_4.vue"
import Part1_5 from "./components/Part1_5.vue"
import Part1_6 from "./components/Part1_6.vue"
import Part1_7 from "./components/Part1_7.vue"
import Part1_8 from "./components/Part1_8.vue"
import Part2_2 from "./components/Part2_2.vue"
import Part2_3 from "./components/Part2_3.vue"
import Part2_4 from "./components/Part2_4.vue"
import Part2_5 from "./components/Part2_5.vue"
import Part2_6 from "./components/Part2_6.vue"
import Part2_7 from "./components/Part2_7.vue"
import Part2_8 from "./components/Part2_8.vue"


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
        path: '/Part1_2',
        name: 'Part1_2',
        component: Part1_2
    },
    {
        path: '/Part1_3',
        name: 'Part1_3',
        component: Part1_3
    },
    {
        path: '/Part1_4',
        name: 'Part1_4',
        component: Part1_4
    },
    {
        path: '/Part1_5',
        name: 'Part1_5',
        component: Part1_5
    },
    {
        path: '/Part1_6',
        name: 'Part1_6',
        component: Part1_6
    },
    {
        path: '/Part1_7',
        name: 'Part1_7',
        component: Part1_7
    }, {
        path: '/Part1_8',
        name: 'Part1_8',
        component: Part1_8
    },
    {
        path: '/Part2_1',
        name:'Part2_1',
        component: Part2_1
    },
    {
        path: '/Part2_2',
        name: 'Part2_2',
        component: Part2_2
    },
    {
        path: '/Part2_3',
        name: 'Part2_3',
        component: Part2_3
    },
    {
        path: '/Part2_4',
        name: 'Part2_4',
        component: Part2_4
    },
    {
        path: '/Part2_5',
        name: 'Part2_5',
        component: Part2_5
    },
    {
        path: '/Part2_6',
        name: 'Part2_6',
        component: Part2_6
    },
    {
        path: '/Part2_7',
        name: 'Part2_7',
        component: Part2_7
    },
    {
        path: '/Part2_8',
        name: 'Part2_8',
        component: Part2_8
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
