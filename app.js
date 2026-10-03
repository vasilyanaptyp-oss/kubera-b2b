(function () {
  var hdr = document.querySelector('.hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // mobile menu
  var burger = document.querySelector('.burger'), mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { mnav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  // catalog tabs
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.pcard');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var f = t.getAttribute('data-f');
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      cards.forEach(function (c) {
        var cats = (c.getAttribute('data-cat') || '').split(' ');
        c.hidden = !(f === 'all' || cats.indexOf(f) > -1);
      });
    });
  });

  // quote list
  var KEY = 'kmg-quote', list = [];
  try { list = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { list = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function render() {
    document.querySelectorAll('[data-qcount]').forEach(function (el) { el.textContent = list.length; });
    document.querySelectorAll('.padd').forEach(function (b) {
      var on = list.indexOf(b.getAttribute('data-q')) > -1;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? '✓ У запиті' : '+ До запиту';
    });
    var ul = document.querySelector('[data-qlist]'), empty = document.querySelector('[data-qempty]');
    if (!ul) return;
    ul.innerHTML = '';
    list.forEach(function (name, i) {
      var li = document.createElement('li');
      var s = document.createElement('span'); s.textContent = name;
      var x = document.createElement('button'); x.type = 'button'; x.textContent = '×';
      x.setAttribute('aria-label', 'Прибрати з запиту: ' + name);
      x.addEventListener('click', function () { list.splice(i, 1); save(); render(); });
      li.appendChild(s); li.appendChild(x); ul.appendChild(li);
    });
    if (empty) empty.hidden = list.length > 0;
  }
  document.querySelectorAll('.padd').forEach(function (b) {
    b.addEventListener('click', function () {
      var q = b.getAttribute('data-q'), i = list.indexOf(q);
      if (i > -1) list.splice(i, 1); else list.push(q);
      save(); render();
    });
  });
  render();

  // toggle chips in forms
  document.querySelectorAll('.opt button').forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  // file picker label
  document.querySelectorAll('.filebox input[type=file]').forEach(function (inp) {
    inp.addEventListener('change', function () {
      var out = inp.parentNode.querySelector('[data-fname]');
      if (out && inp.files && inp.files[0]) out.textContent = inp.files[0].name;
    });
  });

  // forms: no real submission, inline thank-you only
  document.querySelectorAll('form.form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, first = null;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var fld = inp.closest('.field');
        var bad = !inp.value.trim();
        if (fld) fld.classList.toggle('invalid', bad);
        inp.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && !first) first = inp;
        if (bad) ok = false;
      });
      if (!ok) { first.focus(); return; }
      var body = form.querySelector('.form-body'), thanks = form.querySelector('.thanks');
      if (body) body.hidden = true;
      if (thanks) { thanks.classList.add('show'); thanks.setAttribute('tabindex', '-1'); thanks.focus(); }
      if (form.id === 'qform') { list = []; save(); render(); }
    });
    form.querySelectorAll('[required]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var fld = inp.closest('.field');
        if (fld && inp.value.trim()) { fld.classList.remove('invalid'); inp.setAttribute('aria-invalid', 'false'); }
      });
    });
  });
})();
