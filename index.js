'use strict';

/**
 * Module Dependencies
 */

var iterator = require('dom-iterator');
var selection = window.getSelection();


/**
 * Add selection / insert cursor.
 *
 * @param {Range} range
 */
function applyRange(range) {
  selection.removeAllRanges();
  selection.addRange(range);
}

module.exports.applyRange = applyRange;


/**
 * Get current document selection.
 *
 * @return {Selection}
 */
function getWindowSelection() {
  return selection;
}

module.exports.getWindowSelection = getWindowSelection;


/**
 * Return true if element is part of window selection.
 *
 * @param  {Element}  el
 * @return {Boolean}
 */
function isSelected(el) {

  if (!selection.rangeCount) {
    return null;
  }

  var focusNode = selection.focusNode;

  return el == focusNode || el.contains(focusNode);
}

module.exports.isSelected = isSelected;


/**
 * Set cursor or selection position.
 *
 * @param {Element} el
 * @param {SelectionRange} selection
 */
function setRange(el, selection) {

  var range = createRange(el, selection);

  applyRange(range);
}

module.exports.setRange = setRange;


/**
 * Get cursor or selection position.
 *
 * @param {Element} el
 */
function getRange(el) {

  if (!isSelected(el)) {
    return null;
  }

  var range = selection.getRangeAt(0);

  var startContainer = range.startContainer;
  var endContainer = range.endContainer;
  var startOffset = range.startOffset;
  var endOffset = range.endOffset;

  var i = iterator(el.firstChild, el);

  var next = i.node;
  var isClosing = false;

  var selectionStart = 0;
  var count = 0;

  function isBeforeEnd(node, referenceNode) {

    if (arguments.length === 1) {
      referenceNode = node;
    }

    return (
      node.parentNode === endContainer &&
      referenceNode == endContainer.childNodes[endOffset]
    );

  }

  function isBeforeStart(node, referenceNode) {

    if (arguments.length === 1) {
      referenceNode = node;
    }

    return (
      node.parentNode === startContainer &&
      referenceNode == startContainer.childNodes[startOffset]
    );

  }

  while (next) {

    // start before node
    if (isBeforeStart(next)) {
      selectionStart = count;
    }

    // end before node
    if (isBeforeEnd(next)) {
      break;
    }

    if (!isClosing) {

      // <br />, </div>, </p> node
      if (isBr(next) || isDiv(next)) {
        count++;
      }
    }

    if (isClosing) {
      if (isParagraph(next)) {
        count++;
      }
    }

    if (isText(next)) {

      // #text node
      if (startContainer === next) {
        selectionStart = count + startOffset;
      }

      if (endContainer === next) {
        count += endOffset;
        break;
      }

      count += next.textContent.length;
    }

    if (isText(next) || isClosing) {

      // start before node
      if (isBeforeStart(next, next.nextSibling)) {
        selectionStart = count;
      }

      // end before node
      if (isBeforeEnd(next, next.nextSibling)) {
        break;
      }

    }

    next = i.next();
    isClosing = i.closingTag;
  }

  // selection until end of text
  return {
    start: selectionStart,
    end: count
  };
}

module.exports.getRange = getRange;


/**
 * Annotate the given text with markers based on the
 * given range.
 *
 * @param {String} text
 * @param {SelectionRange} range
 *
 * @return {String} annotated text
 */
function annotateRange(text, range) {
  var str;

  if (range.start === range.end) {
    str = (
      text.substring(0, range.start) +
      '|' +
      text.substring(range.start)
    );
  } else {
    str = (
      text.substring(0, range.start) +
      '<' +
      text.substring(range.start, range.end) +
      '>' +
      text.substring(range.end)
    );
  }

  return str;
}

module.exports.annotateRange = annotateRange;


//////// helpers ///////////////////////////

function createRange(el, selection) {

  var start = selection.start;
  var end = selection.end;

  var range = document.createRange();

  var i = iterator(el.firstChild, el);

  var next = i.node;
  var isClosing = false;

  var count = 0;
  var length;

  while (next) {

    if (count === start) {
      if (isClosing) {
        range.setStartAfter(next);
      } else {
        range.setStartBefore(next);
      }
    }

    if (count === end) {
      if (isClosing) {
        range.setEndAfter(next);
      } else {
        range.setEndBefore(next);
      }

      return range;
    }

    if (!isClosing) {
      if (isDiv(next) || isBr(next)) {
        count++;
      }
    }

    if (isClosing) {
      if (isParagraph(next)) {
        count++;
      }
    }

    if (isText(next)) {

      length = next.textContent.length;

      if (count <= start && count + length > start) {
        range.setStart(next, start - count);
      }

      if (count + length > end) {
        range.setEnd(next, end - count);

        return range;
      }

      count += length;
    }

    next = i.next();
    isClosing = i.closingTag;
  }

  // out of range
  if (count <= start) {
    range.setStartAfter(el.lastChild);
  }

  range.setEndAfter(el.lastChild);

  return range;
}

function isText(node) {
  return node.nodeType === 3;
}

function isBr(node) {
  return (
    node.nodeType === 1 &&
    node.nodeName === 'BR'
  );
}

function isDiv(node) {
  return (
    node.nodeType === 1 &&
    node.nodeName === 'DIV'
  );
}

function isParagraph(node) {
  return (
    node.nodeType === 1 &&
    node.nodeName === 'P'
  );
}