# Task Tracker API

A small Express.js REST API used for the **Codzee first-round evaluation**.

## Features

- Create, list, get, update, and delete tasks
- Task statuses: `todo`, `in_progress`, `done`
- Task priorities: `low`, `medium`, `high`
- Filter list endpoint by `status`, `priority`, and text search (`q`)
- Optional due dates
- In-memory store (resets when the process restarts)

## Quick start

```bash
npm install
npm start
```

Server runs at `http://localhost:3000`.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/tasks` | List tasks (`?status=&priority=&q=`) |
| `GET` | `/api/tasks/:id` | Get one task |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Create task example

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship Codzee evaluation","description":"Open 3 meaningful PRs"}'
```

## Codzee evaluation

This repository is public so the Codzee team can review:

1. The base application
2. At least three pull requests with different change types
3. Codzee review comments on those PRs

## License

MIT
