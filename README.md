#### ReQL CLI

We wanted to be able to query our [RethinkDB](http://www.rethinkdb.com) cluster from the command line
and we realised there wasn't an obvious way to do this whilst continuing to use the Javascript API.

This is the result of this desire + a hack day and messing about with some aspects of ES6 at the same time.

We would welcome other contributors to this project.

#### Installation

To install the most stable `reql-cli` binary globally on your system via `npm` you can simply:

```bash
$ [sudo] npm install -g reql-cli
$ reql-cli --help
```
[![Circle CI](https://circleci.com/gh/Workshape/reql-cli.svg?style=svg)](https://circleci.com/gh/Workshape/reql-cli)
[![NPM](https://nodei.co/npm/reql-cli.png?downloads=true&stars=true)](https://nodei.co/npm/reql-cli)

Note: you will need `node` and `npm` installed first.

The easiest way to install `node.js` is with [nave.sh](https://github.com/isaacs/nave) by executing `[sudo] ./nave.sh usemain stable`

#### Notes

We decided not to use the Node.js REPL in favour of a very basic custom implementation - therefore
currently some common convenience keystrokes do not currently work.

#### Usage

```bash
./bin/reql-cli -h [host] -p [port] -db [database]

  Options:
    -h  : host     [default:localhost]
    -p  : port     [default:28015]
    -db : database [default:test]
```

```bash
$ ./bin/reql-cli
- RethinkDB Command Line Interface v1.0.0
- Courtesy of Workshape.io
reql-cli> help
[-] Available commands:
  - dbs - print available databases
  - db {db} - change current db to {db}
  - tables - print available tables in current db
  - r... - any rethink valid query, omitting run()

  - press ctrl + c to quit
reql-cli> dbs
[-] Available databases on localhost:
  - rethinkdb
  - test
  - fisher

reql-cli> db fisher
[.] Changed default database to fisher

reql-cli> r.table('account').orderBy(r.desc('created')).limit(3)
[
  { created: Wed Mar 18 2015 11:42:38 GMT+0000 (UTC),
    email: 'a@bl.com',
    hash: '$2a$10$vZxOl3gS/eNmovcYzn5HaOGa4cfsfJngMCQPgvTdmU5RSLeegN94u',
    id: '95ab2b32-1673-439f-9c42-a312890f67a5',
    verificationKey: '0b1f-154d-2227',
    verified: true
  },
  { created: Wed Mar 18 2015 11:38:52 GMT+0000 (UTC),
    email: 'gordon@fisher.io',
    hash: '$2a$04$Ab6zeo6vXhaUAb/LEsfn4e5FCvKMQDdjdpU4RpYiFmoetTBgjXdGS',
    id: '1014e711-96f8-43d1-9068-a08bfffac140',
    verified: true
  },
  { created: Wed Mar 18 2015 11:38:52 GMT+0000 (UTC),
    email: 'jason@fisher.io',
    hash: '$2a$04$Ab6zeo6vXhaUAb/LEsfn4e5FCvKMQDdjdpU4RpYiFmoetTBgjXdGS',
    id: '2e0a1009-09e6-49c4-a540-7c79d2229608',
    verified: true
  }
]
[.] Took: 0.024 seconds
[.] No Results: 1

reql-cli>
```

#### Tests

`npm test`

