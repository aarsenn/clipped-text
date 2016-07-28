var ClippedText = (function () {
    function ClippedText(element) {
        if (!(element instanceof HTMLElement)) throw new Error('Bad argument in ClippedText');
        this._originalText = element.innerText;
        this.textElement = element;
        this.isClipped = false;
    }

    ClippedText.prototype.clipToggle = function () {
        if (this.isClipped) {
            this.textElement.innerText = this._originalText;
            this.isClipped = false;
        } else {
            _trimApproximately.call(this);
            _clarifyText.call(this);
            _addDots.call(this, this.textElement);
            this.isClipped = true;
        }
    }


    function _trimApproximately() {
        var textParentElement = this.textElement.parentElement;
        this.bottomEdge = this.textElement.offsetHeight + _getRelativeTop(this.textElement);
        while (this.bottomEdge >= textParentElement.clientHeight) {
            var tempTextElement = this.textElement.cloneNode();
            var parentHeight = textParentElement.clientHeight;
            textParentElement.removeChild(this.textElement);
            this._lastCharacterIndex = this.textElement.innerText.length;
            var approximatelyCharacterCount = this._lastCharacterIndex / (this.bottomEdge / parentHeight);
            tempTextElement.innerText = this.textElement.innerText.slice(0, approximatelyCharacterCount);
            textParentElement.appendChild(tempTextElement);
            this.textElement = tempTextElement;
            this.bottomEdge = this.textElement.offsetHeight + _getRelativeTop(this.textElement);
        }
    }

    function _clarifyText() {
        var textParentElement = this.textElement.parentElement;
        this.bottomEdge = this.textElement.offsetHeight + _getRelativeTop(this.textElement);
        this._lastCharacterIndex = this.textElement.innerText.length;
        while (this.bottomEdge <= textParentElement.clientHeight) {
            if (this._originalText.length <= this._lastCharacterIndex) break;
            var tempTextElement = this.textElement.cloneNode();
            tempTextElement.innerText = this._originalText.slice(0, this._lastCharacterIndex);
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
        tempElement.innerText = element.innerText.slice(0, element.innerText.length - 4).concat('...');
        textParentElement.appendChild(tempElement);
        this.textElement = tempElement;
    }

    function _getRelativeTop(element) {
        return element.offsetTop - element.parentElement.offsetTop;
    }

    ClippedText.init = function(){
        var clippedElements = document.querySelectorAll('[data-clip]');
        for(var i = 0; i < clippedElements.length; i++){
            ClippedText.clippedElements.push(new ClippedText(clippedElements[i]));
        }
    }

    ClippedText.clippedElements = [];

    return ClippedText;
})();