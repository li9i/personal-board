# Personal board

A personal board with four columns: Waiting for, Backlog, Now, Accomplished. The
board is one HTML file. There is no build step, no dependency and no server.
Open `index.html` in a browser.

**Waiting for** holds the cards that need action from someone else. A hairline
separates this column from the other three. No palette gives this column a
colour. It uses the page background. Its cards are white and its text is grey.

![The board with a few cards in each column. The cards show a heading and a
list, a code chip, a fenced block, a link, and a card with one
note](doc/board.png)

## Use

Open `index.html` directly. A `file://` address works.

- **+ add** at the bottom of a column writes a new card. Enter saves the card.
  Shift+Enter makes a new line. Escape cancels.
- **≡** on a card opens the menu. The menu holds **Export this card** and
  **Delete**. A note has the same button, with **Delete note**. Escape or a click
  outside closes the menu.
- **A double click** on a card opens its text in a box. This is the one way to
  write the text, and a checkbox is the one thing that a single click changes. The
  same keys apply. A single click does nothing else, and a double click on a link
  or a button does what that link or button does. A note behaves in the same way.
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
- **Checkboxes**: at the head of a bulleted item, `- [ ]` makes an open box and
  `- [x]` a box that is done. A click on a box turns it over and writes the
  change into the text of the card. So the state of a box is text, and it travels
  with Export and Import as the rest of the card does.
  - Only a space or a lower case `x` goes between the brackets, and a space
    follows them. So `- [X] read` and `- [-] read` are items with the characters
    that you typed. A numbered item takes no box.
  - An item with a box carries no bullet. The box stands where the bullet would
    be, so one list holds both kinds of item and the words after them line up.
  - A note takes boxes too. The head of the notes window shows the text of its
    card, and a box there is the same box as the one on the card.
- **Fences** mark a block of code. Three or more backticks alone on a line open
  the block, and a line of at least as many backticks closes it. The lines
  between them show as you typed them, in one monospace box. The board reads no
  mark inside a block, so a `#` or an address there stays as plain characters.
  - A blank line inside a block closes nothing. A word after the opening fence
    names a language. The board reads no language and deletes the word. A fence
    that the card never closes is not a fence. Its backticks stay backticks, and
    the board reads the lines below it in the usual way.
- **Notes** open in a small window in the middle of the page. The words next to
  the date of a card open that window. A card with notes gives their count there.
  A card with no notes shows **add note** while the pointer is on the card. A
  click there opens the window, with the box for the first note. Notes are cards
  themselves. The same editing, backticks, links and dates apply to them, and a
  drag reorders them. They have a menu of their own, with a delete and an Undo.
  - The window uses the colour of the column that holds the card. Escape or a
    click outside closes the window.
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
  - Click the combination that is on the board again and Backlog and Now swap
    their colours. Accomplished keeps its green. A second click gives the order
    in the book again. The bars in the panel show the order that the board has.
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

Green is the colour of Accomplished, so a combination is here only if one of its
colours is a green. That green goes to Accomplished and stays there. Where a
combination holds more than one green, the deepest of them goes there.

The book holds 108 combinations of four colours. 24 of them are here, in eight
families. The rest are not, either because they hold no green, or because no
three of their colours stay apart at the strength the columns use, so two
columns would read as one.
