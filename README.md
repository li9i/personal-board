# Personal board

A four-column personal board — Waiting for, Backlog, Now, Accomplished — in a
single HTML file. No build, no dependencies, no server: open `index.html` in a
browser and it works.

**Waiting for** holds what is blocked on someone else. It is set slightly apart
from the other three by a hairline, and stays white whatever palette is chosen.

![The board with a few cards in each column](doc/board.png)

## Use

Open `index.html` directly (`file://` is fine).

- **+ add** at the bottom of a column writes a new card. Enter saves, Shift+Enter
  makes a new line, Escape cancels.
- **Click a card** to edit its text; same keys apply.
- **Backticks** mark inline code: `` `npm test` `` shows as a monospace chip. The
  card keeps the backticks, so they are there again when you edit it. A span has
  to hold something and stay on one line, so a stray backtick is just a backtick.
- **≡** on a card opens its notes, in a small window in the middle of the page.
  Notes are cards themselves: the same editing, backticks, dates, dragging to
  reorder and **×** to delete with an Undo. The window takes the colour of the
  column the card sits in. A card that holds notes says so next to its date.
  Escape or a click outside closes the window.
- **Drag a card** to move it within a column or across to another one.
- **×** on a card deletes it. **clear column** empties Accomplished. Both raise a
  toast with an **Undo**.
- **Palette** swaps the colours of Backlog, Now and Accomplished — pick a family,
  then a combination. The panel stays open while you try them, and closes on a
  click outside or Escape.
- **Export** downloads the board as JSON; **Import** reads one back in.

## Storage

A card's notes are kept on the card, so they travel with Export and Import,
deleting a card takes its notes with it, and Undo brings the lot back. A board
saved before notes existed opens with none.

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
