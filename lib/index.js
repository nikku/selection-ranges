'use strict';

/**
 * Module Dependencies
 */

import iterator from 'dom-iterator';

var selection = window.getSelection();


/**
 * Add selection / insert cursor.
 *
 * @param {Range} range
 */
export function applyRange(range) {
  selection.removeAllRanges();
  selection.addRange(range);
}


/**
 * Get current document selection.
 *
 * @return {Selection}
 */
export function getWindowSelection() {
  return selection;
}


/**
 * Return true if element is part of window selection.
 *
 * @param  {Element}  el
 * @return {Boolean}
 */
export function isSelected(el) {

  if (!selection.rangeCount) {
    return null;
  }

  var focusNode = selection.focusNode;

  // IE supports Node#contains for elements only
  // thus we ensure we check against an actual Element node
  if (isText(focusNode)) {
    focusNode = focusNode.parentNode;
  }

  return el == focusNode || el.contains(focusNode);
}


/**
 * Set cursor or selection position.
 *
 * @param {Element} el
 * @param {SelectionRange} selection
 */
export function setRange(el, selection) {

  var range = createRange(el, selection);

  applyRange(range);
}


/**
 * Get cursor or selection position.
 *
 * @param {Element} el
 */
export function getRange(el) {

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
  var last;

  var isClosing = false;

  var selectionStart;
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
      if (
        isBr(next) || (
          last && (last.nextSibling == next) && (
            isDiv(next) ||
            isParagraph(next)
          )
        )
      ) {
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

    last = next;
    next = i.next();
    isClosing = i.closingTag;
  }

  // selection until end of text
  return {
    start: typeof selectionStart === 'undefined' ? count : selectionStart,
    end: count
  };
}


/**
 * Annotate the given text with markers based on the
 * given range.
 *
 * @param {String} text
 * @param {SelectionRange} range
 *
 * @return {String} annotated text
 */
export function annotateRange(text, range) {
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
      if (
        isBr(next) || (
          next.previousSibling && (
            isDiv(next) ||
            isParagraph(next)
          )
        )
      ) {
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
    if (el.lastChild) {
      range.setStartAfter(el.lastChild);
    } else {
      range.setStart(el, 0);
    }
  }

  if (el.lastChild) {
    range.setEndAfter(el.lastChild);
  } else {
    range.setEnd(el, 0);
  }

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