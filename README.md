# Movie Watchlist API

**Group 4 — Project: Movie Watchlist**  
A REST API for managing a personal movie watchlist, built with Node.js, Express, and a JSON file for storage.

## Tech Stack

- Node.js (>= 18)
- Express 5
- ES Modules (`import` / `export`)
- `fs/promises` + `path` for file storage
- `nodemon` for development

## Prerequisites

- Node.js 18
- npm

## Installation

```bash
git clone https://github.com/Taiwotaiwo1/Movies-Watchlists-Project-Gruop-4
cd Movies-Watchlists-Project-Gruop-4
npm install
```

## Running the Project

```bash
npm start      # runs: node app.js
npm run dev    # runs: nodemon app.js (auto-restart on changes)
```

The server listens on **http://localhost:3000**.
All routes are prefixed with `/movies`.

## Project Structure

```text
.
├── app.js                 # Express app + server
├── package.json
├── data/
│   └── movies.json        # JSON "database"
└── src/
    ├── routes.js          # Express route handlers
    ├── services.js        # File read/write + business logic
    └── utils.js           # Validation helpers
```

## Data Model

Each movie is stored in `data/movies.json` as an object like:

```json
{
  "id": "e2f57c30-f97e-44b1-94f9-90d79eb74808",
  "title": "The Demon Slayer",
  "director": "Nikamoto",
  "year": 2022,
  "watched": false,
  "createdAt": "2026-11-11T21:25:51.540Z",
  "updatedAt": "2026-11-11T21:25:51.540Z"
}
```

- `id`, `createdAt`, `updatedAt` are set by the server.
- `watched` defaults to `false` and can only be changed via **PUT**.
- On **POST**, the client may only send `title`, `director`, `year`.
- On **PUT**, the client may send `title`, `director`, `year`, `watched` (all optional).

## API Endpoints

| Method | Endpoint | Description |

| GET | `/movies` | List all movies |
| GET | `/movies/unwatched` | List movies where `watched === false` (bonus) |
| GET | `/movies/:id` | Get one movie by ID |
| POST | `/movies` | Create a new movie |
| PUT | `/movies/:id` | Update an existing movie |
| DELETE | `/movies/:id` | Delete a movie |

### GET /movies

Returns all movies.

**Request**

```bash
curl http://localhost:3000/movies
```

**Response 200**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "e2f57c30-f97e-44b1-94f9-90d79eb74808",
      "title": "The Demon Slayer",
      "director": "Nikamoto",
      "year": 2022,
      "watched": false,
      "createdAt": "2026-11-11T21:25:51.540Z",
      "updatedAt": "2026-11-11T21:25:51.540Z"
    }
  ]
}
```

### GET /movies/unwatched

Bonus endpoint. Returns only movies where `watched === false`.

**Request**

```bash
curl http://localhost:3000/movies/unwatched
```

**Response 200**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "e2f57c30-f97e-44b1-94f9-90d79eb74808",
      "title": "The Demon Slayer",
      "watched": false,
      "...": "..."
    },
    {
      "id": "1105bb91-e49e-430e-b83b-c3b012ea108a",
      "title": "The Blacklists",
      "watched": false,
      "...": "..."
    }
  ]
}
```

---

### GET /movies/:id

Returns a single movie by its `id`.

**Request**

```bash
curl http://localhost:3000/movies/e2f57c30-f97e-44b1-94f9-90d79eb74808
```

**Response 200**

```json
{
  "success": true,
  "data": {
    "id": "e2f57c30-f97e-44b1-94f9-90d79eb74808",
    "title": "The Demon Slayer",
    "director": "Nikamoto",
    "year": 2022,
    "watched": false,
    "createdAt": "2026-11-11T21:25:51.540Z",
    "updatedAt": "2026-11-11T21:25:51.540Z"
  }
}
```

**Response 404**

```json
{ "success": false, "message": "Movie not found" }
```

### POST /movies

Creates a new movie. The server generates `id`, `watched`, `createdAt`, and `updatedAt`.

**Request body**

```json
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "year": 2010
}
```

```bash
curl -X POST http://localhost:3000/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception","director":"Christopher Nolan","year":2010}'
```

**Response 201**

```json
{
  "success": true,
  "message": "Movie created successfully",
  "data": {
    "id": "a1b2c3d4-...",
    "title": "Inception",
    "director": "Christopher Nolan",
    "year": 2010,
    "watched": false,
    "createdAt": "2026-11-14T10:00:00.000Z",
    "updatedAt": "2026-11-14T10:00:00.000Z"
  }
}
```

**Validation rules (enforced)**

- `title` — required, non-empty string
- `director` — required, non-empty string
- `year` — required integer between 1888 and 2026
- Client may **not** send `id`, `watched`, `createdAt`, `updatedAt` (server-controlled)

**Response 400 (example)**

```json
{ "success": false, "message": "Title is required" }
```

---

### PUT /movies/:id

Updates an existing movie. Only provided fields are changed; `updatedAt` is refreshed automatically. `id` and `createdAt` are preserved.

**Request body (all fields optional)**

```json
{
  "watched": true
}
```

```bash
curl -X PUT http://localhost:3000/movies/e2f57c30-f97e-44b1-94f9-90d79eb74808 \
  -H "Content-Type: application/json" \
  -d '{"watched":true}'
```

**Response 200**

```json
{
  "success": true,
  "message": "Movie updated successfully",
  "data": {
    "id": "e2f57c30-f97e-44b1-94f9-90d79eb74808",
    "title": "The Demon Slayer",
    "director": "Nikamoto",
    "year": 2022,
    "watched": true,
    "createdAt": "2026-11-11T21:25:51.540Z",
    "updatedAt": "2026-11-14T10:05:00.000Z"
  }
}
```

**Validation rules (enforced)**

- `title`, `director` — optional; if sent, must be non-empty strings
- `year` — optional; if sent, must be an integer 1888–2026
- `watched` — optional; if sent, must be a boolean
- Client may **not** change `id`, `createdAt`, `updatedAt`

**Response 400 (example)**

```json
{ "success": false, "message": "Watched must be a boolean (true or false)" }
```

**Response 404**

```json
{ "success": false, "message": "Movie not found" }
```

---

### DELETE /movies/:id

Deletes a movie by `id`.

**Request**

```bash
curl -X DELETE http://localhost:3000/movies/e2f57c30-f97e-44b1-94f9-90d79eb74808
```

**Response 204** — no body (deleted successfully)

**Response 404**

```json
{ "success": false, "message": "Movie not found" }
```

---

## Team Members and Contributions

| Name | Role | What they built |

| Ganiyu Taiwo Ibraheem | Routes + integration | `app.js`, `src/routes.js`

| Ijinleifeoluwa Daniel Shadare | File storage | `src/services.js`,  `readMovies`, `writeMovies`, `createMovie`, `getUnwatchedMovies` |

| God'spower Ogheneovo James |`updateMovie`, `deleteMovieById`|

| Henry Michael & Ishmail Abass kamara| Validation & Validator functions | `src/utils.js`, `validateCreateMovie`, `validateUpdateMovie` |

| Fortune Uzoma | Testing | Manual endpoint testing, bug reports |

| Hephzibah Oluchi Okafor | README | This README, endpoint documentation, test checklist |

## Known Issues / Limitations

The current codebase works end-to-end, but the following issues remain.

1. **Debug `console.log` in `getUnwatchedMovies`.** `src/services.js` logs `movies: [...]` on every request to `/movies/unwatched`. Should be removed.
2. **No central error handling.** Route handlers do not wrap async logic in `try/catch`, and there is no Express error-handling middleware. An unexpected file or parse error will surface as a default Express 500 response with a stack trace.
3. **No 404 handler for unknown routes.** Requesting e.g. `GET /nope` returns Express's default HTML 404 page rather than a JSON error.

## Manual Testing Checklist

```bash
npm start
# then, in a second terminal:
curl http://localhost:3000/movies
```

- [ ] `GET /movies` returns 200 with an array
- [ ] `POST /movies` with valid body returns 201
- [ ] `POST /movies` missing `title` returns 400 (`"Title is required"`)
- [ ] `POST /movies` with `year` as a string returns 400
- [ ] `POST /movies` with `watched` in the body returns 400
- [ ] `GET /movies/:id` with valid id returns 200
- [ ] `GET /movies/:id` with unknown id returns 404
- [ ] `PUT /movies/:id` updates fields and refreshes `updatedAt`
- [ ] `PUT /movies/:id` with `watched: "yes"` returns 400
- [ ] `DELETE /movies/:id` returns 204, then `GET` returns 404
- [ ] `GET /movies/unwatched` returns only movies where `watched === false`

Repository: https://github.com/Taiwotaiwo1/Movies-Watchlists-Project-Gruop-4
