# HamConditions
A small project to store daily ham radio band conditions in a database.

## Components
- getConditions.sh - Shell script to run as a cron job on the server collecting data.
- HamConditions.js - Parse today's ham band conditions and store them in a database.
- DisplayConditions.js - Read conditions from database and display at localhost:3000
- makeMySQLDB.js - Create the HamConditionsDB MySQL database
- makeMySQLTables.js - Create the ConditionReports table in the HamConditionsDB database

## Requirements:
```sh
npm install axios
```

```sh
npm install cheerio
```

```sh
npm install mysql2
```

```sh
npm install express
```

```sh
npm install mysql
```
