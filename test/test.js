
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);
let pId;
describe('/GET products', () => {
    it('it should GET all the products', (done) => {
        chai.request(server)
            .get(`/products`)
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });

    });
});

describe('/POST product', () => {
    it('it should create product', (done) => {
        chai.request(server)
            .post(`/products/add`)
            .send([{
                "storeName": "Amul",
                "pId": 1012,
                "pName": "Ice-cream"
            }])
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(201);
                pId = res.body[0].pId
                done();
            });
    });
});

describe('/GET product', () => {
    it('it should GET product with given pId', (done) => {
        chai.request(server)
            .get(`/products/${pId}`)
            .end((err, res) => {
                if(err) return done(err);
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('/UPDATE product', () => {
    it('it should GET UPDATE with given pId', (done) => {
        chai.request(server)
            .patch(`/products/${pId}`)
            .send({
                "pName": "Dark-Chocolate"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('data updated successfully');
                res.body.should.have.property('pId').eql(`${pId}`);
                done();
            });
    });
});

describe('/DELETE product', () => {
    it('it should GET DELETE with given pId', (done) => {
        chai.request(server)
            .delete(`/products/${pId}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('data deleted successfully');
                res.body.should.have.property('pId').eql(`${pId}`);
                done();
            });
    });
});
