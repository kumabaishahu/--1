import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    children: [
      // 智能驻场
      {
        path: 'user-success',
        name: 'UserSuccess',
        component: () => import('../components/UserSuccess.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'online-customer-service',
        name: 'OnlineCustomerService',
        component: () => import('../components/OnlineCustomerService.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'operation-engineer',
        name: 'OperationEngineer',
        component: () => import('../components/OperationEngineer.vue'),
        meta: { keepAlive: true }
      },
      // 培训经理菜单
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('../components/UserManagement.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'course-management',
        name: 'CourseManagement',
        component: () => import('../components/CourseManagement.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'study-record',
        name: 'StudyRecord',
        component: () => import('../components/StudyRecord.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'data-statistic',
        name: 'DataStatistic',
        component: () => import('../components/DataStatistic.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'system-maintenance',
        name: 'SystemMaintenance',
        component: () => import('../components/SystemMaintenance.vue'),
        meta: { keepAlive: true }
      },
      // 培训总监菜单
      {
        path: 'training-plan',
        name: 'TrainingPlan',
        component: () => import('../components/TrainingPlan.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'trainer-management',
        name: 'TrainerManagement',
        component: () => import('../components/TrainerManagement.vue'),
        meta: { keepAlive: true }
      },
      {
        path: 'data-analysis',
        name: 'DataAnalysis',
        component: () => import('../components/DataAnalysis.vue'),
        meta: { keepAlive: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
