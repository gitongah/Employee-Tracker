// Import and require Pool (node-postgres)
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
//Connect to database
const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: '',
    // TODO: Enter PostgreSQL password
    password: '',
    host: 'localhost',
    database: 'movies_db'
  },
  console.log(`Connected to the movies_db database.`)
)

pool.connect();
