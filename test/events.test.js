const request = require('supertest')
const chai = require('chai')
const app = require('../index') // Your Express app
const expect = chai.expect

describe('Events API', () => {
    // Test for getAllEvents route
    describe('GET /events', () => {
        it('should return a list of events with default offset and limit', (done) => {
            request(app)
                .get('/events')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err)
                    // Add assertions for the response body here
                    expect(res.body).to.be.an('array')
                    done()
                })
        })

        // Add more test cases for different scenarios (pagination, filters, etc.) if needed
    })

    // Test for createEvent route
    describe('POST /events', () => {
        it('should create a new event', (done) => {
            const newEvent = {
                title: 'Test Event',
                description: 'This is a test event',
                duration: '180',
                hour: '15:00',
                tags: ['test', 'mocha', 'chai'],
                link: 'https://example.com/test-event',
                creator: '645722094afac96e1c0bd5eb',
            }

            request(app)
                .post('/events')
                .send(newEvent)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err)
                    // Add assertions for the response body here
                    expect(res.body).to.have.property('_id')
                    expect(res.body.title).to.equal(newEvent.title)
                    // ...
                    done()
                })
        })

        // Add more test cases for different scenarios (missing data, validation errors, etc.) if needed
    })

    // Test for getEventById route
    describe('GET /events/:id', () => {
        it('should return a specific event by ID', (done) => {
            const eventId = '64cc9ea0f2175169e0325797'

            request(app)
                .get(`/events/${eventId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err)
                    // Add assertions for the response body here
                    expect(res.body).to.have.property('_id', eventId)
                    // ...
                    done()
                })
        })

        // Add more test cases for different scenarios (invalid ID, non-existent ID, etc.) if needed
    })

    // test for login

    describe('POST /login', () => {
        it('should return a token', (done) => {
            const credentials = {
                username: 'liebert1',
                password: 'aA12345!',
            }

            request(app)
                .post('/auth/login')
                .send(credentials)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err)
                    // Add assertions for the response body here
                    expect(res.body).to.have.property('auth_token')
                    // ...
                    done()
                })
        })

        // Add more test cases for different scenarios (invalid credentials, etc.) if needed
    })
})
