# Personal board

A personal board with four columns: Remember, Backlog, Now, Accomplished. The board is one HTML file. There is no build step, no dependency and no server. Open `index.html` in a browser. A `file://` address works.

![The board with cards in each column. A pinned card heads Remember, callouts sit in Remember and Backlog, three low cards wait at the foot of Backlog, and the cards show checklists, a code chip, a fenced block, a link and a note count](doc/board.png)

## Use

- **+ add** at the top of a column writes a new card. Ctrl+Enter saves, Enter makes a new line, Escape cancels.
- **A double click** on a card opens its text in a box. That is the one way to edit it.
- **≡** on a card opens its menu: pin, download, send by Gmail. The bin beside it deletes the card.
- **The mark** before the date of a card in Backlog says whether the card is normal or low: a plain ring on a normal card, the same ring with spokes around it on a low one. A press turns it over. Low cards grey out and gather at the foot of the column.
- **Drag** moves a card within a column or to another column.
- **Notes** hang off a card and open in a window of their own.
- Card text reads inline code, fenced blocks, links, headings, quotes, callouts, lists, checkboxes and dividers.
- **Palette** changes the colours of Backlog, Now and Accomplished. They come from Sanzo Wada's *A Dictionary of Color Combinations*.
- **Export** offers two ways out: download the board as JSON, or send it by Gmail, which downloads the same file and opens a new message for you to drag the file onto. A card's own menu does the same for one card, with the card's first line and id in the subject. **Import** reads a whole board or a single card.
- **tips**, in the header, shows what the board does and what it reads.

The board is in `localStorage`, under `personal.board.v1`. Export moves it to another machine.

[doc/behaviour.md](doc/behaviour.md) has the rest.

## Build mark

Under the board is the short hash of the commit this copy of the page came from. It lives in `build.js`, which the hooks in `hooks/` write after a commit, a merge, a pull, a rebase, an amend and a checkout. `build.js` is not in the repository. A commit cannot hold its own hash, so a copy kept there would name the wrong commit for ever, and every commit would leave the page changed in the working tree. `.gitignore` keeps it out.

A copy of the page without it shows a plain link to the repository instead, which holds whatever the copy is. `index.html` on its own is still the whole board.

A fresh clone has to be told where the hooks live:

```bash
git config core.hooksPath hooks
```

To have the mark written by the clone itself, turn the hooks on before the files are written:

```bash
git clone -c core.hooksPath=hooks https://github.com/li9i/personal-board
```

## Disclaimer

`personal-board` was created by li9i and coded by Claude. What a time to be alive.
