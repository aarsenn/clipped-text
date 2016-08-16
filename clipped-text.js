var ClippedText = (function () {
    function ClippedText(element) {
        if (!(element instanceof HTMLElement)) throw new Error('Bad argument in ClippedText');
        this._originalText = element.innerHTML;
        this.textElement = element;
        this.isClipped = false;
    }

    ClippedText.prototype.clipToggle = function () {
        if (this.isClipped) {
            this.showAll();
        } else {
            this.clip();
        }
    }

    ClippedText.prototype.showAll = function () {
        this.textElement.innerHTML = this._originalText;
        this.isClipped = false;
    }


    ClippedText.prototype.clip = function () {
        _trimApproximately.call(this);
        _clarifyText.call(this);
        _addDots.call(this, this.textElement);
        this.isClipped = true;
    }


    function _trimApproximately() {
        var textParentElement = this.textElement.parentElement;
        this.bottomEdge = this.textElement.offsetHeight + _getRelativeTop(this.textElement);
        while (this.bottomEdge >= textParentElement.clientHeight) {
            var tempTextElement = this.textElement.cloneNode();
            var parentHeight = textParentElement.clientHeight;
            textParentElement.removeChild(this.textElement);
            this._lastCharacterIndex = this.textElement.innerHTML.length;
            var approximatelyCharacterCount = this._lastCharacterIndex / (this.bottomEdge / parentHeight);
            tempTextElement.innerHTML = this.textElement.innerHTML.slice(0, approximatelyCharacterCount);
            textParentElement.appendChild(tempTextElement);
            this.textElement = tempTextElement;
            this.bottomEdge = this.textElement.offsetHeight + _getRelativeTop(this.textElement);
        }
    }

    function _clarifyText() {
        var textParentElement = this.textElement.parentElement;
        this.bottomEdge = this.textElement.offsetHeight + _getRelativeTop(this.textElement);
        this._lastCharacterIndex = this.textElement.innerHTML.length;
        while (this.bottomEdge <= textParentElement.clientHeight) {
            if (this._originalText.length <= this._lastCharacterIndex) break;
            var tempTextElement = this.textElement.cloneNode();
            tempTextElement.innerHTML = this._originalText.slice(0, this._lastCharacterIndex);
            textParentElement.removeChild(this.textElement);
            textParentElement.appendChild(tempTextElement);
            this._lastCharacterIndex++;
            this.textElement = tempTextElement;
            this.bottomEdge = this.textElement.offsetHeight + _getRelativeTop(this.textElement);
        }
    }

    function _addDots(element) {
        var textParentElement = element.parentElement;
        var tempElement = element.cloneNode();
        textParentElement.removeChild(element);
        var regex = /(<\/\w+?>)+?$/;
        var lastTag = regex.exec(element.innerHTML);
        var cutCount = lastTag ? (lastTag[0].length + 4) : 4;
        tempElement.innerHTML = element.innerHTML.slice(0, element.innerHTML.length - cutCount)
            .concat('...')
            .concat(lastTag ? lastTag[0] : '');
        textParentElement.appendChild(tempElement);
        this.textElement = tempElement;
    }

    function _getRelativeTop(element) {
        return element.offsetTop - element.parentElement.offsetTop;
    }

    ClippedText.init = function () {
        var clippedElements = document.querySelectorAll('[data-clip]');
        for (var i = 0; i < clippedElements.length; i++) {
            ClippedText.clippedElements.push(new ClippedText(clippedElements[i]));
        }
    }

    ClippedText.clippedElements = [];

    return ClippedText;
})();