⚡ EduManagement – Система управления образовательным процессом

EduManagement – это современная веб-система для управления учебными процессами, ресурсами и пользователями. Проект построен с использованием модульной архитектуры, где каждая часть может развиваться и обновляться независимо, но работает в единой экосистеме.

🏗 Архитектура системы

```

[Vue.js Frontend] <---> [Vuetify UI Components]
|
v
[Backend API / Services]

```

Компоненты
----------

### Веб-клиент (frontend)

**Технологии:** Vue 3, Vuetify, Pinia, Axios, Tailwind CSS  
**Назначение:** визуализация данных, управление пользователями, классами, дисциплинами и ресурсами через удобный UI.  
**Особенности:** интерактивные таблицы, дашборды, фильтры, поддержка live обновлений.

### Страницы и модули

- **Auth:** LoginPage.vue, ResetPasswordPage.vue — аутентификация и восстановление пароля.  
- **Dashboard:** HomePage.vue, PersonalStatisticPage.vue — главная панель и персональная статистика.  
- **Management:** ClassRoomsPage.vue, DisciplinesPage.vue, StudentsPage.vue — управление учебными объектами.  
- **Resources:** HomeworksPage.vue, S3FilesPage.vue — управление заданиями и файлами.  
- **Settings:** AccountSettingPage.vue — пользовательские настройки.  
- **Layouts:** AuthLayout.vue, DefaultLayout.vue, EmptyLayout.vue — различные шаблоны страниц.  

📦 Структура проекта

```

src/
├── assets/          # изображения и медиа
├── components/      # переиспользуемые компоненты, например AppSidebar.vue
├── constants/       # константы и конфигурации, например navigation.js
├── layouts/         # шаблоны страниц
├── pages/           # страницы приложения
├── plugins/         # плагины Vue, роутер, Vuetify
├── services/        # сервисы для работы с API
├── App.vue          # корневой компонент
├── main.js          # точка входа

````

⚙️ Как начать

1. Клонируйте репозиторий:
```bash
git clone <url_репозитория>
cd <папка_проекта>
````

2. Установите зависимости:

```bash
yarn install
# или npm install
```

3. Запустите проект:

```bash
yarn dev
# или npm run dev
```

🛠 Технологический стек

* **Frontend:** Vue 3, Vuetify, Pinia, Tailwind CSS, Axios
* **Сборка и Dev Tools:** Vite, Yarn / NPM
* **Структура проекта:** модульные страницы и компоненты, поддержка переиспользуемых layout’ов

👥 Авторы и участники

* DevLead: k1rson
* DevLead: mironovv

🙏 Благодарности

* Комьюнити Vue.js, Vuetify и Tailwind CSS за отличную документацию и примеры.
* Open Source проекты, которые вдохновили архитектуру и подход к компонентам.

🔗 Ссылки

* [Документация по Vuetify](https://vuetifyjs.com/)
* [Документация Vue 3](https://vuejs.org/)

📌 Контакты

Для вопросов и предложений используйте issues в репозитории или свяжитесь с командой через e-mail: [dev@test.mail](mailto:contact@xdaed.tech)
