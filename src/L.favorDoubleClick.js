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
        // This plugin references internal Leaflet properties because I
        // could see no other way to make it work.
        // 
        // We want to prevent click handlers from executing if a double-click
        // is detected. We override _on(), which creates those handlers,
        // modifying the handler to check for double-clicks. We set _leaflet_id
        // on the unmodified handler so it can be removed with off().

        // Wrap Leaflet's event handler creators
        var domEvent_on = L.DomEvent._on,
            evented_on = L.Evented._on;

        L.DomEvent._on = function (obj, type, fn, context) {
            return wrapClickHandler(type, fn, leaflet_on);

            function leaflet_on(fn) {
                return domEvent_on(obj, type, fn, context);
            }
        };

        L.Evented._on = function (type, fn, context) {
            return wrapClickHandler(type, fn, leaflet_on);

            function leaflet_on(fn) {
                return evented_on(type, fn, context);
            }
        };

        function wrapClickHandler(type, fn, leaflet_on) {
            if (type === 'click') {
                var wrappedFn = makeSingleNotMultiClickHandler(fn),
                    ret = leaflet_on(wrappedFn);
                fn._leaflet_id = wrappedFn._leaflet_id;  // otherwise off() fails
                return ret;
            } else {
                return leaflet_on(fn);
            }
        }
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
                timeoutId = setTimeout(function onClicksFinished() {
                    if (clickCount === 1) {
                        clickHandler.call(context, event);
                    }
                    clickCount = 0;
                }, _delay);
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
