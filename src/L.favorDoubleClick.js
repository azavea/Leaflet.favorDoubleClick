(function (L) {
    var _isEnabled = false,
        _delay = 200;

    L.favorDoubleClick = {
        enable: function (delay) {
            _isEnabled = true;
            _delay = delay || _delay;
        },

        disable: function () {
            _isEnabled = false;
        },

        isEnabled: function () {
            return _isEnabled;
        }
    };

    function install() {
        var domEvent_on = L.DomEvent._on,
            evented_on = L.Evented._on;

        L.DomEvent._on = function (obj, type, fn, context) {
            if (type === 'click') {
                fn = makeSingleNotMultiClickHandler(fn);
            }
            domEvent_on(obj, type, fn, context);
        };

        L.Evented._on = function (type, fn, context) {
            if (type === 'click') {
                fn = makeSingleNotMultiClickHandler(fn);
            }
            evented_on(type, fn, context);
        };
    }

    function makeSingleNotMultiClickHandler(clickHandler) {
        var clickCount = 0,
            timeoutId;

        return function (event) {
            var context = this;
            if (!_isEnabled) {
                clickHandler.call(context, event);
            } else {
                clickCount++;
                if (clickCount > 1) {
                    clearTimeout(timeoutId);
                }
                L.DomEvent.stopPropagation(event);
                timeoutId = setTimeout(onClicksFinished, _delay);

                function onClicksFinished() {
                    if (clickCount === 1) {
                        clickHandler.call(context, event);
                    }
                    clickCount = 0;
                }
            }
        };
    }

    install();

})(L)