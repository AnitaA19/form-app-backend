const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });  

const mysqlUrl = process.env.MYSQL_URL;

if (!mysqlUrl) {
  console.error('MYSQL_URL is not defined in the environment variables');
  process.exit(1);  
}

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

module.exports = connection;
