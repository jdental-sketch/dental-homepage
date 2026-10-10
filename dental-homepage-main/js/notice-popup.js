// 팝업 공지 동작 코드. 내용 수정은 notice-config.js 에서 합니다.
(function () {
  var notice = window.NOTICE_POPUP;
  if (!notice || !notice.enabled) return;

  var d = new Date();
  var today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  if ((notice.start && today < notice.start) || (notice.end && today > notice.end)) return;

  var lines = [].concat(notice.message || []);
  var key = 'notice-popup:' + notice.title + ':' + notice.start;

  // 공지사항 페이지라면 목록 맨 위에도 표시
  var list = document.querySelector('.notice-list');
  if (list) {
    var item = document.createElement('li');
    item.className = 'notice-current';
    var text = document.createElement('span');
    var strong = document.createElement('strong');
    strong.textContent = notice.title;
    text.appendChild(strong);
    lines.forEach(function (line) {
      text.appendChild(document.createElement('br'));
      text.appendChild(document.createTextNode(line));
    });
    var time = document.createElement('time');
    time.textContent = notice.start || '공지';
    item.appendChild(text);
    item.appendChild(time);
    list.insertBefore(item, list.firstChild);
  }

  // '오늘 하루 보지 않기' 또는 이번 방문 중 이미 닫았으면 팝업 생략
  try {
    if (localStorage.getItem(key) === today || sessionStorage.getItem(key)) return;
  } catch (e) {}

  var overlay = document.createElement('div');
  overlay.className = 'notice-popup-overlay';
  overlay.innerHTML =
    '<div class="notice-popup" role="dialog" aria-modal="true" aria-labelledby="notice-popup-title">' +
      '<div class="notice-popup-body"><div class="eyebrow">NOTICE</div><h2 id="notice-popup-title"></h2></div>' +
      '<div class="notice-popup-actions">' +
        '<button type="button" class="notice-popup-today">오늘 하루 보지 않기</button>' +
        '<button type="button" class="notice-popup-close">닫기</button>' +
      '</div>' +
    '</div>';
  overlay.querySelector('h2').textContent = notice.title;
  var body = overlay.querySelector('.notice-popup-body');
  lines.forEach(function (line) {
    var p = document.createElement('p');
    p.textContent = line;
    body.appendChild(p);
  });

  function close(storage, value) {
    try { storage.setItem(key, value); } catch (e) {}
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(sessionStorage, '1'); }

  overlay.querySelector('.notice-popup-close').addEventListener('click', function () { close(sessionStorage, '1'); });
  overlay.querySelector('.notice-popup-today').addEventListener('click', function () { close(localStorage, today); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(sessionStorage, '1'); });
  document.addEventListener('keydown', onKey);

  document.body.appendChild(overlay);
  overlay.querySelector('.notice-popup-close').focus();
})();
