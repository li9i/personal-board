# Behaviour

The full behaviour of the board. The README keeps the short version.

## Cards

**+ add** at the top of a column writes a new card, above the rest of the stack. Enter saves the card. Shift+Enter makes a new line. Escape cancels.

**burst**, at the end of the row inside the box, decides what a saved card leaves behind. Off, the box closes once the card is in. On, it stays open and empty, ready for the next one. The switch is in the box, so it is there only while you are adding. One setting serves every box on the page, including the one for notes, and the board remembers it. It starts off.

**≡** on a card opens the menu. The menu holds **Pin to top**, **Export this card** and **Delete**. A card in Backlog also holds **Sweep under the carpet**. A note has the same button, with **Delete note**. Escape or a click outside closes the menu.

**A double click** on a card opens its text in a box. This is the one way to write the text, and a checkbox is the one thing that a single click changes. The same keys apply. A single click does nothing else, and a double click on a link or a button does what that link or button does. A note behaves in the same way.

**Drag** moves a card within a column or to another column.

**Delete** removes a card from the board. **Delete note** removes a note from a card. Neither asks first. **clear column** empties Accomplished and asks first. All three show a toast with an **Undo**.

## What the card text reads

**Backticks** mark inline code. `` `npm test` `` shows as a monospace chip. The card keeps the backticks, so you see them again when you edit the card. A chip must hold text and stay on one line. A single backtick therefore stays a backtick.

**Links**: the board finds links in the text of a card. Two shapes work: a bare `https://...` and `[what it is](https://...)`. The second shape is for an address that is too long to read on a card. It shows the words and keeps the address behind them. A `mailto:` address is also a link. A link opens in a new tab.

Nothing else is a link. A `javascript:` address is not a link. An address inside backticks is code, not a link. The card keeps the text you typed, so you see it again when you edit the card.

**Markdown**: the board reads some of the Markdown marks. A mark must hold text and stay on one line. The card keeps the marks you typed, so you see them again when you edit the card.

- Inside a line, `**bold**`, `*italic*` and `~~struck through~~` mark the words between them. Bold and italic need asterisks. The board does not read the underscore as a mark, so a name such as `max_speed` stays as it is.
- At the head of a line, `#` to `######` make a heading, `>` makes a quote, and `-`, `*` or `+` make a list. `1.` or `1)` makes a numbered list, which counts from the first number you write. Three or more of `-`, `*` or `_` alone on a line make a divider across the card.
- A blank line closes a paragraph, a quote or a list. The board reads no other Markdown. There are no tables and no images.

**Callouts**: a quote whose first line is a noun in brackets is a callout. `> [!warning]` opens one, and the lines below it are its text. The head takes the mark and the colour of the noun. Words after the noun on that line become the head instead, so `> [!question] Do we keep the fourth column?` names itself. A word the board does not know is not a callout, and those lines stay the quote that they were.

The nouns are the ones Obsidian has: `note`, `abstract` (`summary`, `tldr`), `info`, `todo`, `tip` (`hint`, `important`), `success` (`check`, `done`), `question` (`help`, `faq`), `warning` (`attention`), `failure` (`fail`, `missing`), `danger` (`caution`, `error`), `bug`, `example` and `quote` (`cite`). A noun in brackets reads in any case. Obsidian reads `caution` as a warning. Here it is a danger, in red.

The text of a callout is card text, so it takes lists, boxes, fences and a heading. Only the first line of a quote can name a callout. The board does not fold a callout, so a `+` or a `-` after the brackets is read and dropped.

**Checkboxes**: at the head of a bulleted item, `- [ ]` makes an open box and `- [x]` a box that is done. A click on a box turns it over and writes the change into the text of the card. So the state of a box is text, and it travels with Export and Import as the rest of the card does.

- Only a space or a lower case `x` goes between the brackets, and a space follows them. So `- [X] read` and `- [-] read` are items with the characters that you typed. A numbered item takes no box.
- An item with a box carries no bullet. The box stands where the bullet would be, so one list holds both kinds of item and the words after them line up.
- A note takes boxes too. The head of the notes window shows the text of its card, and a box there is the same box as the one on the card.

**Fences** mark a block of code. Three or more backticks alone on a line open the block, and a line of at least as many backticks closes it. The lines between them show as you typed them, in one monospace box. The board reads no mark inside a block, so a `#` or an address there stays as plain characters.

A blank line inside a block closes nothing. A word after the opening fence names a language. The board reads no language and deletes the word. A fence that the card never closes is not a fence. Its backticks stay backticks, and the board reads the lines below it in the usual way.

## Notes

**Notes** open in a small window in the middle of the page. The words next to the date of a card open that window. A card with notes gives their count there. A card with no notes shows **add note** while the pointer is on the card. A click there opens the window, with the box for the first note. Notes are cards themselves. The same editing, backticks, links and dates apply to them, and a drag reorders them. They have a menu of their own, with a delete and an Undo.

The window uses the colour of the column that holds the card. Escape or a click outside closes the window.

## Pins

**Pin to top** holds a card at the head of its column. A pinned card shows a pin next to its date, and its menu offers **Unpin**. A card that is not pinned cannot pass a pinned one, so a drag stops at that line and so does the line that shows where the card lands. A new pin goes to the foot of the pinned cards. Taking a pin off puts the card at the head of the rest. Every column takes pins. A note takes none.

## The carpet

**Sweep under the carpet** is the far end of the pin, and only Backlog has one. Backlog fills faster than it empties and not everything in it is next, so the carpet is where the rest of it waits. The swept cards sit under a band in the footer of the column. The band names them, counts them, and a press lifts it. Backlog remembers whether its carpet is up, so it opens where you left it.

- A swept card shows the mark of the carpet next to its date, and its menu offers **Bring back to backlog**. It is drawn flat, on the colour of the column, to say that it is put away and not that it is gone.
- A sweep sends a card to the head of the cards under the carpet, and taking it back out puts it at the foot of the ones above. A drag says the same thing: drop a card on the carpet and it goes under, drag one out and it comes back. A card cannot be pinned and swept at once, so a sweep takes the pin off and a pin brings the card back out.
- A swept card dragged to another column arrives as an ordinary card, because no other column has a carpet.
- The count at the head of Backlog reads **5+3**: five cards above the carpet and three under it. The line of counts below the header reads the same way. With nothing swept, there is no band and one number.

## Export and Import

**Export** downloads the whole board as JSON. **Import** reads a board or a single card.

**Export this card** writes one card to a file, with its notes. The file passes the card to someone else. Import adds the card to the board and does not change the other cards. The card goes to the column that it was in. If this board has no such column, the card goes to Backlog. The card arrives as a new card. If you import the same file twice, you get two cards.

Export and Import use two shapes. A whole board is `{"cols": ...}` and replaces the board that is here. One card is `{"card": ..., "col": ...}` and joins the board. Import reads the fields in the file to find which of the two shapes it is.

## Storage

The board is in `localStorage`, in the key `personal.board.v1`. The palette is in the key `personal.palette.v1`. The two keys belong to one browser on one machine. Export moves a board to another machine. Two tabs on the same board stay in sync.

The board keeps the notes of a card on the card, so a card is whole on its own. Notes travel with Export and Import. A delete removes the notes of the card too. Undo returns the card and the notes. A board saved before notes existed opens with no notes.

A pin is on the card too, so it travels with Export and Import as the notes do. A board saved before pins existed opens with none.

The carpet is on the card in the same way, and travels with it. A board saved before the carpet existed opens with nothing swept. A card that arrives both pinned and swept keeps the pin, and a card that arrives swept in a column with no carpet arrives as an ordinary card.

The page also reads two older keys, `todo.board.v1` and `backlog.board.v1`. At the first load, the page moves a board from an older key to the new key, and then deletes the older key. Import also reads older JSON exports.

The Remember column was called Waiting for and was stored under `waiting`. A board saved under that name opens with those cards in Remember.

## Palette

**Palette** changes the colours of Backlog, Now and Accomplished. You select a family, then a combination from that family. The panel stays open while you try the combinations. A click outside or Escape closes the panel.

Click the combination that is on the board again and Backlog and Now swap their colours. Accomplished keeps its green. A second click gives the order in the book again. The bars in the panel show the order that the board has.

The colour combinations come from Sanzo Wada's *A Dictionary of Color Combinations*. The board groups the combinations into families by their main colour, and keeps three colours from each combination. Backlog, Now and Accomplished get one colour each. The palette gives no colour to Remember.

Green is the colour of Accomplished, so a combination is here only if one of its colours is a green. That green goes to Accomplished and stays there. Where a combination holds more than one green, the deepest of them goes there.

The book holds 108 combinations of four colours. 24 of them are here, in eight families. The rest are not, either because they hold no green, or because no three of their colours stay apart at the strength the columns use, so two columns would read as one.

## The Remember column

**Remember** holds what you must keep in mind: a card that someone else has to move, and a note to yourself that is not work at all. A hairline separates this column from the other three. No palette gives this column a colour. It uses the page background. Its cards are white and its text is grey.

## tips

**tips**, the last hint in the header, opens a window with what the board does and what it reads. It holds two sections so far. The callouts come first: every noun, the mark it draws and the colour it takes, with the nouns that share a colour on one bar. Burst comes below a short rule: the switch as the add box shows it, off and on, next to what each state leaves behind. The window takes no colour from the palette, because tips belong to the board and not to a column. Escape or a click outside closes it.

## Build mark

Under the board, on the right, is the short hash of the commit this copy of the page came from. It links to that commit on GitHub. The page ships with a plain link to the repository in its place, and `build.js` puts the hash there once it is written.

The hooks in `hooks/` write `build.js` after the fact, because a commit cannot hold its own hash. It is not in the repository. A copy kept there could only ever name the commit before the one you are reading, and it would leave the page changed in the working tree after every commit. `.gitignore` keeps it out, so the tree stays clean.

All the hooks run the same script, `hooks/write-build-mark`, which reads HEAD and writes `build.js`. `post-commit` covers a commit, `post-merge` a merge and so a pull that merges, `post-rewrite` a rebase and an amend, and `post-checkout` a clone, a checkout and a switch. Nothing has to stand aside any more. The file the hooks touch is not one git is watching, so writing it in the middle of a rebase or a checkout of single files disturbs neither.

The page loads `build.js` with a plain script tag. It cannot be a module. A module is fetched under the rules for cross origin requests, which a browser refuses on a `file://` address, and that is how the page is usually opened.

A clone can only write the mark if the hooks are already on when the working tree is written, which means `git clone -c core.hooksPath=hooks`. A plain clone shows the link to the repository until the next commit, merge or checkout.
