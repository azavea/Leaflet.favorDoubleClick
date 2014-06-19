Leaflet.favorDoubleClick
========================

A [Leaflet](https://github.com/Leaflet/Leaflet) plugin to favor double-click events over single-click events.

How many times have you double-clicked a web map to zoom in, 
but found that your action was also interpreted as a single-click on a feature? 
So in addition to the zoom that you wanted you also now have a popup that you didn't want, and must close.

That's because Leaflet favors single-click events over double-click events.
This plugin allows enabling the reverse behavior where double-click events are favored over single-click events.

*Requires Leaflet 0.8.0 or newer.*

## Demo

Try the [demo](http://azavea.github.io/Leaflet.favorDoubleClick).

## Usage

Include the plugin code (after the Leaflet code):

```html
<script src="L.favorDoubleClick.js"></script>
```

Enable or disable the plugin:

```js
// Start favoring double-click:
L.favorDoubleClick.enable();

// Stop favoring double-click:
L.favorDoubleClick.disable();
```

Adjust the double-click detection time:

```js
// Get the current delay (default 200 ms)
L.favorDoubleClick.getDelay();

// Change the delay to 300 ms
L.favorDoubleClick.setDelay(300);
```

## Blacklist

The cost of favoring double-clicks is a short delay when handling a single-click. 
For many operations the delay isn't noticable, but for others it is both noticable and unnecessary.
For example, when clicking the `-` button to zoom out or clicking a popup's `X` to close it you'd
rather not have a delay. Since you're unlikely to hit these controls when trying to double-click something else,
we'd prefer to favor single-click for these objects.

To handle this, the plugin allows specifying a "blacklist" of Leaflet classes for which "favor double-click" won't apply.
The default blacklist includes `L.Control` (which represents e.g. buttons on the map) and `L.Popup`. If there are other
obvious candidates please create an issue.

Adjust the blacklist:

```js
// Get the current blacklist (default [L.Control, L.Popup])
L.favorDoubleClick.getBlacklist();

// Clear the blacklist
L.favorDoubleClick.setBlacklist([]);
```

## License

Leaflet.favorDoubleClick is free software, and may be redistributed under the MIT-LICENSE.
