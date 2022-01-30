# word-count

> Word count processor

See [Ts.ED](https://tsed.io) project for more information.

## Build setup

> **Important!** Ts.ED requires Node >= 10, Express >= 4 and TypeScript >= 3.

```batch
# install dependencies
$ npm install

# serve
$ npm run start

# build for production
$ npm run build
$ npm run start:prod
```

## How it works

The multipart form data is piped in chunks as it arrives right into the word processor. This way we prevent storing huge
files in disc or consuming very large amount of memory.

The word processor updates a dictionary with every word and its number of occurrences for every chunk that is processed.
When the upload stream is complete, the dictionary is sorted using a binary tree.

The top N occurrences are then obtained by level traversing the tree up until the specified limit.

## Notes

In the case of multiple words with the same count above the N limit, the API will discard the occurrences past that
number.