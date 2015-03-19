class Client {
  constructor(r, config) {
    this.r = r;
    this.config = config;
  }

  connect() {
    return this.r.connect(this.config);
  }

  getDbList() {
    return this.connect()
    .then( conn => {
      return this.r.dbList().run(conn);
    })
    .then( list => {
      var output = ` [-] Available databases on ${this.config.host}\n`
      list.forEach(db => output += `\n     - ${db}`);

      return output;
    })
    .then(console.log);
  }

  /**
   * Execute a ReQL query and print out the result
   * @param  {[type]} query [description]
   * @return {[type]}       [description]
   */
  query(query) {
    if (query.indexOf('r.') === 0) {
      query = 'this.' + query;
    }

    var eq = eval(query);

    return this.connect()
    .then( conn => {
      return eq.run(conn);
    })
    .then(this.handleResponse);
  }

  handleResponse(cursor) {
    if (cursor.hasOwnProperty('each')) {
      cursor.each( (e, x) => { 
        if (!e) {
          console.log(x);
        }
      });
    } else {
      console.log(cursor);
    }
  }
}

export default Client