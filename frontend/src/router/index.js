import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import UserManagement from '../components/UserManagement.vue';
import CourseManagement from '../components/CourseManagement.vue';
const routes = [
  {
    path: '/',
    name: 'root',
    redirect: "/homepage",
    props: {
      msg: 'Hello Vue 3 + Element Plus'
    }
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: HomePage,
    props: {
      msg: 'Hello World Page'
    },
    children: [
      {
        path: '/usermanagement',
        name: 'usermanagement',
        component: UserManagement
      }
    ],
    children:[
      {
        path: '/coursemanagement',
        name: 'coursemanagement',
        component: CourseManagement
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
