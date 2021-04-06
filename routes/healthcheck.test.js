const request = require('supertest')
const app = require('../app')

describe('Healthcheck', () => {
    it('should return 200 if app is live', async () => {
        const res = await request(app)
            .get('/healthcheck');

        expect(res.statusCode).toEqual(200);
    })
})
