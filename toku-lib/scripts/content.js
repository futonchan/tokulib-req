const openedUrl = location.href
if (openedUrl.startsWith("https://www.amazon.co.jp/")) {
    const subBar = document.getElementById("nav-subnav")
    const productAttribute = subBar.getAttribute("data-category");

    if (productAttribute == "books"){
        let bookInfo = {};
        bookInfo.title = document.getElementById("productTitle").innerText;
        bookInfo.author = document.getElementsByClassName("contributorNameID")[0].innerText;
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
        const tokuLibLink = document.createElement("div");
        tokuLibLink.id = "tokuLibLink";
        // tokuLibLink.className = "testClass"
        const bookInfoQuery = new URLSearchParams(bookInfo).toString();
        const bookInfoUrl = "https://opac.lib.tokushima-u.ac.jp/opac/user/purchase_requests/new?" + bookInfoQuery
        tokuLibLink.innerHTML = `<a href=${bookInfoUrl}>この本を徳島大学図書館でリクエスト</a>`;

        const mediaMatrix = document.getElementById("MediaMatrix");
        mediaMatrix.insertAdjacentElement("afterend", tokuLibLink)
    }
}
else if (openedUrl.startsWith("https://opac.lib.tokushima-u.ac.jp/opac/user/purchase_requests/new")) {
    const bookInfoQuery = new URL(openedUrl).search;
    if (bookInfoQuery.length > 0) {
        const params = new URLSearchParams(bookInfoQuery);

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

        let isInputCommunicate = true; // 通信欄に記載するか Optionページから変更
        if (isInputCommunicate) {
            const bookUrl = "https://www.amazon.co.jp/dp/" + params.get("asin");
            let userSetStr = ""; // 通信欄に毎回書く内容

            const formCommunicate = document.getElementById("order_form_nbu");
            formCommunicate.value = "Amazon URL: " + bookUrl;
        }
    }

    const selectReceiveCampus = document.getElementById("order_form_ax");
    let campusNum = 0; // 0: 常三島 本館, 1: 蔵本 蔵本分館. Optionページから変更.
    const optionElm = selectReceiveCampus.querySelector(`option[value="${campusNum}"]`);
    optionElm.selected = true;
}