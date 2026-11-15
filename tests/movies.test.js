import { describe, test, expect } from "@jest/globals";
import request from "supertest"
import app from '../app.js'
import {readMovies} from '../src/services.js'

describe('Movies API', () => {
    //Test for the Get Movies Route
    describe('GET /movies', () => {
        test('returns status code 200 and an array of movies object', async () => {
            const res = await request(app).get('/movies');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                success: true,
                count: expect.any(Number),
                })
            );
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(res.body.count);
        })
    });
    
    // Test for Get movies by an ID
    describe('GET /movies/:id', () => {
        test('returns 404 for a movie that do not exist', async () => {
        const res = await request(app).get('/movies/does-not-exist');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message');
        });

        test('returns 200 and actual data of existing ID', async () => {
            const res = await request(app).get('/movies/e2f57c30-f97e-44b1-94f9-90d79eb74808');
            const movies = await readMovies()
            expect(res.status).toBe(200);
            expect(res.body.data).toMatchObject(movies[0]);
        });
    });
     
    //Test to GET all unwatched movies 
     describe('GET /movies/unwatched', () => {
        test('returns status code 200 and an array of unwatched movies array', async () => {
            const res = await request(app).get('/movies/unwatched');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(
                expect.objectContaining({
                success: true,
                count: expect.any(Number),
                })
            );
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(res.body.count);
        })
    })

    // Test to Create a New Movie
    describe('POST /movies', () => {
        test('creates a new movie', async () => {
        const payload = {
                title: "Fast and Furios 6",
                director: "Tom Hank",
                year: 2021,
                watched: true
            }

        const res = await request(app)
            .post('/movies')
            .set('Content-Type', 'application/json')
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.data).toMatchObject(payload);
        expect(res.body.data).toHaveProperty('id');
        });

        test('Validations: rejects invalid payload with 400', async () => {
        const res = await request(app)
            .post('/movies')
            .send({});

        expect(res.status).toBe(400);
        });
     });

     //Tests to Edit/Update existing movie
     describe('PUT /movies/:id', () => {
        test('updating an existing movie', async () => {
        const payload = {
                title: "Fast and Furios 22",
                director: "Mathew Stewart",
                year: 2011,
                watched: false
            }

        const res = await request(app)
            .put('/movies/e2f57c30-f97e-44b1-94f9-90d79eb74808')
            .set('Content-Type', 'application/json')
            .send(payload);

        expect(res.status).toBe(200);
        expect(res.body.data).toMatchObject(payload);
        expect(res.body.data).toHaveProperty('id');
        });

        test('updating with a movie id that do not exist expects 404', async () => {
            const payload = {
                    title: "Fast and Furios 22",
                    director: "Mathew Stewart",
                    year: 2011,
                    watched: false
                }

            const res = await request(app)
                .put('/movies/e46jdl956-9b95-4807-9220-b7f3ifee02ba')
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(res.status).toBe(404);
        });

        test('Validations: rejects invalid payload with 400', async () => {
        const res = await request(app)
            .put('/movies/e2f57c30-f97e-44b1-94f9-90d79eb74808')
            .send({
                title: 200,
                director: 890
            });

        expect(res.status).toBe(400);
        });
     });
     
     //Test for Deleting movies
     describe('DELETE /movies/:id', () => {
        test('Deleting an existing user expects 204', async() => {
             const movies = await readMovies()
             const res = await request(app)
            .delete(`/movies/${movies[movies.length - 1]?.id}`)

            expect(res.status).toBe(200);
        })

        test('Test Deleting with the an ID that dont exist, expects 404', async() => {
             
             const res = await request(app)
            .delete(`/movies/chdh3839-692b-4cfe-957f-ue8ie`)

            expect(res.status).toBe(404);
        })
     })



    


})