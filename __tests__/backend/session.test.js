const config = require('../../config');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Session = require('../../backend/models/training_session');
const User = require('../../backend/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { token } = config;

jest.setTimeout(30000);

describe('Session (/api/training/sessions/)', () => {
  let server;
  const user = new User({ auth0id: 'ex', name: 'Antonio' });

  beforeAll(async () => {
    server = require('../../server');
    await Session.remove({});
    await User.remove({});
    await user.save();
  });

  afterAll(async () => {
    try {
      await Session.remove({});
      await User.remove({});
      await mongoose.disconnect();
      await server.shutdown();
    } catch (error) {
      console.log(` ${error} `);
      throw error;
    }
  });

  describe('/GET sessions (without profile)', () => {
    test('GET all the sessions (without profile) - Should fail', done => {
      chai
        .request(server)
        .get('/api/training/sessions')
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('error', 'No profile found');
          done();
        });
    });
  });

  // TODO -> Modificar para AUTH0
  // describe('/POST ', () => {
  //   it('should POST a session (logged user) ', (done) => {

  //     chai.request(server)
  //       .post('/api/training/sessions/')
  //       .set('x-access-token', token)
  //       .send({ time: 3600, date: "12/12/1995" })
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message').eql('ok');
  //         done();
  //       });
  //   });
  // });

  describe('/DELETE/:id_sessions', () => {
    test('should DELETE a session given the id', done => {
      const session = new Session({
        user: user._id
      });

      session.save(() => {
        chai
          .request(server)
          .delete(`/api/training/sessions/${session._id}`)
          .set('x-access-token', token)
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message', 'ok');
            done();
          });
      });
    });
  });
});
