class REPL {
  constructor(client) {
    this.client = client;

    this.commands = {
      list : this.client.getDbList.bind(this.client)
    }
  }

  prompt() {
    process.stdout.write('\nreql-cli> ');
  }

  start() {
    var that = this;
    process.stdout.write('- RethinkDB Command Line Interface v1.0.0\n- Courtesy of Workshape.io')
    that.prompt();
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', function() {
      var chunk = process.stdin.read();
      if (chunk !== null) {
        that.handle(chunk.trim());
      }
    })
  }

  handle(input) {
    var that = this;
    if (that.commands[input]) {
      that.commands[input]()
      .error( e => process.stdout.write(e))
      .finally(function() {
        that.prompt()
      });
    } else {
      that.client.query(input)
      .error( e => process.stdout.write(e))
      .finally(function() {
        that.prompt()
      });
    }
    

  }

  help() {

  }
}

export default REPL