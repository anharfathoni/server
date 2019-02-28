var app = require('../app.js')
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = chai.expect
var Promotor = require('../models/Promotor')

chai.use(chaiHttp)
var token = ''

describe('Promotor', () => {
    beforeEach((done) => {
        let objPromotor = {
            name: 'Chris',
            email: 'christian.sihotang23@gmail.com',
            password: '12345678'
        }
        let objPromotor2 = {
            name: 'Chris',
            email: 'christian.sihotang10@gmail.com',
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
            done()
        })
    })

    it('POST /promotors/signup should return new registered promotors', (done) => {
        let obj = {
            name: 'Christian',
            email: 'christian.sihotang12@gmail.com',
            password: '12345678'
        }
        chai.request(app)
            .post('/promotors/signup')
            .send(obj)
            .end((err, result) => {
                expect(result).to.have.status(200)
                expect(result.body.promotor).to.have.property('name')
                expect(result.body.promotor).to.have.property('email')
                expect(result.body.promotor).to.have.property('password')

                expect(result.body.promotor.name).to.equal(obj.name)
                expect(result.body.promotor.email).to.equal(obj.email)
                expect(result.body.promotor.password).to.not.equal(obj.password)
                console.log(err)
                done()
            })
    })

    it('POST /promotors/signin should have sign in promotors', (done) => {
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

    it('POST /promotors/signin should have not sign in promotors', (done) => {
        let obj = {
            email: 'christian.sihotang12@gmail.com',
            password: '12345678'
        }

        chai.request(app)
            .post('/promotors/signin')
            .send(obj)
            .end((err, result) => {
                // console.log(err)
                // console.log(result)
                expect(result).to.have.status(400)
                expect(result.body.message).to.equal("wrong email / password")
                done()
            })
    })

    it('POST /promotors/signin should have not sign in because password is empty promotors', (done) => {
        let obj = {
            email: 'christian.sihotang23@gmail.com',
            passworddss: 'sdasddasdasdasd'
        }

        chai.request(app)
            .post('/promotors/signin')
            .send(obj)
            .end((err, result) => {
                // console.log(err)
                // console.log(result)
                expect(result).to.have.status(400)
                done()
            })
    })


    it('POST /promotors/signup should not return new registered promotors', (done) => {
        let obj = {
            name: '',
            email: '',
            password: ''
        }
        chai.request(app)
            .post('/promotors/signup')
            .send(obj)
            .end((err, result) => {
                expect(result).to.have.status(400)
                expect(result.body).to.have.property('message')
                done()
            })
    })

    it('POST /promotors/signup should not return new registered promotors', (done) => {
        let obj = {
            name: 'Christian',
            email: '',
            password: ''
        }
        chai.request(app)
            .post('/promotors/signup')
            .send(obj)
            .end((err, result) => {
                expect(result).to.have.status(400)
                expect(result.body).to.have.property('message')
                done()
            })
    })

    it('POST /promotors/signup should not return new registered promotors', (done) => {
        let obj = {
            name: 'Christian',
            email: 'cha@mail.com',
            password: ''
        }
        chai.request(app)
            .post('/promotors/signup')
            .send(obj)
            .end((err, result) => {
                expect(result).to.have.status(400)
                expect(result.body).to.have.property('message')
                done()
            })
    })

    it('POST /promotors/signin should have not sign in because password is wrong', (done) => {
        let obj = {
            email: 'christian.sihotang23@gmail.com',
            password: 'sdasddasdasdasd'
        }

        chai.request(app)
            .post('/promotors/signin')
            .send(obj)
            .end((err, result) => {
                // console.log(err)
                // console.log(result)
                expect(result).to.have.status(400)
                expect(result.body.message).to.equal("wrong email / password")
                done()
            })
    })

    it('PUT /promotors/ should have updated promotors to have a new data', (done) => {
        let obj = {
            name: 'Chris',
            password: 'wadawajadah',
            email: 'christian.sihotang23@gmail.com'
        }

        chai.request(app)
            .put('/promotors')
            .set({ token })
            .send(obj)
            .end((err, result) => {
                expect(result).to.have.status(201)
                expect(result.body.promotor).to.have.property('name')
                expect(result.body.promotor).to.have.property('email')
                expect(result.body.promotor).to.have.property('password')

                expect(result.body.promotor.name).to.equal(obj.name)
                expect(result.body.promotor.email).to.equal(obj.email)
                expect(result.body.promotor.password).to.equal(obj.password)


                done()
            })
    })

    it('PUT /promotors/ should have\'t updated promotors because token is invalid', (done) => {
        let obj = {
            promotorId: '4124124',
            name: 'asdasd',
            passworsad: 'wadawajadah',
            email: 'christian.sihotang10@gmail.com'
        }

        chai.request(app)
            .put('/promotors')
            .set({ token: token + 'aaa' })
            .send(obj)
            .end((err, result) => {
                expect(result).to.have.status(401)
                expect(result.body).to.have.property('message')

                done()
            })
    })

    it('PUT /promotors/ should updated although one of key is undefined or null', (done) => {
        let obj = {
            promotorId: '4124124',
            name: null,
            passworsad: 'wadawajadah',
            email: 'christian.sihotang10@gmail.com'
        }

        chai.request(app)
            .put('/promotors')
            .set({ token: token + 'aaa' })
            .send(obj)
            .end((err, result) => {
                expect(result).to.have.status(401)
                expect(result.body).to.have.property('message')

                done()
            })
    })


    it('GET /promotors/ should have  promotors data', (done) => {

        chai.request(app)
            .get('/promotors')
            .set({ token })
            .end((err, result) => {
                expect(result).to.have.status(200)
                expect(result.body.promotor).to.have.property('name')
                expect(result.body.promotor).to.have.property('email')
                expect(result.body.promotor).to.have.property('password')

                done()
            })
    })

    it('GET /promotors/events should get promotor events', (done) => {
        chai.request(app)
            .get('/promotors/events')
            .set({ token })
            .end((err, result) => {
                expect(result).to.have.status(200)
                expect(result.body).to.be.an('Object')
                expect(result.body).to.have.property('events')
                expect(result.body).to.have.property('message')
                done()
            })
    })


    it('GET /promotors/ should not have  promotors data because not valid token', (done) => {
        let token2 = `${token.slice(2)}sa`
        chai.request(app)
            .get('/promotors')
            .set({ token: token2 })
            .end((err, result) => {
                done()
            })
    })
})
