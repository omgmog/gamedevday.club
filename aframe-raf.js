/*
    aFrame -
      a small library using requestAnimationFrame
      for smoother setIntervals and setTimeouts...

      © Thomas Frank, Nodebite 2014

    Works as a dropin replacement for
    setInterval, setTimeout, clearInterval and clearTimeout

    Instead of using built in native old behaviour
    uses requestAnimationFrame with all these calls
    (results in smoother rendering and less CPU load)

    Usage:

    var myInterval = aFrame.setInterval(func,ms)
    // later
    aFrame.clearInterval(myInterval);


    var myTimeout = aFrame.setTimeout(func,ms)
    // later
    aFrame.clearTimeout(myTimeout);


    // Optional: frameInterval instead of ms...
    // To do something every fourth frame:

    aFrame.setInterval(func,{frameInterval:4});
    OR aFrame.setInterval(func,{fin:4});

    // Optional: framesPerSecond instead of ms...
    // To do something with an interval corresponding
    // to a certain frame rate:

    aFrame.setInterval(func,{framesPerSecond:30});
    OR aFrame.setInterval(func,{fps:30});

*/

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// MIT license

(function(window, rAF, cAF) {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        x;

    for (x = 0; x < vendors.length && !window[rAF]; ++x) {
        window[rAF] = window[vendors[x] + 'RequestAnimationFrame'];
        window[cAF] = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window[rAF]) {
        window[rAF] = function(callback) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);

            lastTime = currTime + timeToCall;

            return id;
        };
    }

    if (!window[cAF]) {
        window[cAF] = function(id) {
            window.clearTimeout(id);
        };
    }
}(this, 'requestAnimationFrame', 'cancelAnimationFrame'));


// now for the aFrame code:

(function() {

    var mem = [];

    function loop(t) {
        requestAnimationFrame(loop);
        for (var i = 0; i < mem.length; i++) {
            if (!mem[i]) {
                continue;
            }
            mem[i].intraCo++;
            if (mem[i].intraCo % mem[i].fInterval === 0) {
                mem[i].intraCo = 0;
                mem[i].lastCall = t;
                mem[i].times && (mem[i].co++);
                mem[i].func();
                mem[i].times && mem[i].times <= mem[i].co && (mem[i] = "null");
            }
        }
    }
    requestAnimationFrame(loop);


    this.setInterval = function(func, ms, times) {
        if (ms.frameInterval || ms.fin) {
            ms = ms.frameInterval || ms.fin;
        } else if (ms.framesPerSecond || ms.fps) {
            ms = Math.floor(1000 / 16.7 / (ms.framesPerSecond || ms.fps));
        } else {
            ms = Math.floor(ms / 16.7);
        }
        var obj = {
            id: mem.length,
            func: func,
            fInterval: ms,
            intraCo: 0,
            times: times,
            co: 0
        };
        mem.push(obj);
        return obj;
    };

    this.setTimeout = function(func, ms) {
        return this.setSmartInterval(func, ms, 1);
    };

    this.clearTimeout = this.clearInterval = function(obj) {
        mem[obj.id] = null;
    };

}).call(
    window.aframe = {}
);
