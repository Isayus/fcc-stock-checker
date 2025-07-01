const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('GET /api/stock-prices => stockData object', function() {

    test('1. Viewing one stock', function(done) {
     chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'GOOG'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        done();
      });
    });

    let likes;
    
    test('2. Viewing one stock and liking it', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'MSFT', like: true})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.equal(res.body.stockData.stock, 'MSFT');
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.isAbove(res.body.stockData.likes, 0);
        likes = res.body.stockData.likes;
        done();
      });
    });

    test('3. Viewing the same stock and liking it again', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'MSFT', like: true})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body.stockData);
        assert.equal(res.body.stockData.stock, 'MSFT');
        assert.isNumber(res.body.stockData.price);
        assert.isNumber(res.body.stockData.likes);
        assert.equal(res.body.stockData.likes, likes);
        done();
      });
    });

    test('4. Viewing two stocks', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: ['AMZN', 'TSLA']})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].stock, 'AMZN');
        assert.equal(res.body.stockData[1].stock, 'TSLA');
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[1].rel_likes);
        done();
      });
    });
    
    test('5. Viewing two stocks and liking them', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: ['AAPL', 'SPOT'], like: true})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].stock, 'AAPL');
        assert.equal(res.body.stockData[1].stock, 'SPOT');
        assert.isNumber(res.body.stockData[0].price);
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isNumber(res.body.stockData[1].price);
        assert.isNumber(res.body.stockData[1].rel_likes);
        done();
      });
    });

  });

});
