export const navigation = [
  {
    group: "dashboard",
    items: [
      {
        title: "Дашборды",
        icon: "mdi-view-dashboard-outline",
        route: "homePage",
      },
      {
        title: "Статистика",
        icon: "mdi-chart-arc",
        route: "personalStatistic",
      },
    ],
  },
  {
    group: "management",
    items: [
      { title: "Аудитории", icon: "mdi-desktop-classic", route: "classRooms" },
      {
        title: "Студенты",
        icon: "mdi-account-school-outline",
        route: "students",
      },
      {
        title: "Дисциплины",
        icon: "mdi-note-multiple-outline",
        route: "disciplines",
      },
    ],
  },
  {
    group: "resources",
    items: [
      {
        title: "Домашние задания",
        icon: "mdi-file-account-outline",
        route: "homeworks",
      },
      { title: "Хранилище S3", icon: "mdi-file-cabinet", route: "s3Files" },
    ],
  },
];
