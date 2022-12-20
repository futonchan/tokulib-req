let bookInfo = {};
bookInfo.title = document.getElementById("productTitle").innerText;
bookInfo.author = document.getElementsByClassName("contributorNameID")[0].innerText;

// 登録情報部分
const detailWrapper = document.getElementById("detailBulletsWrapper_feature_div");
if (detailWrapper) {
    for (const item of detailWrapper.getElementsByClassName("a-list-item")) {
        if (item.innerHTML.includes("出版社")) bookInfo.publisher = item.children[1].innerText;
        else if (item.innerHTML.includes("発売日")) bookInfo.releaseDate = item.children[1].innerText;
        else if (item.innerHTML.includes("ISBN-10")) bookInfo.isbn10 = item.children[1].innerText;
        else if (item.innerHTML.includes("ISBN-13")) bookInfo.isbn13 = item.children[1].innerText;
    }
}
console.log(bookInfo); // debug