var assert = require('assert');
var mongoose = require(`mongoose`)
var User = require(`../models/User`)
var Promotor = require(`../models/Promotor`)
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app.js');
var expect = chai.expect

console.clear()

chai.use(chaiHttp);

//GLOBAL
var token = ""


//TESTING

describe('Testing for index with Null Token', () => {
    it('GET /', function (done) {

      chai.request(app)
      .get(`/`)
      .set({
        token: null
      })
      .end(function (err, res) {
        expect(res.body).to.be.a('object')
        done()
      })
    })
})

describe('Testing for index with Null Token', () => {
    it('GET /checklogin', function (done) {

      chai.request(app)
      .get(`/checklogin`)
      .set({
        token: null
      })
      .end(function (err, res) {
        expect(res.body).to.be.a('object')
        done()
      })
    })
})

describe('Testing for index with Promotor', () => {
    beforeEach((done) => {
        let objPromotor = {
            name: 'Chris',
            email: 'christian.sihotang23@gmail.com',
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
        Promotor.remove({} , () => {
          done()
        })

    })

    it('POST /promotors/signin should have registered promotors', (done) => {
        let obj = {
            email: 'christian.sihotang23@gmail.com',
            password: '12345678'
        }

        chai.request(app)
            .post('/promotors/signin')
            .send(obj)
            .end((err, result) => {
                // console.log(err)
                // console.log(result)
                expect(result).to.have.status(200)
                expect(result.body).to.have.property('token')
                expect(result.body).to.have.property('message')
                token = result.body.token

                expect(result.body.message).to.equal('success login')

                done()
            })
    })

    it('GET /checklogin', function (done) {

      chai.request(app)
      .get(`/checklogin`)
      .set({
        token: token
      })
      .end(function (err, res) {
        expect(res.body).to.be.a('object')
        done()
      })
    })
})

describe('Testing for index with Promotor wrong role', () => {
    it('GET /checklogin', function (done) {

      chai.request(app)
      .get(`/checklogin`)
      .set({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhdHJpYS5nYW5pQGdtYWlsLmNvbSIsInJvbGUiOiJQcm9tb3RvciIsImlhdCI6MTU1MTA4MjExMn0.Hh5-W-kst6HzHP5SdEX4Aior6G3xwrF14IP4UkcFrcM"
      })
      .end(function (err, res) {
        expect(res.body).to.be.a('object')
        done()
      })
    })
})

describe('Testing for index with User', () => {
    beforeEach((done) => {
        let objUser = {
            name: 'Chris',
            email: 'christian.sihotang23@gmail.com',
            dob: new Date,
            password: '12345678',
            gender: "Male",
            imageUrl: 'imageurl.com'
        }
        var user = new User(objUser)
        user.save(function (err, newUser) {
            if (err) {
              console.log('before each error', err.message)
            } else {
              done()
            }
        });
    })

    afterEach((done) => {
        User.remove({} , () => {
          done()
        })

    })

    it('POST /user/signin should have registered user', (done) => {
        let obj = {
            email: 'christian.sihotang23@gmail.com',
            password: '12345678'
        }

        chai.request(app)
            .post('/users/signin')
            .send(obj)
            .end((err, result) => {
                // console.log(err)
                // console.log(result)
                expect(result).to.have.status(200)
                expect(result.body).to.have.property('token')
                expect(result.body).to.have.property('message')
                token = result.body.token

                expect(result.body.message).to.equal('success login')

                done()
            })
    })

    it('GET /checklogin', function (done) {

      chai.request(app)
      .get(`/checklogin`)
      .set({
        token: token
      })
      .end(function (err, res) {
        expect(res.body).to.be.a('object')
        done()
      })
    })
})

describe('Testing for index with User wrong role', () => {
    it('GET /checklogin', function (done) {

      chai.request(app)
      .get(`/checklogin`)
      .set({
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhdHJpYS5nYW5pQGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNTUxMDgyMTEyfQ.602v8flBe_pUyscUhRNNjpkw616xB4BGgC7no7KSugQ"
      })
      .end(function (err, res) {
        expect(res.body).to.be.a('object')
        done()
      })
    })
})