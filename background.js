// background.js
// manifestv3での現在のタブ取得 & js実行
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
let tab = getCurrentTab();

chrome.action.onClicked.addListener((tab) => { // tab? 多分今開いているタブ
  chrome.scripting.executeScript({ // どんなときに実行される？
    target: {tabId: tab.id},
    files: ['content.js']
  });
  // var newURL = "http://stackoverflow.com/"; // ここを図書リクエストのページにする
  // chrome.tabs.create({ url: newURL }); // 新しいタブで開く
  console.log(tab)
});

// // Regex-pattern to check URLs against. 
// // It matches URLs like: http[s]://[...]stackoverflow.com[...]
// var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?stackoverflow\.com/;

// // A function to use as callback
// function doStuffWithDom(domContent) {
//   console.log('I received the following DOM content:\n' + domContent);
// }

// // When the browser-action button is clicked...
// // chrome.browserAction.onClicked.addListener(function (tab) {

// // });

// chrome.action.onClicked.addListener((tab) => { // tab? 多分今開いているタブ
//   // chrome.scripting.executeScript({ // jsを実行するぜ
//   //   target: {tabId: tab.id}, // tabId: 今開いているタブのIDに向けて
//   //   files: ['content.js'] // content.jsを発動！
//   // });
//   // ...check the URL of the active tab against our pattern and...
//   if (urlRegex.test(tab.url)) {
//     // ...if it matches, send a message specifying a callback too
//     chrome.tabs.sendMessage(tab.id, { text: 'report_back' }, doStuffWithDom);
//   }
// });