# Personal board

A personal board with four columns: Waiting for, Backlog, Now, Accomplished. The
board is one HTML file. There is no build step, no dependency and no server.
Open `index.html` in a browser.

**Waiting for** holds the cards that need action from someone else. A hairline
separates this column from the other three. No palette gives this column a
colour. It uses the page background. Its cards are white and its text is grey.

![The board with a few cards in each column](doc/board.png)

## Use

Open `index.html` directly. A `file://` address works.

- **+ add** at the bottom of a column writes a new card. Enter saves the card.
  Shift+Enter makes a new line. Escape cancels.
- **≡** on a card opens the menu. The menu holds **Edit**, **Notes**, **Export
  this card** and **Delete**. A note has the same button, with **Edit** and
  **Delete note**. Escape or a click outside closes the menu.
- **Edit** is the one way to change the text of a card. The same keys apply. A
  click on the text of the card does nothing.
- **Backticks** mark inline code. `` `npm test` `` shows as a monospace chip. The
  card keeps the backticks, so you see them again when you edit the card. A chip
  must hold text and stay on one line. A single backtick therefore stays a
  backtick.
- **Links**: the board finds links in the text of a card. Two shapes work: a bare
  `https://...` and `[what it is](https://...)`. The second shape is for an
  address that is too long to read on a card. It shows the words and keeps the
  address behind them. A `mailto:` address is also a link. A link opens in a new
  tab.
  - Nothing else is a link. A `javascript:` address is not a link. An address
    inside backticks is code, not a link. The card keeps the text you typed, so
    you see it again when you edit the card.
- **Markdown**: the board reads some of the Markdown marks. A mark must hold text
  and stay on one line. The card keeps the marks you typed, so you see them again
  when you edit the card.
  - Inside a line, `**bold**`, `*italic*` and `~~struck through~~` mark the words
    between them. Bold and italic need asterisks. The board does not read the
    underscore as a mark, so a name such as `max_speed` stays as it is.
  - At the head of a line, `#` to `######` make a heading, `>` makes a quote, and
    `-`, `*` or `+` make a list. `1.` or `1)` makes a numbered list, which counts
    from the first number you write. Three or more of `-`, `*` or `_` alone on a
    line make a divider across the card.
  - A blank line closes a paragraph, a quote or a list. The board reads no other
    Markdown. There are no tables and no images.
- **Fences** mark a block of code. Three or more backticks alone on a line open
  the block, and a line of at least as many backticks closes it. The lines
  between them show as you typed them, in one monospace box. The board reads no
  mark inside a block, so a `#` or an address there stays as plain characters.
  - A blank line inside a block closes nothing. A word after the opening fence
    names a language. The board reads no language and deletes the word. A fence
    that the card never closes is not a fence. Its backticks stay backticks, and
    the board reads the lines below it in the usual way.
- **Notes** opens the notes of the card, in a small window in the middle of the
  page. Notes are cards themselves. The same editing, backticks, links and dates
  apply to them, and a drag reorders them. They have a menu of their own, with a
  delete and an Undo.
  - The window uses the colour of the column that holds the card. A card with
    notes says so next to its date, and a click on those words opens the window
    too. Escape or a click outside closes the window.
- **Drag** moves a card within a column or to another column.
- **Delete** removes a card from the board. **Delete note** removes a note from a
  card. Neither asks first. **clear column** empties Accomplished and asks first.
  All three show a toast with an **Undo**.
- **Export this card** writes one card to a file, with its notes. The file passes
  the card to someone else. Import adds the card to the board and does not change
  the other cards. The card goes to the column that it was in. If this board has
  no such column, the card goes to Backlog.
  - The card arrives as a new card. If you import the same file twice, you get
    two cards.
- **Palette** changes the colours of Backlog, Now and Accomplished. You select a
  family, then a combination from that family. The panel stays open while you try
  the combinations. A click outside or Escape closes the panel.
- **Export** downloads the whole board as JSON. **Import** reads a board or a
  single card.

## Storage

The board keeps the notes of a card on the card, so a card is whole on its own.
Notes travel with Export and Import. A delete removes the notes of the card too.
Undo returns the card and the notes. A board saved before notes existed opens
with no notes.

Export and Import use two shapes. A whole board is `{"cols": ...}` and replaces
the board that is here. One card is `{"card": ..., "col": ...}` and joins the
board. Import reads the fields in the file to find which of the two shapes it is.

The board is in `localStorage`, in the key `personal.board.v1`. The palette is in
the key `personal.palette.v1`. The two keys belong to one browser on one machine.
Export moves a board to another machine. Two tabs on the same board stay in sync.

The page also reads two older keys, `todo.board.v1` and `backlog.board.v1`. At
the first load, the page moves a board from an older key to the new key, and then
deletes the older key. Import also reads older JSON exports.

## Palettes

The colour combinations come from Sanzo Wada's *A Dictionary of Color
Combinations*. The board groups the combinations into families by their main
colour, and keeps three colours from each combination. Backlog, Now and
Accomplished get one colour each. The palette gives no colour to Waiting for.
