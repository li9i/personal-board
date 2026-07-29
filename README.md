# Todo board

A three-column todo board — Backlog, Now, Accomplished — in a single HTML file.
No build, no dependencies, no server: open `index.html` in a browser and it works.

![The board with a few cards in each column](doc/board.png)

## Use

Open `index.html` directly (`file://` is fine).

- **+ add** at the bottom of a column writes a new card. Enter saves, Shift+Enter
  makes a new line, Escape cancels.
- **Click a card** to edit its text; same keys apply.
- **Drag a card** to move it within a column or across to another one.
- **×** on a card deletes it. **clear column** empties Accomplished. Both raise a
  toast with an **Undo**.
- **Palette** swaps the column colours — pick a family, then a combination. The
  panel stays open while you try them, and closes on a click outside or Escape.
- **Export** downloads the board as JSON; **Import** reads one back in.

## Storage

The board lives in `localStorage` under `todo.board.v1`, the chosen palette under
`todo.palette.v1` — per browser, per machine. Export is the way to move a board
somewhere else. Two tabs on the same board stay in sync.

## Palettes

The colour combinations come from Sanzo Wada's *A Dictionary of Color
Combinations*, grouped into families by their lead colour and trimmed to three
colours each — one per column.
