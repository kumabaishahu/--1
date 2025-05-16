import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import UserManagement from '../components/UserManagement.vue';
import CourseManagement from '../components/CourseManagement.vue';
const routes = [
  {
    path: '/',
    name: 'root',
    redirect: "/homepage"
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: HomePage,
    children: [
      {
        path: '/user_management',
        name: 'user_management',
        component: UserManagement
      },
      {
        path: '/course_management',
        name: 'course_management',
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
