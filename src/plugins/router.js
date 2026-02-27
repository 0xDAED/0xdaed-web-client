import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EmptyLayout from '@/layouts/EmptyLayout.vue'

// Home Pages
import HomePage from '@/pages/home/HomePage.vue'
import FeaturesPage from '@/pages/home/FeaturesPage.vue'

// Dashboard Pages
import StudentDashboard from '@/pages/dashboards/StudentDashboard.vue'
import ComputerDashboard from '@/pages/dashboards/ComputerDashboard.vue'
import UserStatistic from '@/pages/dashboards/UserStatistic.vue'

// Disciplines Pages
import DisciplinesPage from '@/pages/disciplines/DisciplinesPage.vue'

// HomeWork Pages
import HomeWork from '@/pages/homeworks/HomeWork.vue'

// Forms & Quiz Pages
import FormsPage from '@/pages/forms/FormsPage.vue'
import QuizPage from '@/pages/forms/QuizPage.vue'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage.vue'
import ResetPassword from '@/pages/auth/ResetPassword.vue'

// Any Pages
import S3Storage from '@/pages/s3/S3Storage.vue'
import UserSettings from '@/pages/settings/UserSettings.vue'
import NotFound from '@/pages/NotFound.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: HomePage,
        meta: {
          title: 'Home',
        },
      },
      {
        path: 'features',
        component: FeaturesPage,
        meta: {
          title: 'features',
        },
      },
    ],
  },
  {
    path: '/auth',
    component: DefaultLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
        meta: {
          title: 'login',
        },
      },
      {
        path: 'reset-password',
        component: ResetPassword,
        meta: {
          title: 'resetPassword',
        },
      },
    ],
  },
  {
    path: '/dashboard',
    component: DefaultLayout,
    children: [
      {
        path: 'students',
        component: StudentDashboard,
        meta: {
          title: 'studentDashboard',
        },
      },
      {
        path: 'computers',
        component: ComputerDashboard,
        meta: {
          title: 'computerDashboard',
        },
      },
      {
        path: 'statistic',
        component: UserStatistic,
        meta: {
          title: 'userStatistic',
        },
      },
    ],
  },
  {
    path: '/disciplines',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: DisciplinesPage,
        meta: {
          title: 'disciplines',
        },
      },
    ],
  },
  {
    path: '/homeWorks',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: HomeWork,
        meta: {
          title: 'homeWorks',
        },
      },
    ],
  },
  {
    path: '/forms',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: FormsPage,
        meta: {
          title: 'forms',
        },
      },
      {
        path: 'quiz',
        component: QuizPage,
        meta: {
          title: 'quiz',
        },
      },
    ],
  },
  {
    path: '/services',
    component: DefaultLayout,
    children: [
      {
        path: 's3',
        component: S3Storage,
        meta: {
          title: 's3',
        },
      },
      {
        path: 'settings',
        component: UserSettings,
        meta: {
          title: 'userSettings',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: EmptyLayout,
    children: [
      {
        path: '',
        component: NotFound,
        meta: {
          title: 'notFound',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
