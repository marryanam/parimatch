# Webpack Frontend Project

Сучасний фронтенд проект з використанням Webpack, SCSS та модульної архітектури.

## Структура проекту

```
src/
  ├── js/
  │   ├── modules/
  │   │   ├── navigation.js
  │   │   └── theme.js
  │   └── index.js
  ├── styles/
  │   ├── partials/
  │   │   ├── _variables.scss
  │   │   ├── _mixins.scss
  │   │   ├── _base.scss
  │   │   ├── _header.scss
  │   │   └── _footer.scss
  │   └── main.scss
  └── templates/
      ├── partials/
      │   ├── header.html
      │   └── footer.html
      └── index.html
```

## Встановлення

```bash
npm install
```

## Команди

- `npm start` - запуск проекту в режимі розробки
- `npm run build` - збірка проекту для продакшену

## Особливості

- Модульна архітектура JavaScript
- SCSS з використанням міксинів та змінних
- Автоматична мініфікація CSS та JS
- Підтримка темної теми
- Responsive дизайн
- Hot Module Replacement в режимі розробки
