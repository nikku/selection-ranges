# selection-ranges

[![Build Status](https://travis-ci.org/nikku/selection-ranges.svg?branch=master)](https://travis-ci.org/nikku/selection-ranges)

Manipulate selection ranges on contenteditable elements.


## API

```javascript
/**
 * Return the selection on the given element as {start, end}.
 *
 * @param {Element} el
 *
 * @return {Object} selection range or null if element is not selected
 */
getRange(el);
```

```javascript
/**
 * Selects the given range on the specified element.
 *
 * @param {Element} el
 * @param {Object} range {start, end}
 */
setRange(el, range);
```

```javascript
/**
 * Return true if element is part of window selection.
 *
 * @param  {Element}  el
 * @return {Boolean}
 */
isSelected(el);
```


## Usage

```javascript
import {
  getRange,
  setRange
} from 'selection-ranges';


var node = <div contenteditable />;

let range = getRange(node);
// a range such as { start: 5, end: 10 }
// or null if node is currently not selected

setRange(node, { start: 0, end: 30 });
// sets selection range to child nodes; does not focus node
```


## Features

* Works around [browser issues](https://stackoverflow.com/questions/13949059/persisting-the-changes-of-range-objects-after-selection-in-html/13950376) and correctly handles `<br/>` and paragraph elements
* Correctly handles out-of-bounds selections


## Related

* [selection-update](https://github.com/nikku/selection-update) - compute input selection updates on external content changes


## License

MIT