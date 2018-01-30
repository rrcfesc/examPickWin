// Test which will run in nodejs
// $ node test.js
// (Might work with other CommonJS-compatible environments)
const assert        = require('assert');
const LRU        = require('./lru').LRU;
const asserteq      = assert.equal;
const sizeMap       = 2;
const breakLineC    = "\n==============\n";
const breakLine     = "\n";
const tests = {
    ['put and get']() {
        console.log(breakLineC);
        let c = new LRU(sizeMap);
        asserteq(c.size, 0);
        asserteq(c.limit, sizeMap);
        asserteq(c.oldest, undefined);
        asserteq(c.newest, undefined);
        let t1 = Date.now();
        c.put(1, 1);
        let t = Date.now();
        let texecution = t - t1;
        let timestr = 'Execution time on put 1(' + fmttime(texecution) + ')';
        console.log(timestr);
        c.put(2, 2);
        asserteq(c.size, sizeMap);
        console.log("");
        asserteq(c.get(1), 1);// regresa 1
        c.put(3, 3);// borra key 2
        asserteq(c.size, 2);
        asserteq(c.get(2), undefined);// regresa -1 (no se encontró)
        c.put(4, 4); // borra key 1
        asserteq(c.get(1), undefined);// regresa -1 (no se encontró)
        asserteq(c.get(3), 3);// regresa 3
        asserteq(c.get(4), 4);// regresa 4
    }
}; // tests


function fmttime(t) {
    return (Math.round((t)*10)/10)+'ms';
}

function die(err) {
    console.error('\n' + (err.stack || err));
    process.exit(1);
}

function runNextTest(tests, testNames, allDoneCallback) {
    let testName = testNames[0];
    if (!testName) {
        return allDoneCallback();
    }
    process.stdout.write(testName+' ... ');
    let t1 = Date.now();
    let next = function() {
        t1 = Date.now() - t1;
        if (t1 > 10) {
          process.stdout.write('ok ('+fmttime(t1)+')\n');
        } else {
          process.stdout.write('ok\n');
        }
        runNextTest(tests, testNames.slice(1), allDoneCallback);
    };
    try {
        let p = tests[testName]();
        if (p && p instanceof Promise) {
          p.then(next).catch(die);
        } else {
          next();
        }
    } catch (err) {
        die(err);
    }
}

let t = Date.now();
runNextTest(tests, Object.keys(tests), function() {
  t = Date.now() - t;
  let timestr = '';
  if (t > 10) {
    timestr = '(' + fmttime(t) + ')';
  }
  console.log(`${Object.keys(tests).length} tests passed ${timestr}`);
});