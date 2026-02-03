import { createRouter, createWebHistory } from "vue-router";

// layouts
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";

// pages

// auth
import LoginPage from "@/pages/auth/LoginPage.vue";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.vue";

// dashboard
import HomePage from "@/pages/dashboard/HomePage.vue";
import PersonalStatisticPage from "@/pages/dashboard/PersonalStatisticPage.vue";

// management
import ClassRoomsPage from "@/pages/management/ClassRoomsPage.vue";
import DisciplinesPage from "@/pages/management/DisciplinesPage.vue";
import StudentsPage from "@/pages/management/StudentsPage.vue";

// resources
import HomeworksPage from "@/pages/resources/HomeworksPage.vue";
import S3FilesPage from "@/pages/resources/S3FilesPage.vue";

// settings
import AccountSettingsPage from "@/pages/settings/AccountSettingPage.vue";

// 404
import NotFoundPage from "@/pages/NotFoundPage.vue";

const routes = [
  // home / dashboard
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "homePage",
        meta: { title: "Дашборды" },
        component: HomePage,
      },
      {
        path: "statistics",
        name: "personalStatistic",
        meta: { title: "Статистика" },
        component: PersonalStatisticPage,
      },
    ],
  },

  // auth
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "loginPage",
        meta: { title: "Авторизация" },
        component: LoginPage,
      },
      {
        path: "reset-password",
        name: "resetPasswordPage",
        meta: { title: "Сброс пароля" },
        component: ResetPasswordPage,
      },
    ],
  },

  // management
  {
    path: "/management",
    component: DefaultLayout,
    children: [
      {
        path: "classrooms",
        name: "classRooms",
        meta: { title: "Аудитории" },
        component: ClassRoomsPage,
      },
      {
        path: "students",
        name: "students",
        meta: { title: "Студенты" },
        component: StudentsPage,
      },
      {
        path: "disciplines",
        name: "disciplines",
        meta: { title: "Дисциплины" },
        component: DisciplinesPage,
      },
    ],
  },

  // resources
  {
    path: "/resources",
    component: DefaultLayout,
    children: [
      {
        path: "homeworks",
        name: "homeworks",
        meta: { title: "Домашние задания" },
        component: HomeworksPage,
      },
      {
        path: "files",
        name: "s3Files",
        meta: { title: "S3 - Хранилище" },
        component: S3FilesPage,
      },
    ],
  },

  // settings
  {
    path: "/settings",
    component: DefaultLayout,
    children: [
      {
        path: "",
        name: "accountSettings",
        meta: { title: "Настройки" },
        component: AccountSettingsPage,
      },
    ],
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    component: EmptyLayout,
    children: [
      {
        path: "",
        name: "notFoundPage",
        meta: { title: "404" },
        component: NotFoundPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
