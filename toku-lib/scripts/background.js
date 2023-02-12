chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.messageType === "bookSearch") {
    let params = new URLSearchParams();
    params.set("appkey", message.appkey);
    params.set("isbn", message.isbn.replace(/[^0-9]/g, ""));
    params.set("systemid", message.systemid);
    params.set("format", "json");
    params.set("callback", "no");
    if (message.session != null) {
      params.set("session", message.session);
    }
    const url = "https://api.calil.jp/check?" + params.toString();
    fetch(url) // 蔵書検索APIにリクエスト送信
      .then(response => response.json())
      .then(function (bookSearchResponse) {
        chrome.tabs.sendMessage(sender.tab.id, bookSearchResponse); // 蔵書情報をJSON形式でService Workerに送信
        return false;
      })
      .catch(error => console.error(error));
    return true;
  }
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({
    url: "chrome-extension://" + chrome.runtime.id + "/options.html"
  });
});