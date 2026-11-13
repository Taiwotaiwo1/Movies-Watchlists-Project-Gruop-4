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


})