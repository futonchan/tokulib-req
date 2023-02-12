const openedUrl = location.href

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  checkBookSearchResponse(message); // 蔵書検索APIから返された値を見る
});

function checkBookSearchResponse(bookSearchResponse) {
  const books = bookSearchResponse.books;
  const isContinue = bookSearchResponse.continue;
  const isbn = Object.keys(books)[0]; // ['4834000826']
  if (isContinue == 1) {
    const sessionId = bookSearchResponse.session;
    setTimeout(bookSearch, 2500, isbn, sessionId); // ポーリングでAPI叩く
  } else if (isContinue == 0) {
    console.log(isContinue);
    // Amazonにリンク挿入
    const tokuLibLink = document.createElement("div");
    tokuLibLink.id = "tokuLibLink";
    const systemid = "Univ_Tokushima";
    const libkey = books[isbn][systemid]["libkey"];
    const existBookCount = Object.values(libkey).length;
    console.log(existBookCount)
    if (existBookCount > 0) {
      tokuLibLink.innerHTML = "<s>🏫この本を徳島大学図書館でリクエスト</s><br>※すでに図書館にあるためリクエストできません"
    }
    else {
      // リンクに本情報クエリ文字列を追加
      const bookInfoQuery = new URLSearchParams(bookInfo).toString();
      const bookInfoUrl = "https://opac.lib.tokushima-u.ac.jp/opac/user/purchase_requests/new?" + bookInfoQuery
      tokuLibLink.innerHTML = `<a href=${bookInfoUrl}>🏫この本を徳島大学図書館でリクエスト</a>`;
    }
    tokuLibLink.innerHTML += `<span class="calilLink"> <a href="https://calil.jp/book/${isbn}" target="_blank">カーリルLink</a></span>`
    const mediaMatrix = document.getElementById("MediaMatrix");
    mediaMatrix.insertAdjacentElement("afterend", tokuLibLink);
  }
}

function bookSearch(isbn = "4834000826", sessionId = null) {
  // 蔵書検索API用のパラメータを用意する
  let bookSearchParam = {}
  bookSearchParam.messageType = "bookSearch";
  bookSearchParam.sessionId = sessionId;
  bookSearchParam.appkey = "e2a19f047728db91068c9cb37bf9adf0";
  bookSearchParam.isbn = isbn.replace(/[^0-9]/g, "");
  bookSearchParam.systemid = "Univ_Tokushima"; // Issue #6 他の大学にも対応したい
  // background.js にメッセージを送る
  chrome.runtime.sendMessage(bookSearchParam);
}

// AmazonのURL
let bookInfo = {};
if (openedUrl.startsWith("https://www.amazon.co.jp/")) {
  const subBar = document.getElementById("nav-subnav")
  if (subBar) {
    const productAttribute = subBar.getAttribute("data-category");

    // 本ジャンル
    if (productAttribute == "books" && document.getElementById("productTitle")) {
      // 本情報読み取り
      bookInfo.title = document.getElementById("productTitle").innerText;
      const authors = document.title.split("|")[1].trim().split(",");
      bookInfo.author = authors[0]; // 先頭の著者名のみ
      bookInfo.asin = document.getElementById('ASIN').value;

      // 登録情報部分 
      const detailWrapper = document.getElementById("detailBulletsWrapper_feature_div");
      if (detailWrapper) {
        for (const item of detailWrapper.getElementsByClassName("a-list-item")) {
          if (item.innerHTML.includes("出版社")) bookInfo.publisher = item.children[1].innerText;
          else if (item.innerHTML.includes("発売日")) bookInfo.publishDate = item.children[1].innerText;
          else if (item.innerHTML.includes("ISBN-10")) bookInfo.isbn10 = item.children[1].innerText;
          else if (item.innerHTML.includes("ISBN-13")) bookInfo.isbn13 = item.children[1].innerText;
        }
      }
      bookSearch(isbn = bookInfo.isbn10); // return 
    }
  }
}
// 徳島大学図書館の新本リクエストのURL
else if (openedUrl.startsWith("https://opac.lib.tokushima-u.ac.jp/opac/user/purchase_requests/new")) {
  const bookInfoQuery = new URL(openedUrl).search;
  if (bookInfoQuery.length > 0) {
    const params = new URLSearchParams(bookInfoQuery);

    // クエリ文字列からフォームに自動入力
    const formTitle = document.getElementById("order_form_ti");
    formTitle.value = params.get("title");
    const formAuthor = document.getElementById("order_form_au");
    formAuthor.value = params.get("author");
    const formPublisher = document.getElementById("order_form_pu");
    formPublisher.value = params.get("publisher");
    const formPublishDate = document.getElementById("order_form_pd");
    formPublishDate.value = params.get("publishDate");
    const formIsbn = document.getElementById("order_form_sb");
    formIsbn.value = params.get("isbn13").replace("-", "");

    // 通信欄
    const formCommunicate = document.getElementById("order_form_nbu");
    chrome.storage.sync.get(["communicateMessage", "isamznlink", "isMessage"], function (items) {
      formCommunicate.value = "";
      const isamznlink = items.isamznlink;
      if (isamznlink) {
        const bookUrl = "https://www.amazon.co.jp/dp/" + params.get("asin");
        formCommunicate.value += "Amazon URL: " + bookUrl + "\n";
      }
      const ismessage = items.isMessage;
      if (ismessage) {
        let userSetStr = items.communicateMessage;
        formCommunicate.value += userSetStr + "\n";
      }
    });
  }

  // 受取館
  const selectReceiveCampus = document.getElementById("order_form_ax");
  chrome.storage.sync.get("receiveCampus", function (items) {
    let campusNum = items.receiveCampus; // "0": 常三島 本館, "1": 蔵本 蔵本分館. Optionページから変更.
    const optionElm = selectReceiveCampus.querySelector(`option[value="${campusNum}"]`);
    optionElm.selected = true;
  });
}