var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_hellardf',
  password        : '1689',
  database        : 'cs340_hellardf'
});

module.exports.pool = pool;
