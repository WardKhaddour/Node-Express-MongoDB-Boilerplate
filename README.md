# Node-Express-MongoDB Boilerplate

Boilerplate for building Node Express APIs with MongoDB

## Initializing

- Add your environment variables in .env.development and .env.production files
- Comment out .env files in .gitignore
- Untrack .env files:

```bash
git rm --cached .env.production
```

```bash
git rm --cached .env.development
```

```bash
git commit -m 'Untrack .env files'
```

- Install dependencies:

```bash
npm install
```

## Configure Prettier

Edit .prettierrc.js file and configure it as you like

## Configure Eslint

Edit .eslintrc.js file and configure it as you like

## Configure Babel

Edit .babelrc file and configure it as you like

## Creating modules

- Use this command to execute createModule script

```bash
npm run create-module [ModuleName]
```

## Run in development mode

```bash
npm start
```

## Build for production with babel

```bash
npm run build
```

## Run in production mode

build the files then execute

```bash
npm run start:prod
```

## Linting with eslint

```bash
npm run lint
```
