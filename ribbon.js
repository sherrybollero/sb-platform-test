// Hero search box opens the site search; "User Guides" ribbon link opens a product menu.
(function () {
  var products = [
    ['Ascent Elite', '/ascent-elite'],
    ['Ascent Premier and Core', '/ascent-premier-core'],
    ['Marketpay', '/marketpay'],
    ['Paycycle', '/paycycle'],
    ['Paycycle 2.0', '/paycycle-2'],
    ['Payfactors', '/payfactors'],
  ];
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.hero-search, #hero-search')) {
      var s = document.getElementById('search-bar-entry') || document.getElementById('search-bar-entry-mobile');
      if (s) s.click();
    }
  });
  function menu() {
    var link = Array.prototype.find.call(document.querySelectorAll('#navbar a.navbar-link, #navbar a'), function (a) {
      return a.textContent.trim() === 'User Guides';
    });
    if (!link || link.dataset.psMenu) return;
    link.dataset.psMenu = '1';
    var wrap = link.parentElement;
    wrap.style.position = 'relative';
    var m = document.createElement('ul');
    m.className = 'ps-menu';
    products.forEach(function (p) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = p[1];
      a.textContent = p[0];
      li.appendChild(a);
      m.appendChild(li);
    });
    wrap.appendChild(m);
    link.addEventListener('click', function (e) { e.preventDefault(); wrap.classList.toggle('ps-open'); });
    wrap.addEventListener('mouseenter', function () { wrap.classList.add('ps-open'); });
    wrap.addEventListener('mouseleave', function () { wrap.classList.remove('ps-open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') wrap.classList.remove('ps-open'); });
  }
  new MutationObserver(menu).observe(document.documentElement, { childList: true, subtree: true });
  menu();
})();

// Show the breadcrumb line above the page title. The original stays inside the page content (hidden by
// CSS) and a copy is placed above the title: moving React's own node breaks React's later updates.
(function () {
  function move() {
    var c = document.querySelector('#content .crumbs');
    var h = document.getElementById('header');
    var copies = document.querySelectorAll('.crumbs-copy');
    if (!c || !h || !h.parentElement) {
      Array.prototype.forEach.call(copies, function (n) { n.remove(); });
      return;
    }
    var current = h.previousElementSibling;
    if (current && current.classList.contains('crumbs-copy') && current.innerHTML === c.innerHTML && copies.length === 1) return;
    Array.prototype.forEach.call(copies, function (n) { n.remove(); });
    var copy = c.cloneNode(true);
    copy.classList.add('crumbs-copy');
    h.parentElement.insertBefore(copy, h);
  }
  new MutationObserver(move).observe(document.documentElement, { childList: true, subtree: true });
  move();
})();
