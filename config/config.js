const mysql = require('mysql2');
require('dotenv').config(); 

const mysqlUrl = process.env.MYSQL_URL;

const url = new URL(mysqlUrl);

const connection = mysql.createConnection({
  host: url.hostname,  
  user: url.username, 
  password: url.password,  
  database: url.pathname.slice(1),  
  port: url.port  
});

connection.connect(err => {
  if (err) {
    console.error('Error with connecting:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

connection.end();
