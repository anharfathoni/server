var app = require('../app.js')
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = chai.expect
var AfterEvent = require('../models/StatisticAfter')
var Event = require('../models/Event')
chai.use(chaiHttp)

describe('AfterEvent', () => {
    beforeEach((done) => {
        let objEvent = {
            userId: [
                "5c72a3d1da6c9f1b7a33cb58",
                "5c74a667c66b17187300caab"
            ],
            userAttend: [
                "5c72a3d1da6c9f1b7a33cb58",
                "5c72a3d1da6c9f1b7a33cb58"
            ],
            status: "Available",
            _id: "5c7388dde117032f74954f4a",
            name: "Hacktiv8 Workshop",
            place: "Jalan Sultan Iskandar Muda No.7, RT.5/RW.9, Kebayoran Lama Selatan, Kebayoran Lama, RT.5/RW.9, Kby. Lama Sel., Kby. Lama, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12240, Indonesia",
            date: "2019-02-25T00:00:00.000Z",
            price: 15000,
            timeStart: "20:00",
            timeEnd: "09:00",
            latitude: "-6.2607187",
            longitude: "106.78161620000003",
            description: "Hacktiv8 Workshop",
            promotorId: "5c7231dc41fee019a81a1368",
            imageUrl: "https://storage.googleapis.com/event-review/1551075547888hacktiv8workshop.jpg",
            __v: 0,
            deviceId: "deeplens1"
        }
        var event = new Event(objEvent)
        event.save(function (err, newEvents) {
            if (err) {
                console.log('before each error', err.message)
            } else {
                let objAfterEvent = {
                    eventId: "5c7388dde117032f74954f4a",
                    deviceId: "deeplens1",
                    emotion: { emotion: "Sedih" },
                    imageUrl: "http://apaaja"
                }
                var afterEvent = new AfterEvent(objAfterEvent)
                afterEvent.save((err, newAfterEvent) => {
                    err ? console.log('before each error', err.message) : done()
                })
            }
        });
    })
    let eventId = "5c7388dde117032f74954f4a"

    afterEach((done) => {
        Event.remove({}, () => {
            AfterEvent.remove({}, () => {
                done()
            })
        })
    })

    it('GET /afterEvent/:eventId should return result', (done) => {
        chai.request(app)
            .get(`/afterEvent/${eventId}`)
            .end((err, result) => {
                expect(result).to.have.status(200)

                done()
            })
    })


    it('GET /afterEvent/:eventId should not return result', (done) => {
        chai.request(app)
            .get(`/afterEvent/${eventId}3`)
            .end((err, result) => {
                expect(result).to.have.status(400)

                done()
            })
    })

})
