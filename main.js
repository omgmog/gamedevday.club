(function() {
  'use strict';
  cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
    // Zoom to screen
    window.scrollTo(0, 0);
    var konami_elemnts = document.querySelectorAll('.konami');
    for (var i=0; i<konami_elemnts.length;i++) {
      konami_elemnts[i].emit('konami');
    }
  });

}());
