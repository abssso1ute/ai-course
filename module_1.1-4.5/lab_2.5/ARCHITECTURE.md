1. Карта компонентов (Atomic Design)

Страница / (Главная):

Atoms: Button, Text, Badge
Molecules: NewsCard (карточка новости), QuickLinkItem
Organisms: HeroSection, NewsList
Templates: MainLayout (header + content + footer)

Страница /tasks:

Atoms: Checkbox, Button, Input
Molecules: TaskItem (чекбокс + текст + статус)
Organisms: TaskList, AddTaskForm
Templates: TasksLayout

Страница /profile:

Atoms: Input, Button, Avatar
Molecules: FormField (label + input + error)
Organisms: ProfileForm
Templates: ProfileLayout

Переиспользуемые компоненты из прошлых ЛР:

Button (атом)
FormInput / Input (атом)
Modal (организм)
Card (молекула/организм)
Form validation utils
2. Состояние приложения (state)

Глобальное состояние:

user (имя, email, аватар)
tasks (список задач + статус выполнения)

Нужно глобально, потому что используется на разных страницах

Локальное состояние:

состояние модалок (open/close)
состояние инпутов форм
фильтры задач

Управление состоянием:
Я бы выбрал Pinia (Vue) или Zustand (React)

Почему:

простая структура
меньше “шумного” кода по сравнению с Redux
удобно делить глобальные данные (user/tasks)
хорошо подходит для SPA среднего размера
3. Маршруты
/ — главная страница (Home)
/tasks — список задач
/profile — профиль пользователя