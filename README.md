# Personal board

A four-column personal board — Waiting for, Backlog, Now, Accomplished — in a
single HTML file. No build, no dependencies, no server: open `index.html` in a
browser and it works.

**Waiting for** holds what is blocked on someone else. It is set slightly apart
from the other three by a hairline, and stays uncoloured whatever palette is
chosen: the page's own background, with white cards and grey text on it.

![The board with a few cards in each column](doc/board.png)

## Use

Open `index.html` directly (`file://` is fine).

- **+ add** at the bottom of a column writes a new card. Enter saves, Shift+Enter
  makes a new line, Escape cancels.
- **Click a card** to edit its text; same keys apply.
- **≡** on a card opens the rest of what can be done with it, as a list of words:
  **edit**, **notes**, **export this card**, **delete**. A note carries the same
  button, holding **edit** and **delete note**. Escape or a click outside closes
  the list.
- **Backticks** mark inline code: `` `npm test` `` shows as a monospace chip. The
  card keeps the backticks, so they are there again when you edit it. A span has
  to hold something and stay on one line, so a stray backtick is just a backtick.
- **Links** are picked out of what a card says, in either of two shapes: a bare
  `https://…`, or `[what it is](https://…)` for an address too long to read on a
  card, which shows the words and keeps the address behind them. `mailto:` counts
  as well. Nothing else does — a `javascript:` is not a link here, and neither is
  an address inside backticks, which is code. The card keeps what was typed, so
  it is there again when you edit it. A link opens in a new tab, and a click on
  one follows it rather than opening the card for editing — so when a link is all
  a card says, **edit** in its list is the way in.
- **notes** opens the card's notes, in a small window in the middle of the page.
  Notes are cards themselves: the same editing, backticks, links, dates, dragging
  to reorder and a list of their own to delete from, with an Undo. The window
  takes the colour of the column the card sits in. A card that holds notes says
  so next to its date. Escape or a click outside closes the window.
- **Drag a card** to move it within a column or across to another one.
- **delete** takes a card off the board. **clear column** empties Accomplished.
  Both raise a toast with an **Undo**.
- **export this card** writes that one card to a file, notes and all, to pass to
  someone else. Import puts it on the board without touching what is already
  there, in the column it was sent from, or in Backlog if this board has no such
  column. It arrives as a new card, so the same file imported twice gives two.
- **Palette** swaps the colours of Backlog, Now and Accomplished — pick a family,
  then a combination. The panel stays open while you try them, and closes on a
  click outside or Escape.
- **Export** downloads the whole board as JSON; **Import** reads back either a
  board or a single card.

## Storage

A card's notes are kept on the card, so a card is whole on its own: notes travel
with Export and Import, deleting a card takes its notes with it, and Undo brings
the lot back. A board saved before notes existed opens with none.

Two shapes leave the board and come back. A whole board is `{"cols": ...}` and
replaces what is here. One card is `{"card": ..., "col": ...}` and joins it.
Import is given a file and tells the two apart by which of the fields it carries.

The board lives in `localStorage` under `personal.board.v1`, the chosen palette
under `personal.palette.v1` — per browser, per machine. Export is the way to move
a board somewhere else. Two tabs on the same board stay in sync.

A board saved under either older key — `todo.board.v1` or `backlog.board.v1` —
is carried over to the new one the first time the page loads, and the old key is
dropped. Older JSON exports still import.

## Palettes

The colour combinations come from Sanzo Wada's *A Dictionary of Color
Combinations*, grouped into families by their lead colour and trimmed to three
colours each — one each for Backlog, Now and Accomplished. Waiting for takes no
palette colour.
