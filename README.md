A barebones to-do app for Linux. Edits a single text file that uses a subset of
Markdown syntax. Sync it to your phone by putting the file in Dropbox. Android
app coming soon.

To run:
```
$ git clone https://github.com/iafisher/todo-desktop.git
$ cd todo-desktop
$ npm install
$ export TODO_PATH=~/Dropbox/todo.txt  # or wherever else you want to keep it
$ npm start
```
