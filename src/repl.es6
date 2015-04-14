var clc = require('cli-color');
var Promise = require('bluebird');

class REPL {
  /**
   * @constructor
   * @param  {Client} client
   */
  constructor(client) {
    this.client = client;
    this.history = [];
    this.preHistory = null;
    this.historyId = 0;
    this.commands = {
      dbs : this.client.getDbList.bind(this.client),
      tables : this.client.getTableList.bind(this.client),
      help: this.help.bind(this),
      db : function(x) { return client.setDb(x); }
    }

    this.input = [];
    this.cursor = 0;

    this.ignoredKeys = [
      'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
      'clear'
    ]
  }

  /**
   * Print the prompt for this REPL
   */
  prompt() {
    process.stdout.write('\n' + clc.green('reql-cli') + clc.blue('> '));
  }

  /**
   * Add a command to the REPL history for quick retrieval
   * 
   * @param {String} entry
   * @return {void}
   */
  addToHistory(entry) {
    this.historyId = 0;
    if (this.history.indexOf(entry) === -1) {
      this.history = [ entry ].concat(this.history.slice(0,8));
    }
  }

  /**
   * Clear the current input of the REPL
   * 
   * @return {void}
   */
  clearInput() {
    this.input.forEach(c => {
      process.stdout.write('\b \b', 'utf8');
    });
    this.input = [];
  }

  /**
   * Set the current input to the given value
   * 
   * @param {String} val
   * @return {void}
   */
  setInput(val) {
    if (!val) {
      return;
    }
    process.stdout.write(val);
    this.input = val.split('');
  }

  /**
   * Start the REPL listening in on Stdin keypresses
   * 
   * @return {void}
   */
  start() {
    var that = this;
    var keypress = require('keypress');

    process.stdout.write(clc.green('- RethinkDB Command Line Interface v1.0.0\n- Courtesy of Workshape.io'))
    that.prompt();
    process.stdin.setEncoding('utf8');
    
    keypress(process.stdin);

    process.stdin.on('keypress', function (ch, key) {
      if (key && that.ignoredKeys.indexOf(key.name) > -1) {
        return;
      } else if (key && !key.ctrl && key.name === 'up') {
        if (that.history.length > 0 && that.historyId < that.history.length) {
          if (that.historyId === 0) {
            that.preHistory = that.input.join('');
          }
          that.clearInput()
          that.setInput(that.history[that.historyId++]);
        }
      } else if (key && !key.ctrl && key.name === 'down') {
        if (that.historyId > 0) {
          that.clearInput();
          that.setInput(that.history[that.historyId--]);
        } else if (that.preHistory) {
          that.clearInput();
          that.setInput(that.preHistory);
          that.preHistory = null;
        }
      } else if (key && !key.ctrl && key.name === 'return') {
        var chunk = that.input.join('');
        that.input = [];
        if (chunk) {
          process.stdout.write('\n', 'utf8');
          that.handle(chunk.trim());
        } else {
          that.prompt();
        }
      } else if (key && key.ctrl && key.name === 'c') {
        console.log(clc.yellow('\n[.] Closing reql-cli...'));
        process.exit(0);
      } else if (key && !key.ctrl && (key.name === 'delete' || key.name === 'backspace')) {
        if (that.input.length > 0) {
          process.stdout.write('\b \b', 'utf8');
          that.input.pop();
          if (that.cursor > 0) {
            process.stdout.write('\b', 'utf8');
            that.cursor--;
          }
        }
      } else if (key && !key.ctrl && (key.name === 'left')) {
        if (that.input.length > 0 && that.cursor < that.input.length) {
          process.stdout.write('\b', 'utf8');
          that.cursor++;
        }
      } else if (key && !key.ctrl && (key.name === 'right')) {
        if (that.input.length > 0 && that.cursor > 0) {

          process.stdout.write(that.input[that.input.length-that.cursor], 'utf8');
          --that.cursor;
        }
      } else {
        process.stdout.write(ch, 'utf8');
        if(that.cursor !== 0) {
          that.input[that.input.length-that.cursor] = ch;
          --that.cursor;
        } else {
          that.input.push(ch);
        }
      }
    });

    process.stdin.setRawMode(true);
  }

  /**
   * Handle a command given by the user
   * 
   * @param  {String} input
   * @return {void}
   */
  handle(input) {
    var that = this, promise;
    var args = input.split(' ');
    if (that.commands[args[0]]) {
      promise = that.commands[args[0]](args[1])
    } else {
      promise = that.client.query(input)
    }
    
    promise
    .then(function() {
      that.addToHistory(input);
    })
    .catch(e => {
      console.log(clc.red(e))
      that.help()
    })
    .finally(function() {
      that.prompt()
    });
  }

  help() {
    process.stdout.write('\n', 'utf8');
    console.log(clc.yellow(
    `[-] Available commands:
        - dbs - print available databases
        - db {db} - change current db to {db}
        - tables - print available tables in current db
        - r... - any rethink valid query, omitting run()

        - press ctrl + c to quit`))
    return Promise.resolve();
  }
}

export default REPL