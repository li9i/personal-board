# Personal board

A personal board with four columns: Remember, Backlog, Now, Accomplished. The board is one HTML file. There is no build step, no dependency and no server. Open `index.html` in a browser. A `file://` address works.

![The board with cards in each column. A pinned card heads Remember, callouts sit in Remember and Backlog, three cards wait under the carpet at the foot of Backlog, and the cards show checklists, a code chip, a fenced block, a link and a note count](doc/board.png)

## Use

- **+ add** at the top of a column writes a new card. Enter saves, Shift+Enter makes a new line, Escape cancels.
- **A double click** on a card opens its text in a box. That is the one way to edit it.
- **≡** on a card opens its menu: pin, export, delete, and in Backlog, sweep under the carpet.
- **Drag** moves a card within a column or to another column.
- **Notes** hang off a card and open in a window of their own.
- Card text reads inline code, fenced blocks, links, headings, quotes, callouts, lists, checkboxes and dividers.
- **Palette** changes the colours of Backlog, Now and Accomplished. They come from Sanzo Wada's *A Dictionary of Color Combinations*.
- **Export** downloads the board as JSON. **Import** reads a whole board or a single card.
- **tips**, in the header, shows what the board does and what it reads.

The board is in `localStorage`, under `personal.board.v1`. Export moves it to another machine.

[doc/behaviour.md](doc/behaviour.md) has the rest.

## Build mark

Under the board is the short hash of the commit this copy of the page came from. `hooks/post-commit` writes it. A fresh clone has to be told where the hook lives:

```bash
git config core.hooksPath hooks
```
