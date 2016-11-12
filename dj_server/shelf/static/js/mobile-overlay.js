var mOverlayControl = {
  overlay: document.getElementById('mobile-overlay'),
  userClaimGetIt: function() {
    this.userGotIt = true;
    this.overlay.setAttribute('style', 'display: none;');
    this.setCookieUserGotIt();
  },
  toDisplay: function() {
    return window.screen.width < 750 && !this.userGotIt();
  },
  process: function() {
    if (this.toDisplay()) {
      this.overlay.setAttribute('style', 'display: flex;');
    }
  },
  setCookieUserGotIt: function() {
    document.cookie = "mOverlay=true; expires=Tue, 1 Jan 2030 12:00:00 UTC;";
  },
  userGotIt: function() {
    return document.cookie.includes('mOverlay=true');
  }
};

mOverlayControl.process();
