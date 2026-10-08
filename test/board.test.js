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

function dragOnto(from, onto) {
  const card = (id) => document.querySelector('.card[data-id="' + id + '"]');
  const box = card(onto).getBoundingClientRect();
  const at = { bubbles: true, cancelable: true,
    clientX: box.left + box.width / 2, clientY: box.top + box.height / 2,
    dataTransfer: new DataTransfer() };
  card(from).dispatchEvent(new DragEvent('dragstart', at));
  card(onto).dispatchEvent(new DragEvent('dragover', at));
  card(onto).dispatchEvent(new DragEvent('drop', at));
  card(from).dispatchEvent(new DragEvent('dragend', at));
}

function choices() {
  return Array.from(document.querySelectorAll('[role="menu"]'))
    .filter((menu) => menu.checkVisibility())
    .flatMap((menu) => Array.from(menu.querySelectorAll('button'),
      (b) => b.textContent.trim()));
}

function choose(word) {
  Array.from(document.querySelectorAll('[role="menu"] button'))
    .find((b) => b.checkVisibility() && b.textContent.trim() === word)
    ?.click();
}

function call(fn, ...args) {
  return '(' + fn + ')(' + args.map((a) => JSON.stringify(a)).join(', ')
    + ')';
}

const DECK = 'Create deck';
const ABOVE = 'Place above this card';
const BELOW = 'Place below this card';

test('a drop on the middle of a card asks where the card goes', async () => {
  const seen = await inPage(async (page) => {
    const out = {};
    const answers = { deck: DECK, up: ABOVE, down: BELOW, escape: null };
    for (const [name, answer] of Object.entries(answers)) {
      await seed(page, STORE, { cols: { remember: [], now: [],
        accomplished: [], backlog: ['a', 'b', 'c'].map(
          (id) => ({ id, text: 'card ' + id, created: 1 })) } });
      await page.go();
      await page.run(call(dragOnto, 'c', 'a'));
      const asked = await page.run(call(choices));
      const before = await stored(page, STORE);
      if (!answer) {
        await page.run('document.dispatchEvent(new KeyboardEvent('
          + '"keydown", { key: "Escape", bubbles: true }))');
      } else {
        await page.run(call(choose, answer));
      }
      out[name] = { asked, before, after: await stored(page, STORE),
        left: await page.run(call(choices)) };
    }
    return out;
  });

  const ids = (list) => list.map((c) => c.id);
  Object.values(seen).forEach((one) => {
    assert.deepStrictEqual(one.asked, [DECK, ABOVE, BELOW]);
    assert.deepStrictEqual(ids(one.before.cols.backlog), ['a', 'b', 'c']);
    assert.deepStrictEqual(one.left, []);
  });
  const deck = seen.deck.after.cols.backlog;
  assert.deepStrictEqual(ids(deck), ['a', 'b']);
  assert.deepStrictEqual(ids(deck[0].cards), ['c']);
  assert.deepStrictEqual(ids(seen.up.after.cols.backlog), ['c', 'a', 'b']);
  assert.deepStrictEqual(ids(seen.down.after.cols.backlog), ['a', 'c', 'b']);
  assert.deepStrictEqual(ids(seen.escape.after.cols.backlog),
    ['a', 'b', 'c']);
});

test('a drop on the head of a deck adds to it without asking', async () => {
  const seen = await inPage(async (page) => {
    await seed(page, STORE, { cols: { remember: [], now: [],
      accomplished: [], backlog: [
        { id: 'p', text: 'plain', created: 1 },
        { id: 'h', text: 'head', created: 1,
          cards: [{ id: 'k', text: 'in the deck', created: 1 }] }] } });
    await page.go();
    await page.run(call(dragOnto, 'p', 'h'));
    return { asked: await page.run(call(choices)),
      saved: await stored(page, STORE) };
  });

  assert.deepStrictEqual(seen.asked, []);
  assert.deepStrictEqual(seen.saved.cols.backlog.map((c) => c.id), ['h']);
  assert.deepStrictEqual(seen.saved.cols.backlog[0].cards.map((c) => c.id),
    ['p', 'k']);
});

test('a place button shows only where pin and low rules let a card land',
  async () => {
    const card = (id, extra) => Object.assign({ id, text: id, created: 1 },
      extra);
    const pinned = { pinned: true };
    const low = { low: true };
    const cases = {
      ontoPinned: [[card('P', pinned), card('a'), card('b')], 'b', 'P'],
      ontoLow: [[card('a'), card('b'), card('L1', low), card('L2', low)],
        'a', 'L1'],
      pinnedOntoNormal: [[card('P', pinned), card('a'), card('b')], 'P', 'b'],
      lowOntoNormal: [[card('a'), card('b'), card('L', low)], 'L', 'a']
    };
    const seen = await inPage(async (page) => {
      const out = {};
      for (const [name, [backlog, from, onto]] of Object.entries(cases)) {
        await seed(page, STORE, { cols: { remember: [], now: [],
          accomplished: [], backlog } });
        await page.go();
        await page.run(call(dragOnto, from, onto));
        out[name] = await page.run(call(choices));
        if (name === 'ontoPinned') {
          await page.run(call(choose, BELOW));
          out.pressed = (await stored(page, STORE)).cols.backlog
            .map((c) => c.id);
        }
      }
      return out;
    });

    assert.deepStrictEqual(seen.ontoPinned, [DECK, BELOW]);
    assert.deepStrictEqual(seen.pressed, ['P', 'b', 'a']);
    assert.deepStrictEqual(seen.ontoLow, [DECK, ABOVE]);
    assert.deepStrictEqual(seen.pinnedOntoNormal, [DECK]);
    assert.deepStrictEqual(seen.lowOntoNormal, [DECK]);
  });
