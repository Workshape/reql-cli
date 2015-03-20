var Promise = require('bluebird');
var clc = require('cli-color');

class Client {

  /**
   * @constructor
   * @param  {RethinkDB} r
   * @param  {Object} config
   */
  constructor(r, config) {
    this.r = r;
    this.config = config;
    this.resultSize = 0;
  }

  /**
   * Convenience method for handling connecting to RethinkDB
   * 
   * @return {Promise}
   */
  connect() {
    return this.r.connect(this.config);
  }

  setDb(val) {
    if (!val) {
      console.log(clc.cyanBright(`[x] Current db is: ${this.config.db}`));
    } else {
      this.config.db = val;
      console.log(clc.cyanBright(`[.] Changed default database to ${val}`));
    }
    
    return Promise.resolve();
  }

  /**
   * Get the available 
   * @return {[type]} [description]
   */
  getTableList() {
    return this.connect()
    .then( conn => {
      return this.r.tableList().run(conn)
      .then(x =>{
        conn.close()
        return x;
      });
    })
    .then( list => {
      var output = `[-] Available tables in ${this.config.db} on ${this.config.host}:`
      if (list.length === 0) {
        output += '\n  NONE';
      } else {
        list.forEach(db => output += `\n  - ${db}`);
      }
      
      return output;
    })
    .then(console.log);
  }

  /**
   * Get the available 
   * @return {[type]} [description]
   */
  getDbList() {
    return this.connect()
    .then( conn => {
      return this.r.dbList().run(conn)
      .then(x =>{
        conn.close()
        return x;
      });
    })
    .then( list => {
      var output = `[-] Available databases on ${this.config.host}:`
      if (list.length === 0) {
        output += '\n  NONE';
      } else {
        list.forEach(db => output += `\n  - ${db}`);
      }

      return output;
    })
    .then(console.log);
  }

  /**
   * Execute a ReQL query and print out the result
   * 
   * @param  {String} query
   * @return {Promise}
   */
  query(query) {
    var startTime = +new Date();
    var that = this;

    if (query.indexOf('r.') !== 0) {
      return Promise.reject('[x] Error: Must begin with r.');
    }

    /**
     * Bring in rethinkdb api for local access when eval'ing command
     */
    var r = that.r;

    /**
     * Evaluate query and reject any invalid code
     */
    var eq;
    try {
      eq = eval(query);
    } catch (e) {
      return Promise.reject('[x] Error: Not supported');
    }
    
    return this.connect()
    .then( conn => {
      return eq.run(conn)
      .then(this.handleResponse.bind(this))
      .then(function() {
        return conn.close()
      })
      .then(function() {
        var endTime = +new Date(),
        diff = (endTime-startTime)/1000;
        console.log(clc.cyanBright(`[.] Took: ${diff} seconds`));
        console.log(clc.cyanBright(`[.] No Results: ${that.resultSize}`));
        that.resultSize = 0;
      })
    });
  }

  /**
   * Take a response from RethinkDB and print it to console
   * 
   * @param  {Object} cursor
   * @return {void}
   */
  handleResponse(cursor) {
    var that = this;
    if (cursor.hasOwnProperty('each')) {
      cursor.each( (e, x) => { 
        if (!e) {
          console.log(JSON.stringify(x, null, 2));
          that.resultSize++;
        }
      });
    } else {
      console.log(cursor);
      that.resultSize++;
    }
  }
}

export default Client