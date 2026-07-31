# Personal board

A personal board with four columns: Waiting for, Backlog, Now, Accomplished. The
board is one HTML file. There is no build step, no dependency and no server. Open
`index.html` in a browser and the board works.

**Waiting for** holds the cards that are blocked on someone else. A hairline
separates this column from the other three. The column stays uncoloured for every
palette. It uses the page background, with white cards and grey text.

![The board with a few cards in each column](doc/board.png)

## Use

Open `index.html` directly. A `file://` address works.

- **+ add** at the bottom of a column writes a new card. Enter saves the card.
  Shift+Enter makes a new line. Escape cancels.
- **≡** on a card opens the list. The list holds **Edit**, **Notes**, **Export
  this card** and **Delete**. A note carries the same button, with **Edit** and
  **Delete note**. Escape or a click outside closes the list.
- **Edit** is the one way to change the text of a card. The same keys apply. A
  click on the text of the card does nothing.
- **Backticks** mark inline code. `` `npm test` `` shows as a monospace chip. The
  card keeps the backticks, so you see them again when you edit the card. A chip
  must hold text and stay on one line. A single backtick therefore stays a
  backtick.
- **Links**: the board finds links in the text of a card. Two shapes work, a bare
  `https://…` and `[what it is](https://…)`. Use the second shape for an address
  that is too long to read on a card. It shows the words and keeps the address
  behind them. A `mailto:` address is also a link. Nothing else is a link. A
  `javascript:` address is not a link. An address inside backticks is code, not a
  link. The card keeps the text you typed, so you see it again when you edit the
  card. A link opens in a new tab.
- **Markdown**: the board reads some of the Markdown marks. Inside a line,
  `**bold**`, `*italic*` and `~~struck through~~` mark the words between them.
  Use asterisks for bold and italic. An underscore is a character, not a mark, so
  a name such as `max_speed` stays as it is. At the head of a line, `#` to
  `######` make a heading, `>` makes a quote, and `-`, `*` or `+` make a list.
  `1.` or `1)` makes a numbered list, which counts from the first number you
  write. Three or more of `-`, `*` or `_` alone on a line draw a rule across the
  card. A blank line closes a paragraph, a quote or a list. A mark must hold text
  and stay on one line. The board reads no other Markdown. There are no tables and
  no images. The card keeps the marks you typed, so you see them again when you
  edit the card.
- **Fences** mark a block of code. Three or more backticks alone on a line open
  the block, and a line of at least as many backticks closes it. The lines between
  them show as you typed them, in one monospace box. The board reads no mark inside
  a block, so a `#` or an address there is the characters it is, and a blank line
  closes nothing. A word after the opening fence names a language. The board reads
  no language and drops the word. A fence that the card never closes is not a
  fence. Its backticks stay backticks and the lines under it read as they would
  have.
- **Notes** opens the notes of the card, in a small window in the middle of the
  page. Notes are cards themselves. They take the same editing, backticks, links,
  dates and dragging to reorder. They have a list of their own, with a delete and
  an Undo. The window takes the colour of the column that holds the card. A card
  with notes says so next to its date, and a click on those words opens the
  window too. Escape or a click outside closes the window.
- **Drag a card** to move it within a column or to another column.
- **Delete** takes a card off the board. **Delete note** takes a note off a card.
  Neither asks first. **clear column** empties Accomplished and does ask first.
  All three raise a toast with an **Undo**.
- **Export this card** writes one card to a file, with its notes. Use the file to
  pass the card to someone else. Import adds the card to the board and does not
  change the other cards. The card goes to the column it was sent from. If this
  board has no such column, the card goes to Backlog. The card arrives as a new
  card. The same file imported twice therefore gives two cards.
- **Palette** swaps the colours of Backlog, Now and Accomplished. Pick a family,
  then a combination. The panel stays open while you try the combinations. A
  click outside or Escape closes the panel.
- **Export** downloads the whole board as JSON. **Import** reads back a board or
  a single card.

## Storage

The board keeps the notes of a card on the card, so a card is whole on its own.
Notes travel with Export and Import. A delete takes the notes of the card with
it. Undo brings the card and the notes back. A board saved before notes existed
opens with no notes.

Two shapes leave the board and come back. A whole board is `{"cols": ...}` and
replaces the board that is here. One card is `{"card": ..., "col": ...}` and
joins the board. Import reads the file and tells the two shapes apart by the
fields the file carries.

The board lives in `localStorage` under `personal.board.v1`. The palette lives
under `personal.palette.v1`. Both are per browser and per machine. Use Export to
move a board to another machine. Two tabs on the same board stay in sync.

The page also reads two older keys, `todo.board.v1` and `backlog.board.v1`. The
first load carries a board under an older key over to the new key, and drops the
old key. Older JSON exports still import.

## Palettes

The colour combinations come from Sanzo Wada's *A Dictionary of Color
Combinations*. The board groups the combinations into families by their lead
colour, and trims each combination to three colours. Backlog, Now and
Accomplished take one colour each. Waiting for takes no palette colour.
