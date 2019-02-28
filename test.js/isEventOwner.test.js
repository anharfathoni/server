var assert = require('assert');
var mongoose = require(`mongoose`)
var Event = require(`../models/Event`)
var Promotor = require(`../models/Promotor`)
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
var expect = chai.expect
chai.use(chaiHttp);

//token anhar
let mytoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuaGFyQGdtYWlsLmNvbSIsInJvbGUiOiJQcm9tb3RvciIsImlhdCI6MTUxNjIzOTAyMn0.z4g4H5korz3kB5sjhhGGqcwgnt3qbKbnBIFEdzR6l1o'

describe('Testing for Event Owner', () => {
  beforeEach((done) => {
    let objPromotor = {
      name: 'anhar2',
      email: 'anhar2@gmail.com',
      password: '12345678'
    }

    var promotor = new Promotor(objPromotor)
    promotor.save(function (err, newUser) {
      if (err) {
        console.log('before each error', err.message)
      } else {
        done()
      }
    });
  })

  afterEach((done) => {
    Promotor.remove({}, () => {
      Event.deleteMany({}, () => {
        done()
      })
    })

  })

  it('PUT /events/:eventId should return success message', (done) => {

    let newevent = {
      name: "Hacktiv8 Workshop",
      place: "Jalan Iskandar Muda",
      date: new Date,
      price: 15000,
      timeStart: "12:00",
      timeEnd: "15:00",
      latitude: "12323123",
      longitude: "12323213",
      description: "Hacktiv8 Workshop"
    };

    let newUser = {
      name: 'anhar',
      email: 'anhar@gmail.com',
      password: '12345678'
    }

    var createdEvent
    var mypromotor

    Promotor
      .create(newUser)
      .then(promotor => {
        mypromotor = promotor
        return Event.create({ ...newevent, promotorId: promotor._id })
      })
      .then(event => {
        createdEvent = event
        chai.request(app)
          .patch(`/events/${createdEvent._id}`)
          .set({ token: mytoken })
          .type('form')
          .send({ data: JSON.stringify(newevent) })
          .end((err, result) => {
            expect(result).to.have.status(200)
            expect(result.body).to.have.property('message')
            done()
          })
      })
  })

  it('PUT /events/:eventId should return error message because not event owner', (done) => {

    let newevent = {
      name: "Hacktiv8 Workshop",
      place: "Jalan Iskandar Muda",
      date: new Date,
      price: 15000,
      timeStart: "12:00",
      timeEnd: "15:00",
      latitude: "12323123",
      longitude: "12323213",
      description: "Hacktiv8 Workshop"
    };

    let newUser = {
      name: 'anhar',
      email: 'anhar@gmail.com',
      password: '12345678'
    }

    var createdEvent
    var mypromotor

    Promotor
      .create(newUser)
      .then(promotor => {
        mypromotor = promotor
        return Event.create({ ...newevent, promotorId: promotor._id })
      })
      .then(event => {
        createdEvent = event
        chai.request(app)
          .patch(`/events/${createdEvent._id}`)
          .set({ token: mytoken+'111' })
          .type('form')
          .send({ data: JSON.stringify(newevent) })
          .end((err, result) => {
            expect(result).to.have.status(401)
            expect(result.body).to.have.property('message')
            done()
          })
      })
  })
})

