import {
  getRange,
  setRange,
  isSelected,
  applyRange,
  getWindowSelection
} from 'selection-ranges';


describe('selection-ranges', function() {

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


  describe('getWindowSelection', function() {

    it('should expose window selection', function() {
      expect(getWindowSelection()).to.equal(window.getSelection());
    });

  });


  describe('applyRange', function() {

    it('should set selection range', function() {

      // given
      node.innerHTML = 'FOO<br>bar<br>';

      var range = document.createRange();
      range.setStart(node.childNodes[0], 1);
      range.setEndAfter(node.childNodes[1]);

      // when
      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 1,
        end: 4
      });
    });

  });


  describe('isSelected', function() {

    it('should return selection state', function() {

      // given
      node.innerHTML = (
        '<div class="outer">' +
          '<div class="a">' +
            '<p>AAABB</p>' +
          '</div>' +
          '<div class="b">bar</div>' +
        '</div>'
      );

      var range = document.createRange();
      range.setStartBefore(node.querySelector('.a p'));
      range.setEndAfter(node.querySelector('.a p'));

      // when
      applyRange(range);

      // then
      expect(isSelected(node.querySelector('.a'))).to.be.true;
      expect(isSelected(node)).to.be.true;

      expect(isSelected(node.querySelector('.b'))).to.be.false;
    });

  });


  describe('getRange', function() {

    it('full range', function() {

      // given
      node.innerHTML = 'FOOaaaa';

      var range = document.createRange();
      range.setStartBefore(node.childNodes[0]);
      range.setEndAfter(node.childNodes[0]);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 0,
        end: 7
      });
    });


    it('in text', function() {

      // given
      node.innerHTML = 'FOOaaaa';

      var range = document.createRange();
      range.setStart(node.childNodes[0], 4);
      range.setEnd(node.childNodes[0], 6);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 4,
        end: 6
      });
    });


    it('cross line-break', function() {

      // given
      node.innerHTML = 'FOO<br>aaaa<br>';

      var range = document.createRange();
      range.setStart(node.childNodes[0], 2);
      range.setEnd(node.childNodes[2], 3);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 2,
        end: 7
      });
    });


    it('cross container', function() {

      // given
      node.innerHTML = 'FOO<div><br>aaaa</div><div class="ref"><br>bb</div>';

      var range = document.createRange();
      range.setStart(node.childNodes[0], 2);
      range.setEndAfter(node.querySelector('.ref br'));

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 2,
        end: 11
      });
    });


    it('cross paragraphs', function() {

      // given
      node.innerHTML = '<p>FOO</p><p class="ref">aaaa</p>';

      var range = document.createRange();
      range.setStart(node.childNodes[0].childNodes[0], 2);
      range.setEnd(node.querySelector('.ref').childNodes[0], 3);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 2,
        end: 7
      });
    });


    it('in paragraph / at <br/>', function() {

      // given
      node.innerHTML = '<p>AA</p><p><br/></p>';

      var range = document.createRange();
      range.setStart(node.childNodes[1], 0);
      range.setEnd(node.childNodes[1], 0);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 3,
        end: 3
      });
    });


    it('in paragraph / at end', function() {

      // given
      node.innerHTML = '<p>AA</p><p></p>';

      var range = document.createRange();
      range.setStart(node.childNodes[1], 0);
      range.setEnd(node.childNodes[1], 0);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 3,
        end: 3
      });
    });


    it('behind paragraph / at end', function() {

      // given
      node.innerHTML = '<p>AA</p><p></p>';

      var range = document.createRange();
      range.setStartAfter(node.childNodes[1]);
      range.setEndAfter(node.childNodes[1], 0);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 3,
        end: 3
      });
    });


    it('cross divs / MS Edge style', function() {

      // given
      node.innerHTML = '<div>FOO</div><div class="ref">aaaa</div>';

      var range = document.createRange();
      range.setStart(node.childNodes[0].childNodes[0], 2);
      range.setEnd(node.querySelector('.ref').childNodes[0], 3);

      applyRange(range);

      // then
      expect(getRange(node)).to.eql({
        start: 2,
        end: 7
      });
    });


    describe('caret', function() {

      it('in text / at start', function() {

        // given
        node.innerHTML = 'FOOaaaa';

        var range = document.createRange();
        range.setStartBefore(node.childNodes[0]);
        range.setEndBefore(node.childNodes[0]);

        applyRange(range);

        // then
        expect(getRange(node)).to.eql({
          start: 0,
          end: 0
        });
      });


      it('in text / at end', function() {

        // given
        node.innerHTML = 'FOOaaaa';

        var range = document.createRange();
        range.setStartAfter(node.childNodes[0]);
        range.setEndAfter(node.childNodes[0]);

        applyRange(range);

        // then
        expect(getRange(node)).to.eql({
          start: 7,
          end: 7
        });
      });


      it('in text / mid', function() {

        // given
        node.innerHTML = 'FOOaaaa';

        var range = document.createRange();
        range.setStart(node.childNodes[0], 5);
        range.setEnd(node.childNodes[0], 5);

        applyRange(range);

        // then
        expect(getRange(node)).to.eql({
          start: 5,
          end: 5
        });
      });


      it('with line-break', function() {

        // given
        node.innerHTML = 'FOO<br>aaaa<br>';

        var range = document.createRange();
        range.setStart(node.childNodes[2], 1);
        range.setEnd(node.childNodes[2], 1);

        applyRange(range);

        // then
        expect(getRange(node)).to.eql({
          start: 5,
          end: 5
        });
      });


      it('with containers', function() {

        // given
        node.innerHTML = 'FOO<div><br>aaaa</div><div><br>bb</div>';

        var textNode = node.querySelector('div', node).childNodes[1];

        var range = document.createRange();
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);

        applyRange(range);

        // when
        expect(getRange(node)).to.eql({
          start: 9,
          end: 9
        });
      });


      it('with start/end container at root', function() {
        
        // given
        node.innerHTML = '<span>A</span><span>B</span><span>C</span>';

        // when
        var range = document.createRange();
        range.setStart(node, 0);
        range.setEnd(node, 3);
        applyRange(range);

        // then
        expect(getRange(node).to.eql({
          start: 0,
          end: 3
        }));
      });

    });

  });


  describe('setRange', function() {

    it('on empty node', function() {

      // given
      node.innerHTML = '';

      // when
      setRange(node, {
        start: 0,
        end: 0
      });

      // then
      expect(getRange(node)).to.eql({
        start: 0,
        end: 0
      });
    });


    it('on empty / out of range', function() {

      // given
      node.innerHTML = '';

      // when
      setRange(node, {
        start: 10,
        end: 15
      });

      // then
      expect(getRange(node)).to.eql({
        start: 0,
        end: 0
      });
    });


    it('full', function() {

      // given
      node.innerHTML = 'FOOaaaa';

      // when
      setRange(node, {
        start: 0,
        end: 7
      });

      // then
      expect(getRange(node)).to.eql({
        start: 0,
        end: 7
      });
    });


    it('out of bounds', function() {

      // given
      node.innerHTML = 'FOOaaaa';

      // when
      setRange(node, {
        start: 0,
        end: 9
      });

      // then
      expect(getRange(node)).to.eql({
        start: 0,
        end: 7
      });
    });


    it('in text', function() {

      // given
      node.innerHTML = 'FOOaaaa';

      // when
      setRange(node, {
        start: 4,
        end: 6
      });

      // then
      expect(getRange(node)).to.eql({
        start: 4,
        end: 6
      });
    });


    it('cross line-break', function() {

      // given
      node.innerHTML = 'FOO<br>aaaa<br>';

      // when
      setRange(node, {
        start: 2,
        end: 7
      });

      // then
      expect(getRange(node)).to.eql({
        start: 2,
        end: 7
      });
    });


    it('cross container', function() {

      // given
      node.innerHTML = 'FOO<div><br>aaaa</div><div><br>bb</div>';

      // when
      setRange(node, {
        start: 2,
        end: 11
      });

      // when
      expect(getRange(node)).to.eql({
        start: 2,
        end: 11
      });
    });


    it('cross paragraphs', function() {

      // given
      node.innerHTML = '<p>FOO</p><p class="ref">aaaa</p>';

      setRange(node, {
        start: 2,
        end: 7
      });

      // then
      expect(getRange(node)).to.eql({
        start: 2,
        end: 7
      });
    });


    it('in paragraph / at <br/>', function() {

      // given
      node.innerHTML = '<p>AA</p><p><br/></p>';

      // when
      setRange(node, {
        start: 3,
        end: 3
      });

      // then
      expect(getRange(node)).to.eql({
        start: 3,
        end: 3
      });
    });


    it('in paragraph / at end', function() {

      // given
      node.innerHTML = '<p>AA</p><p></p>';

      // when
      setRange(node, {
        start: 3,
        end: 3
      });

      // then
      expect(getRange(node)).to.eql({
        start: 3,
        end: 3
      });
    });


    it('behind paragraph / at end', function() {

      // given
      node.innerHTML = '<p>AA</p><p></p>';

      // when
      setRange(node, {
        start: 3,
        end: 3
      });

      // then
      expect(getRange(node)).to.eql({
        start: 3,
        end: 3
      });
    });


    it('cross container / out of bounds', function() {

      // given
      node.innerHTML = 'FOO<div><br>aaaa</div><div><br>bb</div>';

      // when
      setRange(node, {
        start: 2,
        end: 15
      });

      // when
      expect(getRange(node)).to.eql({
        start: 2,
        end: 13
      });
    });


    describe('caret', function() {

      it('in text / at start', function() {

        // given
        node.innerHTML = 'FOOaaaa';

        // when
        setRange(node, {
          start: 0,
          end: 0
        });

        // then
        expect(getRange(node)).to.eql({
          start: 0,
          end: 0
        });
      });


      it('in text / at end', function() {

        // given
        node.innerHTML = 'FOOaaaa';

        // when
        setRange(node, {
          start: 7,
          end: 7
        });

        // then
        expect(getRange(node)).to.eql({
          start: 7,
          end: 7
        });
      });


      it('in text / at end / out of bounds', function() {

        // given
        node.innerHTML = 'FOOaaaa';

        // when
        setRange(node, {
          start: 9,
          end: 9
        });

        // then
        expect(getRange(node)).to.eql({
          start: 7,
          end: 7
        });
      });


      it('in text / mid', function() {

        // given
        node.innerHTML = 'FOOaaaa';

        // when
        setRange(node, {
          start: 5,
          end: 5
        });

        // then
        expect(getRange(node)).to.eql({
          start: 5,
          end: 5
        });
      });


      it('with line-break', function() {

        // given
        node.innerHTML = 'FOO<br>aaaa<br>';

        // when
        setRange(node, {
          start: 5,
          end: 5
        });

        // then
        expect(getRange(node)).to.eql({
          start: 5,
          end: 5
        });
      });


      it('with containers', function() {

        // given
        node.innerHTML = 'FOO<div><br>aaaa</div><div><br>bb</div>';

        // when
        setRange(node, {
          start: 8,
          end: 8
        });

        // when
        expect(getRange(node)).to.eql({
          start: 8,
          end: 8
        });
      });

    });

  });

});
