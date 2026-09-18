(function () {
  var full = '$Format:%H$';
  if (full.charAt(0) === '$') return;
  var mark = document.getElementById('buildMark');
  mark.href = 'https://github.com/li9i/personal-board/commit/' + full;
  mark.textContent = full.slice(0, 7);
})();
