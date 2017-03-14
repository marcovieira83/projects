const express = require('express');

var app = express();

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  res.send({
    name: 'Marco',
    likes: [
      'Beer',
      'Soccer'
    ]
  });
});

app.get('/about', (req, res) => {
  res.send('About page');
});

app.listen(3000);
