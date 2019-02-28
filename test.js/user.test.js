var app = require('../app.js')
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = chai.expect
var User = require('../models/User')
var Event = require('../models/Event')

chai.use(chaiHttp)
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhdHJpYS5nYW5pQGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.v2yyiPP31gWbsaygcmH7hoBFlYO21dxpTQadr_S_x04'
var userId = ''
let mytoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuaGFyQGdtYWlsLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ._iS0psMlZ0C7oD5BPSOZkL-9rxAlxk77yzisNpGyD_0'

describe('User', () => {
  beforeEach((done) => {
    let objUser = {
      name: 'Patria',
      email: 'patria.gani@gmail.com',
      password: '12345678',
      dob: '01/01/2001',
      gender: 'Male',
      imageUrl: 'http://imageurl.com'
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
    User.remove({}, () => {
      done()
    })
  })

  it('POST /users/signup should return new registered user', (done) => {
    let obj = {
      name: 'Christian',
      email: 'christian.sihotang12@gmail.com',
      password: '12345678',
      dob: '01-01-2001',
      gender: 'Male',
      imageUrl: 'http://imageurl.com'
    }
    chai.request(app)
      .post('/users/signup')
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(200)
        expect(result.body.user).to.have.property('name')
        expect(result.body.user).to.have.property('email')
        expect(result.body.user).to.have.property('password')
        expect(result.body.user).to.have.property('dob')
        expect(result.body.user).to.have.property('gender')
        expect(result.body.user).to.have.property('imageUrl')

        expect(result.body.user.name).to.equal(obj.name)
        expect(result.body.user.email).to.equal(obj.email)
        expect(result.body.user.password).to.not.equal(obj.password)
        expect(result.body.user.gender).to.equal(obj.gender)
        expect(result.body.user.imageUrl).to.equal(obj.imageUrl)
        done()
      })
  })

  it('POST /users/signin should have sign in user', (done) => {
    let obj = {
      email: 'patria.gani@gmail.com',
      password: '12345678'
    }

    chai.request(app)
      .post('/users/signin')
      .send(obj)
      .end((err, result) => {
        expect(result).to.have.status(200)
        expect(result.body).to.have.property('token')
        expect(result.body).to.have.property('message')
        token = result.body.token
        expect(result.body.message).to.equal('success login')
        done()
      })
  })

  it('POST /users/signin should have not sign in because email is wrong', (done) => {
    let obj = {
      email: 'christian.sihotang12@gmail.com',
      password: '12345678'
    }

    chai.request(app)
      .post('/users/signin')
      .send(obj)
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body.message).to.equal("wrong email / password")
        done()
      })
  })

  it('POST /users/signin should have not sign in because password is wrong', (done) => {
    let obj = {
      email: 'patria.gani@gmail.com',
      password: 'sdasddasdasdasd'
    }

    chai.request(app)
      .post('/users/signin')
      .send(obj)
      .end((err, result) => {
        // console.log(err)
        // console.log(result)
        expect(result).to.have.status(400)
        expect(result.body.message).to.equal("wrong email / password")
        done()
      })
  })


  it('POST /users/signup should not return new registered users if name null', (done) => {
    let obj = {
      name: '',
      email: '',
      password: '',
      dob: '',
      gender: '',
      imageUrl: ''
    }
    chai.request(app)
      .post('/users/signup')
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body).to.have.property('message')
        done()
      })
  })

  it('POST /users/signup should not return new registered users if email null', (done) => {
    let obj = {
      name: 'Christian',
      email: '',
      password: '',
      dob: '',
      gender: '',
      imageUrl: ''
    }
    chai.request(app)
      .post('/users/signup')
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body).to.have.property('message')
        // expect(result.body.message).to.equal('')
        done()
      })
  })

  it('POST /users/signup should not return new registered users if password null', (done) => {
    let obj = {
      name: 'Christian',
      email: 'cha@mail.com',
      password: '',
      dob: '',
      gender: '',
      imageUrl: ''
    }
    chai.request(app)
      .post('/users/signup')
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body).to.have.property('message')
        // expect(result.body.message).to.equal('')
        done()
      })
  })

  it('POST /users/signup should not return new registered users if dob null', (done) => {
    let obj = {
      name: 'Christian',
      email: 'cha@mail.com',
      password: '1234',
      dob: '',
      gender: '',
      imageUrl: ''
    }
    chai.request(app)
      .post('/users/signup')
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body).to.have.property('message')
        // expect(result.body.message).to.equal('')
        done()
      })
  })

  it('POST /users/signup should not return new registered users if gender null', (done) => {
    let obj = {
      name: 'Christian',
      email: 'cha@mail.com',
      password: '1234',
      dob: '01-01-2001',
      gender: '',
      imageUrl: ''
    }
    chai.request(app)
      .post('/users/signup')
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body).to.have.property('message')
        // expect(result.body.message).to.equal('')
        done()
      })
  })

  it('POST /users/signup should not return new registered users if imageUrl null', (done) => {
    let obj = {
      name: 'Christian',
      email: 'cha@mail.com',
      password: '1234',
      dob: '01-01-2001',
      gender: 'male',
      imageUrl: ''
    }
    chai.request(app)
      .post('/users/signup')
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body).to.have.property('message')
        expect(result.body.message).to.equal('You must upload your photo profile')
        done()
      })
  })

  it('POST /users/signin should have not sign in because password is wrong', (done) => {
    let obj = {
      email: 'christian.sihotang23@gmail.com',
      password: 'sdasddasdasdasd',
    }

    chai.request(app)
      .post('/users/signin')
      .send(obj)
      .end((err, result) => {
        expect(result).to.have.status(400)
        expect(result.body.message).to.equal("wrong email / password")
        done()
      })
  })

  it('PUT /users/ should have updated user to have a new data', (done) => {
    let obj = {
      name: 'anhar',
      password: 'wadawajadah',
      email: 'anhar@gmail.com'
    }

    chai.request(app)
      .put('/users')
      .set({ token })
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        expect(result).to.have.status(200)
        expect(result.body.user).to.have.property('name')
        expect(result.body.user).to.have.property('email')
        expect(result.body.user).to.have.property('password')

        expect(result.body.user.name).to.equal(obj.name)
        expect(result.body.user.email).to.equal(obj.email)
        expect(result.body.user.password).to.equal(obj.password)


        done()
      })
  })

  it('PUT /users/ should haven\'t updated users', (done) => {
    let obj = {
      name: '',
      password: 'wadawajadah',
      email: 'christian.sihotang10@gmail.com'
    }

    chai.request(app)
      .put('/users')
      .set({ token: mytoken })
      .type('form')
      .send({
        data: JSON.stringify(obj)
      })
      .end((err, result) => {
        // console.log({err, result: result.body})
        expect(result).to.have.status(401)
        expect(result.body).to.have.property('message')

        done()
      })
  })


  it('GET /users/ should have  user data', (done) => {

    chai.request(app)
      .get('/users')
      .set({ token })
      .end((err, result) => {
        expect(result).to.have.status(200)
        expect(result.body.user).to.have.property('name')
        expect(result.body.user).to.have.property('email')
        expect(result.body.user).to.have.property('password')

        done()
      })
  })


  it('GET /users/ should not have  user data because not valid token', (done) => {
    let token2 = `${token.slice(2)}sa`
    chai.request(app)
      .get('/users')
      .set({ token: token+'aaa' })
      .end((err, result) => {
        // console.log({err, result: result.body})
        expect(result).to.have.status(401)
        expect(result.body).to.have.property('message')
        done()
      })
  })

  it('GET /users/myevent should get my event', (done) => {
    chai.request(app)
      .get('/users/myevent')
      .set({ token })
      .end((err, result) => {
        // console.log({err, result: result.body})
        expect(result).to.have.status(200)
        expect(result.body).to.have.property('events')
        done()
      })
  })


  it('PUT /users/join/:eventId should return message success join event', (done) => {
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
    var createdEvent

    let newUser = {
      name: 'anhar',
      email: 'anhar@gmail.com',
      password: '12345678',
      dob: '01/01/2001',
      gender: 'Male',
      imageUrl: 'http://imageurl.com'
    }

    User
      .create(newUser)
      .then(user => {
        myuser = user
        return Event.create(newevent)
      })
      .then(data => {
        createdEvent = data
        chai.request(app)
          .put(`/users/join/${createdEvent._id}`)
          .set({ token: mytoken })
          .end((err, result) => {
            // console.log({ err, result: result.body })
            expect(result).to.have.status(200)
            expect(result.body).to.have.property('message')
            done()
          })
      })


  })

  it('PUT /users/join/:eventId should return message already join event', (done) => {
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
      password: '12345678',
      dob: '01/01/2001',
      gender: 'Male',
      imageUrl: 'http://imageurl.com'
    }

    var createdEvent
    var myuser

    User
      .create(newUser)
      .then(user => {
        myuser = user
        return Event.create(newevent)
      })
      .then(event => {
        createdEvent = event
        return Event.findByIdAndUpdate(event._id, { $push: { userId: myuser._id } }, { new: true })
      })
      .then(event => {
        chai.request(app)
          .put(`/users/join/${createdEvent._id}`)
          .set({ token: mytoken })
          .end((err, result) => {
            // console.log("DATTAA===")
            // console.log({ err, result: result.body })
            expect(result).to.have.status(400)
            expect(result.body).to.have.property('message')
            done()
          })
      })

  })
})
