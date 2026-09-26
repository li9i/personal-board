# Personal board

A personal board with four columns: Remember, Backlog, Now, Accomplished. The board is one HTML file. There is no build step, no dependency and no server. Open `index.html` in a browser. A `file://` address works.

![The board with cards in each column. A pinned card heads Remember, callouts sit in Remember and Backlog, three low cards wait at the foot of Backlog, a deck in Now holds three cards under its head with one done, and the cards show checklists, a nested list, a code chip, a fenced block, a link and a note count](doc/board.png)

## Use

- **+ add** at the top of a column writes a new card. Ctrl+Enter saves, Enter makes a new line, Escape cancels.
- **A double click** on a card opens it in its own window, ready to edit. That is the one way to edit it.
- **≡** on a card opens its menu: pin, download, send by Gmail. The bin beside it deletes the card.
- **The sun** after the date of a card in Backlog says whether the card is normal or low: in the colour of the column on a normal card, in grey on a low one. A press turns it over. Low cards grey out and gather at the foot of the column.
- **Drag** moves a card within a column or to another column.
- **Decks** keep cards together under a head card. A drop on the middle of a card makes one: before you let go, a ring goes round the card with the words **make a deck**. A drop near the edge of a card still moves the card, and shows a line. A deck folds to its head, and its done cards go to its foot, below a line that counts them.
- **Notes** hang off a card and open in a window of their own.
- Card text reads inline code, fenced blocks, links, headings, quotes, callouts, nested lists, checkboxes and dividers.
- **Palette** changes the colours of Backlog, Now and Accomplished. They come from Sanzo Wada's *A Dictionary of Color Combinations*.
- **Export** offers two ways out: download the board as JSON, or send it by Gmail, which downloads the same file and opens a new message for you to drag the file onto. A card's own menu does the same for one card, with the card's first line and id in the subject. **Import** reads a whole board or a single card.
- **tips**, in the header, shows what the board does and what it reads.

The board is in `localStorage`, under `personal.board.v1`. Export moves it to another machine.

[doc/behaviour.md](doc/behaviour.md) has the rest.

## Build mark

Under the board is the short hash of the commit this copy of the page came from. The hooks in `hooks/` write it. Turn them on when you clone:

```bash
git clone -c core.hooksPath=hooks https://github.com/li9i/personal-board
```

In a clone that already exists, `git config core.hooksPath hooks` turns them on, and the mark appears after the next commit, merge or checkout. [doc/behaviour.md](doc/behaviour.md#build-mark) has the rest.

## Disclaimer

`personal-board` was created by li9i and coded by Claude. What a time to be alive.
