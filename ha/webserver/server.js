const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();

const pool = new Pool({
  host: '3.15.100.179',
  user: 'postgres',
  password: 's@lami',
  database: 'testdb',
  port: 5000,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/add', async (req, res) => {
  const { first, last, date } = req.body;

  try {
    const query = {
      text: 'INSERT INTO names(first_name, last_name, birth_date) VALUES($1, $2, $3)',
      values: [first, last, date],
    };
    await pool.query(query);

    res.status(200).json({ status: 'success', message: 'Data added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Database error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
