var config = require('../keys.json');
var mysql = require('mysql');

 module.exports = function () {
        return {

            	 connection: function() {
            	 	return mysql.createConnection({
            	 		host     : config.mysql.host,
           				user     : config.mysql.user,
  						password : config.mysql.password,
  						database : config.mysql.database
					});
            	 }
            
   };
};
