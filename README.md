# Movie Watchlist API

**Group 4 — Project: Movie Watchlist**  
A REST API for managing a personal movie watchlist, built with Node.js, Express, and a JSON file for storage.

## Tech Stack

- Node.js (>= 18)
- Express 5
- ES Modules (`import` / `export`)
- `fs/promises` + `path` for file storage
- Jest + Supertest for automated tests
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
npm start     
npm run dev    
```

The server listens on **http://localhost:3000**.
All routes are prefixed with `/movies`.

## Running Tests

```bash
npm test
```

Tests use **Jest** with **Supertest** and live in `tests/`. The test script runs Jest with `--experimental-vm-modules` so native ESM works without a Babel transform, and `--runInBand` so tests run sequentially — important because all tests share the same `data/movies.json` file.

## Project Structure

```text
.
├── app.js                 # Express app (middleware + routes), exported
├── server.js              # Entry point — imports app and starts the server
├── error-Handler.js       # Express error-handling middleware
├── jest.config.js         # Jest config (ESM, tests/**/*.test.js)
├── package.json
├── data/
│   └── movies.json        # JSON "database"
├── src/
│   ├── routes.js          # Express route handlers
│   ├── services.js        # File read/write + business logic
│   └── utils.js           # Validation helpers
└── tests/
    └── movies.test.js     # Automated endpoint tests
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
| --- | --- | --- |
| GET | `/movies` | List all movies |
| GET | `/movies/unwatched` | List movies where `watched === false` (bonus) |
| GET | `/movies/:id` | Get one movie by ID |
| POST | `/movies` | Create a new movie |
| PUT | `/movies/:id` | Update an existing movie |
| DELETE | `/movies/:id` | Delete a movie |

---

### GET /movies

Returns all movies.

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

---

### GET /movies/unwatched

Bonus endpoint. Returns only movies where `watched === false`.

```bash
curl http://localhost:3000/movies/unwatched
```

**Response 200**

```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": "e2f57c30-...", "title": "The Demon Slayer", "watched": false, "...": "..." },
    { "id": "1105bb91-...", "title": "The Blacklists",  "watched": false, "...": "..." }
  ]
}
```

---

### GET /movies/:id

Returns a single movie by its `id`.

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

---

### POST /movies

Creates a new movie. The server generates `id`, `watched`, `createdAt`, and `updatedAt`.

**Request body**

```json
{ "title": "Inception", "director": "Christopher Nolan", "year": 2010 }
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
{ "watched": true }
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


### DELETE /movies/:id

Deletes a movie by `id`.

```bash
curl -X DELETE http://localhost:3000/movies/e2f57c30-f97e-44b1-94f9-90d79eb74808
```

**Response 204** — no body (deleted successfully)

**Response 404**

```json
{ "success": false, "message": "Movie not found" }
```



## Team Members and Contributions

| Name | Role | What they built |

| Ganiyu Taiwo Ibraheem | Routes + integration | `app.js`, `src/routes.js`

| Ijinleifeoluwa Daniel Shadare | File storage | `src/services.js`,  `readMovies`, `writeMovies`, `createMovie`, `getUnwatchedMovies` |

| God'spower Ogheneovo James |`updateMovie`, `deleteMovieById`|

| Henry Michael & Ishmail Abass kamara| Validation & Validator functions | `src/utils.js`, `validateCreateMovie`, `validateUpdateMovie` |

| Fortune Uzoma | Testing | Manual endpoint testing, bug reports |

| Hephzibah Oluchi Okafor | README | This README, endpoint documentation, test checklist |

## Known Issues / Limitations

1. **Error-handler middleware is registered before routes.** In `app.js`, `app.use(errorHandler)` sits above `app.use("/movies", movieRoute)`. Express only runs error middleware that is registered *after* the route that throws — so route errors won't reach the custom JSON error handler; Express will fall back to its default HTML error page. **Fix:** move `app.use(errorHandler)` to the very bottom of `app.js`, below `app.use("/movies", movieRoute)`.

2. **Unknown extra fields are accepted on PUT.** `validateUpdateMovie` only checks known fields; extra keys in the body are copied onto the movie by `updateMovie`.

3. **`test` script uses `--experimental-vm-modules`.** Required for native-ESM Jest and only works on Node 18+. Documented in "Running Tests" above.

## Manual Testing Checklist

```bash
npm start
# in a second terminal:
npm test                       # automated
curl http://localhost:3000/movies
```

- [ ] `npm test` passes
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