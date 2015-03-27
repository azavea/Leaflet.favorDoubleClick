(function (L) {
    var _isEnabled = false,
        _delay = 200,
        _blacklist = [L.Control, L.Popup];

    L.favorDoubleClick = {
        getDelay: function () { return _delay; }, 
        setDelay: function (delay) { _delay = delay; }, 

        getBlacklist: function () { return _blacklist; }, 
        setBlacklist: function (blacklist) { _blacklist = blacklist; },

        enable: function () {
            _isEnabled = true;
        },

        disable: function () {
            _isEnabled = false;
        },

        isEnabled: function () {
            return _isEnabled;
        }
    };

    function install() {
        // Wrap Leaflet's event handler creators.
        // Referencing _on is fragile, but Leaflet calls _on to
        // create handlers we need to wrap so we have no choice.
        var domEvent_on = L.DomEvent.on,
            evented_on = L.Evented.on;

        L.DomEvent.on = function (obj, type, fn, context) {
            if (type === 'click') {
                fn = makeSingleNotMultiClickHandler(fn);
            }
            return domEvent_on.call(this, obj, type, fn, context);
        };

        L.Evented.on = function (type, fn, context) {
            if (type === 'click') {
                fn = makeSingleNotMultiClickHandler(fn);
            }
            return evented_on.call(this, type, fn, context);
        };
    }

    function makeSingleNotMultiClickHandler(clickHandler) {
        var clickCount = 0,
            timeoutId;

        return function (event) {
            var context = this;
            if (!shouldFavorDoubleClick(context)) {
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

    function shouldFavorDoubleClick(obj) {
        return _isEnabled && !isKindOf(obj, _blacklist);
    }

    function isKindOf(obj, types) {
        if (types) {
            for (var i = 0, len = types.length; i < len; i++) {
                if (obj instanceof types[i]) {
                    return true;
                }
            }
        }
        return false;
    }

    install();

})(L)