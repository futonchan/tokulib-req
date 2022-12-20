# tokulib-req
Amazonページからtokulibにリクエスト送れるGoogle拡張機能


# 必要な情報
### チェック付きは取得済み
- [x] 書名(必須)
- [x] 著者名
- [x] 出版社
- [x] 出版日付
- [x] ISBN \
大学ではISBN13のハイフン抜きで登録されているので、それに合わせる
- [ ] 受取館(必須) \
自分で選ぶ（デフォルト設定あってもいいね）
- [ ] 通信欄 \
AmazonのURLでもコピペする？

# Amazonページのセレクタ
- 書名(必須)
```
#productTitle
```
- 著者名
```
#bylineInfo > span.author.notFaded > span.a-declarative > a.a-link-normal.contributorNameID
https://www.amazon.co.jp/gp/product/B091PXNY6F?storeType=ebooks&pf_rd_t=40901&pd_rd_i=B091PXNY6F&pf_rd_m=AN1VRQENFRJN5&pageType=STOREFRONT&pf_rd_p=79f8e469-2818-4c50-b33d-0b170dee4887&pf_rd_r=SEFNT8D5CAFQENX6DHX3&pd_rd_wg=zHK8E&pf_rd_s=merchandised-search-4&ref_=dbs_f_r_shv_PUWYLOKindleJPv1_8d4f5c0c-0a8d-4170-8da8-28a88175dd0&pd_rd_w=SMn9t&pf_rd_i=2275256051&pd_rd_r=e4fcc80f-9f14-417c-aa1e-bd075d5bd382

#bylineInfo > span > span.a-declarative > a.a-link-normal.contributorNameID
https://www.amazon.co.jp/%E5%85%A5%E9%96%80-%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%81%AB%E3%82%88%E3%82%8B%E7%95%B0%E5%B8%B8%E6%A4%9C%E7%9F%A5%E2%80%95R%E3%81%AB%E3%82%88%E3%82%8B%E5%AE%9F%E8%B7%B5%E3%82%AC%E3%82%A4%E3%83%89-%E4%BA%95%E6%89%8B-%E5%89%9B/dp/4339024910/ref=sr_1_1?adgrpid=61747762268&dchild=1&gclid=CjwKCAjw_-D3BRBIEiwAjVMy7HE-_3So3C_I64r4iSnaHOw9p5I_ExSjRvJM6sy-p9g7i7MoOaO2nxoCYEwQAvD_BwE&hvadid=338568407423&hvdev=c&hvlocphy=1009404&hvnetw=g&hvqmt=b&hvrand=2852220216720968301&hvtargid=kwd-313180874540&hydadcr=27266_11561146&jp-ad-ap=0&keywords=%E5%85%A5%E9%96%80%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%81%AB%E3%82%88%E3%82%8B%E7%95%B0%E5%B8%B8%E6%A4%9C%E7%9F%A5&qid=1593413287&sr=8-1&tag=googhydr-22

#bylineInfo > span:nth-child(1) > a
https://www.amazon.co.jp/%E5%AE%9F%E8%B7%B5-%E6%99%82%E7%B3%BB%E5%88%97%E8%A7%A3%E6%9E%90-%E2%80%95%E7%B5%B1%E8%A8%88%E3%81%A8%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%81%AB%E3%82%88%E3%82%8B%E4%BA%88%E6%B8%AC-Aileen-Nielsen/dp/487311960X/?_encoding=UTF8&pd_rd_w=s9B6H&pf_rd_p=5ce033f0-5b81-46ec-8910-385cc2abff14&pf_rd_r=CRM91GJW9MNVVKR90E53&pd_rd_r=a76d8f74-d43d-4244-9c67-95d9db3abe7e&pd_rd_wg=xtnHQ&ref_=pd_gw_ci_mcx_mr_hp_d
```
パターン色々
でもauthor.notFadedクラス見つけて、文字列になるまで掘っていくみたいなの描いたらできそう
```
<span class="author notFaded" data-width="">
<span class="a-declarative" data-action="a-popover" data-a-popover="{&quot;closeButtonLabel&quot;:&quot;著者ダイアログポップオーバーを閉じる&quot;,&quot;name&quot;:&quot;contributor-info-B016Z8YM6S&quot;,&quot;position&quot;:&quot;triggerBottom&quot;,&quot;popoverLabel&quot;:&quot;著者ダイアログポップオーバー&quot;,&quot;allowLinkDefault&quot;:&quot;true&quot;}">
<a data-asin="B016Z8YM6S" class="a-link-normal contributorNameID" href="/%E4%BA%95%E6%89%8B-%E5%89%9B/e/B016Z8YM6S/ref=dp_byline_cont_book_1">井手 剛</a>
<a href="javascript:void(0)" role="button" class="a-popover-trigger a-declarative"><i class="a-icon a-icon-popover"></i></a>
</span>
<span class="contribution" spacing="none">
<span class="a-color-secondary">(著)</span>
</span>
</span>
```
- 出版社
- 出版日付
- ISBN
<img width="262" alt=" 2021-10-27 18 39 02" src="https://user-images.githubusercontent.com/29348289/139040830-843f52bd-aecd-4df1-bbd6-f2decdf12eaa.png">

```
#detailBullets_feature_div > ul


<ul class="a-unordered-list a-nostyle a-vertical a-spacing-none detail-bullet-list">

<li><span class="a-list-item">
<span class="a-text-bold">出版社
</span>
<span>コロナ社 (2015/2/19)</span>
</span></li>

<li><span class="a-list-item">
<span class="a-text-bold">発売日
</span>
<span>2015/2/19</span>
</span></li>

<li><span class="a-list-item">
<span class="a-text-bold">言語
</span>
<span>日本語</span>
</span></li>

<li><span class="a-list-item">
<span class="a-text-bold">単行本
</span>
<span>275ページ</span>
</span></li>
<li><span class="a-list-item">
<span class="a-text-bold">ISBN-10
</span>
<span>4339024910</span>
</span></li>
<li><span class="a-list-item">
<span class="a-text-bold">ISBN-13
</span>
<span>978-4339024913</span>
</span></li>

</ul>
```
tokulibはISBN13のハイフン抜きで登録されてるっぽい
