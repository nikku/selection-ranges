# Changelog

All notable changes to [selection-ranges](https://github.com/nikku/selection-ranges) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 3.0.3

* `CHORE`: package `LICENSE` file

## 3.0.2

_Republish of `v3.0.1` with update changelog._

## 3.0.1

* `FIX`: make `babel` a development dependency ([#1](https://github.com/nikku/selection-ranges/issues/1))

## 3.0.0

### Breaking Changes

* `FIX`: remove browser field again; it confuses modern module bundlers. This partially reverts `v2.1.0`

## 2.1.0

* `CHORE`: add `browser` field

## 2.0.0

* `CHORE`: migrate to ES6
* `FEAT`: provide pre-built distribution in dist folder (UMD export name is `SelectionRanges`)

## 1.2.3

* `FIX`: correctly set range on empty node

## 1.2.2

* `FIX`: correctly set range post paragraphs (IE 11)

## 1.2.1

* `FIX`: ensure `isSelected(el)` supports IE 11

## 1.2.0

* `FEAT`: support MS Edge style `div` containers

## 1.1.0

* `FEAT`: add `isSelected(el)` util

## 1.0.1

* `CHORE`: ignore development assets
* `CHORE`: add `CHANGELOG.md`

## 1.0.0

* initial implementation