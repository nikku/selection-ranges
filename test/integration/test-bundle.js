/* global SelectionRanges */

describe('selection-ranges', function() {

  it('should export SelectionRanges global', function() {
    expect(SelectionRanges).to.exist;
  });


  it('should expose API', function() {

    expect(SelectionRanges.getRange).to.exist;
    expect(SelectionRanges.setRange).to.exist;
    expect(SelectionRanges.applyRange).to.exist;
    expect(SelectionRanges.getWindowSelection).to.exist;

  });


  describe('should set range', function() {

    var node;

    beforeEach(function() {
      node = document.createElement('div');

      node.setAttribute('contenteditable', 'true');

      document.body.appendChild(node);
    });


    afterEach(function() {
      document.body.removeChild(node);

      window.getSelection().removeAllRanges();
    });


    it('cross container', function() {

      // given
      node.innerHTML = 'FOO<div><br>aaaa</div><div><br>bb</div>';

      // when
      SelectionRanges.setRange(node, {
        start: 2,
        end: 11
      });

      // when
      expect(SelectionRanges.getRange(node)).to.eql({
        start: 2,
        end: 11
      });
    });

  });

});