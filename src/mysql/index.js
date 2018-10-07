/**
 * Created by yunrui001 on 2018-07-27.
 */
var mysql = require('mysql')
var pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'express-web',
  multipleStatements: true
});
/*var connection = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: 'root',
 database: 'express-web'
 });*/

//connection.connect()
exports.pool = pool
