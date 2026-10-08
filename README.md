# Personal board

A personal board with four columns: Remember, Backlog, Now, Accomplished. The board is one HTML file. There is no build step, no dependency and no server. Open `index.html` in a browser. A `file://` address works.

![The board with cards in each column. A pinned card heads Remember, callouts sit in Remember and Backlog, three low cards wait at the foot of Backlog, a deck in Now holds three cards under its head with one done, and the cards show checklists, a nested list, a code chip, a fenced block, a link and a note count](doc/board.png)

## Use

- **+ add** at the top of a column writes a new card. Ctrl+Enter saves, Enter makes a new line, Escape cancels.
- **A double click** on a card opens it in its own window, ready to edit. That is the one way to edit it.
- **≡** on a card opens its menu: pin, turn into a board, attach a file, download, send by Gmail. The bin beside it deletes the card.
- **The sun** after the date of a card in Backlog says whether the card is normal or low: in the colour of the column on a normal card, in grey on a low one. A press turns it over. Low cards grey out and gather at the foot of the column.
- **Drag** moves a card within a column or to another column.
- **Decks** keep cards together under a head card. A drop on the middle of a card asks first, in a small menu. Before you let go, a ring goes round the card with the words **make a deck**. **Create deck** makes a deck. **Place above this card** and **Place below this card** put the dragged card there, and show only where pins and levels let it land. A drop near the edge of a card still moves the card, and shows a line. A deck folds to its head, and its done cards go to its foot, below a line that counts them and folds them away.
- **Boards** sit inside cards. **Turn into a board**, in the menu of a card, gives the card a board of its own, with the same four columns. The **board** tab on the card steps into that board, and the names in the heading step back out. The top board is the **Mother Board**. Boards nest to any depth, and everything on the page acts on the board you are in. A card that holds a board takes no part in a deck.
- **Notes** hang off a card and open in a window of their own.
- **Files** go on a card or a note. Drop a file on it from your desktop, or use **Attach a file** in the menu of a card or the clip on a note. A file shows as a chip with its name and size. A click opens or downloads it, and the cross removes it. Files travel with Export and Import.
- Card text reads inline code, fenced blocks, links, headings, quotes, callouts, nested lists, checkboxes and dividers.
- **Palette** changes the colours of Backlog, Now and Accomplished on the board you are in, so each board keeps its own. The colours come from Sanzo Wada's *A Dictionary of Color Combinations*.
- **Export** writes the board you are in, with every board inside it. It offers two ways out: download the board as JSON, or send it by Gmail, which downloads the same file and opens a new message for you to drag the file onto. A card's own menu does the same for one card, with the card's first line and id in the subject. **Import** reads a whole board, which replaces the board you are in, or a single card, which joins it.
- **tips**, in the header, shows what the board does and what it reads.

The board is in `localStorage`, under `personal.board.v2`. The files on its cards are in the IndexedDB database `personal.files.v1` of the browser. Export moves both to another machine.

[doc/behaviour.md](doc/behaviour.md) has the rest.

## Build mark

Under the board is the short hash of the commit this copy of the page came from. The hooks in `hooks/` write it. Turn them on when you clone:

```bash
git clone -c core.hooksPath=hooks https://github.com/li9i/personal-board
```

In a clone that already exists, `git config core.hooksPath hooks` turns them on, and the mark appears after the next commit, merge or checkout. [doc/behaviour.md](doc/behaviour.md#build-mark) has the rest.

## Tests

The tests are in `test/`. Run them from the root of the repository:

```bash
node --test
```

They open the page in headless Google Chrome, the `google-chrome` command, with a profile of their own. They delete the profile afterwards, so they do not touch the board in your own browser. You need Node and Google Chrome. There is no package to install, and the tests download nothing. They were run with Node 22.

The first test checks that a save keeps the parts of a board that the page does not know. The second checks that the first load moves the board from `personal.board.v1` to `personal.board.v2` and leaves a sign in the old key. The third checks that a board card shows only its name and a count such as `3 of 9 done`, that its tab steps into the board, and that a double click on its name opens the card to edit. The fourth checks that a name in backticks shows as code on its board card and in the heading. The fifth checks that a drop on the middle of a card shows all three buttons, and that each one does what it says. It also checks that Escape leaves the card where it was. The sixth checks that a drop on the head of a deck adds the card to the top of the deck and does not ask. The seventh checks that the two Place buttons show only where pins and levels let the card land directly above or below. The eighth checks that a file dropped on a card or a note shows as a chip with its name and size, and that a board card shows its files only in its notes window. The ninth checks that **Attach a file** in the menu of a card, and the clip on a note, attach a file from the file picker. The tenth checks that a click on a chip opens plain text in a new tab and downloads other files under their own names, and that the cross removes a file and Undo brings it back. The eleventh exports a board and a single card with files, imports each one into a browser that has no files, and opens a file there. [doc/behaviour.md](doc/behaviour.md#storage) has the rest.

## Disclaimer

`personal-board` was created by li9i and coded by Claude. What a time to be alive.
