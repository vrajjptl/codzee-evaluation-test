# Task Tracker API

A small Express.js REST API used for the **Codzee first-round evaluation**.

## Features

- Create, list, get, update, and delete tasks
- Task statuses: `todo`, `in_progress`, `done`
- Optional due dates
- In-memory store (resets when the process restarts)

## Quick start

```bash
npm install
npm start
```

Server runs at `http://localhost:3000`.

### Optional API key

Set `API_KEY` to require an `x-api-key` header on `/api/tasks` routes:

```bash
set API_KEY=dev-secret
npm start
```

### Security defaults

- JSON body size limited to 16kb
- Basic security response headers
- Simple in-memory rate limiting
- `X-Powered-By` disabled

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/tasks` | List all tasks |
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

## Tests

```bash
npm test
```

## Codzee evaluation

This repository is public so the Codzee team can review:

1. The base application
2. At least three pull requests with different change types
3. Codzee review comments on those PRs

## License

MIT
