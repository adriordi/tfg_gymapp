let mongoose = require("mongoose");

let Session = require('../app/models/training_session');
let User = require('../app/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

var user = new User({ username: 'ses', password: 'ses' });
User.remove({ _id: user._id });
user.save();

// Primero autenticación
chai.request(server)
  .post('/api/authenticate')
  .send({ username: 'ses', password: 'ses' })
  .end((err, res) => {
    var token = res.body.token

    describe('Session (/api/training/session/)', () => {

      before((done) => {
        Session.remove({});
        done();
      });

      after((done) => {
        User.remove({ _id: user._id });
        done();
      });

      describe('/GET sessions', () => {
        it('GET all the sessions (logged user)', (done) => {
          chai.request(server)
            .get('/api/training/session')
            .set('x-access-token', token)
            .end((err, res) => {
              res.should.have.status(200);
              done();
            });
        });
      });

      describe('/POST ', () => {
        it('should POST a session (logged user) ', (done) => {

          chai.request(server)
            .post('/api/training/sessions/')
            .set('x-access-token', token)
            .send({ time: 3600 })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('ok');

              done();
            });
        });

      });

      describe('/DELETE/:id_sessions', () => {
        it('should DELETE a session given the id', (done) => {
          let session = new Session({
            user: user._id
          });

          session.save((err, session) => {
            chai.request(server)
              .delete('/api/training/sessions/' + session._id)
              .set('x-access-token', token)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('ok');
                done();
              });
          });
        });
      });
    });
  });
