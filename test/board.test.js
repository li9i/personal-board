const { test } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PAGE = 'file://' + path.join(__dirname, '..', 'index.html');
const STORE = 'personal.board.v2';
const OLD_STORE = 'personal.board.v1';

function launch() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'board-'));
  const chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--remote-debugging-pipe',
    '--user-data-dir=' + profile, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
  const replies = new Map();
  const hooks = [];
  let last = 0;
  let buffer = '';

  chrome.stdio[4].on('data', (chunk) => {
    buffer += chunk;
    let end;
    while ((end = buffer.indexOf('\0')) >= 0) {
      const msg = JSON.parse(buffer.slice(0, end));
      buffer = buffer.slice(end + 1);
      if (replies.has(msg.id)) {
        replies.get(msg.id)(msg);
        replies.delete(msg.id);
      }
      hooks.filter((h) => h.method === msg.method)
        .forEach((h) => { hooks.splice(hooks.indexOf(h), 1); h.done(msg); });
    }
  });

  function send(method, params, sessionId) {
    const id = ++last;
    chrome.stdio[3].write(
      JSON.stringify({ id, method, params: params || {}, sessionId }) + '\0');
    return new Promise((resolve, reject) => {
      replies.set(id, (msg) => {
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      });
    });
  }

  function next(method) {
    return new Promise((done) => hooks.push({ method, done }));
  }

  async function open() {
    const { targetId } = await send('Target.createTarget',
      { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget',
      { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);

    async function go() {
      const loaded = next('Page.loadEventFired');
      await send('Page.navigate', { url: PAGE }, sessionId);
      await loaded;
    }

    async function run(expression) {
      const out = await send('Runtime.evaluate',
        { expression, returnByValue: true }, sessionId);
      if (out.exceptionDetails) throw new Error(out.exceptionDetails.text);
      return out.result.value;
    }

    await go();
    return { go, run };
  }

  async function close() {
    const gone = new Promise((done) => chrome.on('exit', done));
    await send('Browser.close');
    await gone;
    fs.rmSync(profile, { recursive: true, force: true });
  }

  return { open, close };
}

function stored(page, key) {
  return page.run('localStorage.getItem(' + JSON.stringify(key) + ')')
    .then(JSON.parse);
}

async function inPage(work) {
  const browser = launch();
  try {
    return await work(await browser.open());
  } finally {
    await browser.close();
  }
}

function seed(page, key, board) {
  return page.run('localStorage.setItem(' + JSON.stringify(key) + ', '
    + JSON.stringify(JSON.stringify(board)) + ')');
}

test('a save keeps the parts the page does not know', async () => {
  const saved = await inPage(async (page) => {
    await seed(page, STORE, {
      owner: 'me',
      cols: {
        remember: [],
        backlog: [
          { id: 'plain', text: 'a plain card', created: 1 },
          { id: 'head', text: 'a deck', created: 1, shade: 'teal',
            notes: [{ id: 'note', text: 'a note', created: 1, stamp: 7 }],
            cards: [{ id: 'kid', text: 'in the deck', created: 1, size: 'L',
              cards: [{ id: 'deep', text: 'one deck down', created: 1 }] }] },
          { id: 'inner', text: 'a card that holds a board', created: 1,
            board: { flag: 1, cols: { backlog: [
              { id: 'in', text: 'inside', created: 1, mood: 'calm' }] } } }
        ],
        now: [],
        accomplished: [],
        someday: [{ id: 'later', text: 'a column the page lacks', created: 1 }]
      }
    });
    await page.go();
    await page.run(
      'document.querySelector(\'.card[data-id="plain"] .lowbtn\').click()');
    return stored(page, STORE);
  });

  const backlog = saved.cols.backlog;
  const head = backlog.find((c) => c.id === 'head');
  const inner = backlog.find((c) => c.id === 'inner');
  assert.strictEqual(backlog.find((c) => c.id === 'plain').low, true);
  assert.strictEqual(saved.owner, 'me');
  assert.deepStrictEqual(saved.cols.someday,
    [{ id: 'later', text: 'a column the page lacks', created: 1 }]);
  assert.strictEqual(head.shade, 'teal');
  assert.strictEqual(head.notes[0].stamp, 7);
  assert.strictEqual(head.cards[0].size, 'L');
  assert.strictEqual(head.cards[0].cards[0].text, 'one deck down');
  assert.strictEqual(inner.board.flag, 1);
  assert.strictEqual(inner.board.cols.backlog[0].mood, 'calm');
});

test('the first load moves the board and leaves a sign', async () => {
  const seen = await inPage(async (page) => {
    await seed(page, OLD_STORE, {
      cols: { backlog: [{ id: 'moved', text: 'carried over', created: 1 }] }
    });
    await page.go();
    return {
      moved: await stored(page, STORE),
      sign: await stored(page, OLD_STORE),
      shown: await page.run(
        'document.querySelector(\'.card[data-id="moved"]\') !== null')
    };
  });

  assert.strictEqual(seen.moved.cols.backlog[0].text, 'carried over');
  assert.strictEqual(seen.shown, true);
  [seen.sign.cols.remember, seen.sign.cols.waiting].forEach((list) => {
    assert.strictEqual(list.length, 1);
    assert.match(list[0].text, /^This copy of the page is out of date\./);
  });
});

test('a board card steps in by its tab and edits by its name', async () => {
  const seen = await inPage(async (page) => {
    const some = (name, n) => Array.from({ length: n },
      (_, i) => ({ id: name + i, text: name + ' ' + i, created: 1 }));
    await seed(page, STORE, {
      cols: {
        remember: [],
        backlog: [],
        now: [
          { id: 'kitchen', text: 'Kitchen renovation\n- budget 4k',
            created: 1, board: { cols: {
              remember: some('r', 2), backlog: some('b', 4),
              now: some('n', 2), accomplished: some('a', 3) } } },
          { id: 'test', text: 'test', created: 1, board: { cols: {} } }
        ],
        accomplished: []
      }
    });
    await page.go();
    const card = (id) => 'document.querySelector(\'.card[data-id="'
      + id + '"]\')';
    const shown = {
      kitchen: await page.run(card('kitchen') + '.innerText'),
      empty: await page.run(card('test') + '.innerText')
    };
    await page.run('Array.from(' + card('kitchen') + '.querySelectorAll("*"))'
      + '.find((e) => Array.from(e.childNodes).some((n) => n.nodeType === 3'
      + ' && n.textContent.trim() === "Kitchen renovation"))'
      + '.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }))');
    shown.byName = await page.run('location.hash');
    shown.editing = await page.run('document.activeElement.value');
    await page.go();
    await page.run('Array.from(' + card('kitchen') + '.querySelectorAll('
      + '"button")).find((b) => b.textContent.trim().toLowerCase()'
      + ' === "board").click()');
    shown.byTab = await page.run('location.hash');
    return shown;
  });

  assert.match(seen.kitchen, /Kitchen renovation/);
  assert.doesNotMatch(seen.kitchen, /budget 4k/);
  assert.doesNotMatch(seen.kitchen, /\bopen\b/);
  assert.match(seen.kitchen, /3 of 9 done/);
  assert.match(seen.empty, /empty board/);
  assert.strictEqual(seen.byName, '');
  assert.strictEqual(seen.editing, 'Kitchen renovation\n- budget 4k');
  assert.strictEqual(seen.byTab, '#kitchen');
});

test('a name in backticks shows as code on its card and in the heading',
  async () => {
    const seen = await inPage(async (page) => {
      await seed(page, STORE, {
        cols: {
          remember: [],
          backlog: [
            { id: 'outer', text: 'see `outer_board`', created: 1, board: {
              cols: { backlog: [
                { id: 'inner', text: '`inner_board`', created: 1,
                  board: { cols: {} } }] } } }
          ],
          now: [],
          accomplished: []
        }
      });
      await page.go();
      const codes = (where) => page.run('Array.from(document.querySelectorAll('
        + JSON.stringify(where + ' code') + ')).map((c) => c.textContent)');
      const shown = {
        card: await codes('.card[data-id="outer"]'),
        cardText: await page.run(
          'document.querySelector(\'.card[data-id="outer"]\').innerText')
      };
      await page.run('location.hash = "outer/inner"');
      shown.heading = await codes('#trail');
      shown.headingText = await page.run(
        'document.getElementById("trail").innerText');
      return shown;
    });

    assert.deepStrictEqual(seen.card, ['outer_board']);
    assert.doesNotMatch(seen.cardText, /`/);
    assert.deepStrictEqual(seen.heading, ['outer_board', 'inner_board']);
    assert.strictEqual(seen.headingText,
      'Mother Board / see outer_board / inner_board');
  });
