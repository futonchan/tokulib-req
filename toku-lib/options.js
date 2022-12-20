// オプションページからストレージに値を保存する
function saveOptions() {
  const campus = document.getElementById('campus').value;
  const message = document.getElementById('message').value;
  chrome.storage.sync.set({
    "receiveCampus": campus,
    "communicateMessage": message
  }, function() {
    const status = document.getElementById('status');
    status.textContent = '💾保存しました';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// ストレージに保存していた値を読み込む
function restoreOptions() {
  chrome.storage.sync.get([
    "receiveCampus",
    "communicateMessage"
  ], function(items) {
    document.getElementById('campus').value = items.receiveCampus;
    document.getElementById('message').value = items.communicateMessage;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);