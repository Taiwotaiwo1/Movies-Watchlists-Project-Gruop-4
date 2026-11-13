import { describe, test, expect } from "@jest/globals";
import request from "supertest"
import app from '../app.js'

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
    })
    
    // Test for Get movies by an ID
    describe('GET /movies/:id', () => {
        test('returns 404 for a movie that do not exist', async () => {
        const res = await request(app).get('/movies/does-not-exist');

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message');
        });
    });


})