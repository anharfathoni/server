// var assert = require('assert');
// var mongoose = require(`mongoose`)
// var Event = require(`../models/Event`)
// var Promotor = require(`../models/Promotor`)
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let app = require('../app.js');
// var expect = chai.expect
// chai.use(chaiHttp);

// //GLOBAL
// var token = ""


// //TESTING
// describe('Testing for Events', () => {
//     beforeEach((done) => {
//         let objPromotor = {
//             name: 'Chris',
//             email: 'christian.sihotang23@gmail.com',
//             password: '12345678'
//         }
//         var promotor = new Promotor(objPromotor)
//         promotor.save(function (err, newUser) {
//             if (err) {
//               console.log('before each error', err.message)
//             } else {
//               done()
//             }
//         });
//     })

//     afterEach((done) => {
//         Promotor.remove({} , () => {
//           Event.deleteMany({}, () => {
//             done()
//           })
//         })

//     })

//     it('POST /promotors/signin should have registered promotors', (done) => {
//         let obj = {
//             email: 'christian.sihotang23@gmail.com',
//             password: '12345678'
//         }

//         chai.request(app)
//             .post('/promotors/signin')
//             .send(obj)
//             .end((err, result) => {
//                 // console.log(err)
//                 // console.log(result)
//                 expect(result).to.have.status(200)
//                 expect(result.body).to.have.property('token')
//                 expect(result.body).to.have.property('message')
//                 token = result.body.token

//                 expect(result.body.message).to.equal('success login')

//                 done()
//             })
//     })

//     it('should create new Event', function (done) {

//       let newevent = {
//         name: "Hacktiv8 Workshop",
//         place: "Jalan Iskandar Muda",
//         date: new Date,
//         price: 15000,
//         timeStart: "12:00",
//         timeEnd: "15:00",
//         latitude: "12323123",
//         longitude: "12323213",
//         description: "Hacktiv8 Workshop"
//       };

//       chai.request(app)
//       .post(`/events`)
//       .set({
//         token: token
//       })
//       .type('form')
//       .send({data: JSON.stringify(newevent)})
//       .end(function (err, res) {
//         console.log(res.body, 'ini res ==========================');
//         expect(res.body).to.be.a('object')
//         done()
//       })
//     })
// })