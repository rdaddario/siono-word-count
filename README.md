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
##Notes

In the case of multiple words with the same count above the N limit, the API will discard the occurrences past that number.