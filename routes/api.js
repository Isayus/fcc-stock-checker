'use strict';
const fetch = require('node-fetch');
const crypto = require('crypto');
const Stock = require('../models.js');

async function getStockData(stockSymbol) {
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol}/quote`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      stock: data.symbol,
      price: data.latestPrice
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function saveStock(stockSymbol, like, ip) {
  const hashedIp = crypto.createHash('sha256').update(ip).digest('hex');
  
  let stockDoc = await Stock.findOne({ symbol: stockSymbol });

  if (!stockDoc) {
    stockDoc = new Stock({ symbol: stockSymbol });
  }

  if (like && !stockDoc.likes.includes(hashedIp)) {
    stockDoc.likes.push(hashedIp);
  }
  
  await stockDoc.save();
  return stockDoc.likes.length;
}


module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const { stock, like } = req.query;
      const userIp = req.ip;

      if (Array.isArray(stock)) {
        // Two stocks
        const stock1Symbol = stock[0].toUpperCase();
        const stock2Symbol = stock[1].toUpperCase();

        const data1 = await getStockData(stock1Symbol);
        const data2 = await getStockData(stock2Symbol);
        
        const likes1 = await saveStock(stock1Symbol, like, userIp);
        const likes2 = await saveStock(stock2Symbol, like, userIp);
        
        const rel_likes1 = likes1 - likes2;
        const rel_likes2 = likes2 - likes1;

        res.json({
          stockData: [
            { stock: data1.stock, price: data1.price, rel_likes: rel_likes1 },
            { stock: data2.stock, price: data2.price, rel_likes: rel_likes2 }
          ]
        });

      } else {
        // One stock
        const stockSymbol = stock.toUpperCase();
        const stockData = await getStockData(stockSymbol);
        
        if (!stockData || !stockData.stock) {
          return res.json({ stockData: { likes: like ? 1 : 0 } });
        }
        
        const likes = await saveStock(stockSymbol, like, userIp);
        
        res.json({
          stockData: {
            stock: stockData.stock,
            price: stockData.price,
            likes: likes
          }
        });
      }
    });
    
};

