# 《報導者》新聞小工具上線公測：橫著滾吧照片！

> 秉持深度、開放、非營利精神，[《報導者》](https://www.twreporter.org/)自創立以來，每個[數位新聞專題作品](https://www.twreporter.org/categories/infographic)的原始碼皆公開於 [GitHub](https://github.com/twreporter) 平台供社會大眾自由使用，在一次次的數位敘事實驗與研究中，我們發現有些功能適合單獨取出、應用在個別報導中，因此著手開發易於使用的新聞小工具（網頁元件），並公開釋出技術，讓不會寫程式的使用者也能透過《報導者》開發的「產生器」取得直接置入網頁中的程式碼，不必額外撰寫程式碼。

你的好故事可以有更多元的敘事選擇！「報導者開放實驗室」將陸續推出能夠「隨插即用」的網頁元件，有《報導者》過去經驗的再造，也不乏全新的敘事方法。

本文要介紹的元件「報導者／橫著滾吧照片！」就是其中之一，接著會依序介紹使用步驟以及操作範例。

﹡相關程式採 MIT 授權條款，程式碼公開在我們的 [GitHub](https://github.com/twreporter) 上。

## 「橫著滾」是哪招？

如果你有一張很「長」的照片（也許是要說一條老街的故事），若直接橫置，則難以呈現出照片蘊含的重要細節（如下圖），但這又是一張不適合擺直的「橫圖」，裁切後又會失去原先照片想傳遞的訊息。

這個時候如果有個工具，能讓使用者橫向觀看照片，同時又不影響網頁整體由上而下的滾動方向，該有多好呢？

![without ScrollableImage](../assets/without-scrollableImage.jpg)

「報導者／橫著滾吧照片！」就因為這聲呼喚而誕生了！！！

在維持網頁整體滾動方向的前提之下，使用者滾動滑鼠滾輪或在觸控螢幕上滑動就能讓照片滿版橫向捲動，如此一來照片的比例也就獲得解放，不再受限於螢幕尺寸了。

## 實測範例

上面的照片，在套用 「報導者／橫著滾吧照片！」工具後，會變成什麼樣子呢？

![fullscreen](../assets/fullscreen.gif)

在桌機上，照片會跟著滑鼠滾輪的滾動、鍵盤的上下鍵一起捲動，而在手機、平板尺寸的行動裝置上，則是跟著一般滑動方向（上下滑）捲動（如下圖），操作上都還算便利。

<img src="../assets/fullscreen-mob.gif" alt="fullscreen on mobile" width="200"/>

但是，一次要載入這麼大張的照片，對網速是很大考驗，即便經過壓縮檔案依然不小，有沒有什麼方法可以加快載入速度呢？

「報導者／橫著滾吧照片！」 支援單張以及多張照片，為了加快載入速度，建議可以先將照片裁切，再依序載入，視覺呈現上就跟直接上傳一整張照片一模一樣。

![multiple photos](../assets/multi-fullscreen.gif)

## 使用教學

《報導者》之外的網站也可以使用這個工具嗎？當然可以，以下將說明如何輕鬆地產生 「報導者／橫著滾吧照片！」 程式碼，及如何置入網頁內容中：

**步驟 1. 選擇要呈現的圖片，上傳至網路並取得圖片網址（需有公開存取權限）。**

tip：裁切成多張圖片，記得按照順序上傳。

**步驟 2. 打開[「報導者／橫著滾吧照片！」元件產生器](https://asia-northeast1-cloud-functions-268910.cloudfunctions.net/scrollable-image/)，依序新增圖片網址。**

「報導者／橫著滾吧照片！」的初始預設是，使用者點入網頁時，一次載入元件的所有圖片，若擔心影響網頁載入速度，可以勾選 :ballot_box_with_check: enable lazyload 選項開啟圖片延遲下載功能（Lazy Load），在使用者快要滑到元件時才開始載入圖片，讓使用者體驗更好。

![add images](../assets/addImages.jpg)

**步驟 3. 點擊【GET CODE】按鈕，取得「報導者／橫著滾吧照片！」所需的程式碼片段。**

![get embedded code](../assets/embeddedCode.jpg)

**步驟 4. 複製該程式碼片段，然後貼至目標網頁的 HTML 中你想要顯示的位置。**

### 完整 HTML 範例

```html
<html>
  <head>
    <title>網頁標題</title>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0,  user-scalable=no"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  </head>
  <body>
    <!-- 在 body 內貼上「報導者／橫著滾吧照片！」HTML程式碼片段 -->
    <div id="f6c74ce9-ce65-4927-b539-adf4091c8005"></div>
    <script>
      ;(function() {
        var namespace = '__twreporterEmbeddedData'
        var packageName = 'scrollable-image'
        if (typeof window != 'undefined') {
          if (!window[namespace]) {
            window[namespace] = {}
          }
          if (window[namespace] && !window[namespace][packageName]) {
            window[namespace][packageName] = []
          }
        }
        if (Array.isArray(window[namespace][packageName])) {
          var data = {
            uuid: 'f6c74ce9-ce65-4927-b539-adf4091c8005',
            lazyload: false,
            data: [
              'https:\u002F\u002Fwww.twreporter.org\u002Fimages\u002Fscrollable-image-demo\u002F001_photo__20200313.jpg',
              'https:\u002F\u002Fwww.twreporter.org\u002Fimages\u002Fscrollable-image-demo\u002F002_photo__20200313.jpg',
            ],
          }
          window[namespace][packageName].push(data)
        }
      })()
    </script>
    <script
      type="text/javascript"
      src="https://unpkg.com/@twreporter/scrollable-image@1.0.0/dist/main-e7b3e42ea2d59f6d2ba8.bundle.js"
    ></script>
  </body>
</html>
```

HTML 範例的測試結果如下所示：

![example dev](../assets/example-demo.gif)

## 常見問題

#### 1. 我可以將圖片上傳到哪裡呢？

可以將圖片上傳到有提供圖片託管服務的網路空間，並取得圖片的公開網址。

下面是幾個推薦用來上傳圖片的平台以及操作指引：

- [Google 雲端硬碟](./google-drive-hosting.md)
- [Dropbox](./dropbox-hosting.md)
- imgur.com

#### 2.「報導者／橫著滾吧照片！」支援哪些瀏覽器？

我們主要用來開發瀏覽器是 Google Chrome，經過測試，在 Firefox、Safari、Internet Explorer (IE 10 以上，含 IE 10)、Edge 都能夠正常運作。

如有遇到瀏覽器顯示結果異常，請回報您的異常狀況、作業系統、瀏覽器名稱、瀏覽器版本資訊到 `developer@twreporter.org`。

#### 3.「報導者／橫著滾吧照片！」是否免費提供商業使用？

是，「報導者／橫著滾吧照片！」使用 MIT 授權條款，可供商業使用且不需要支付任何費用，如您使用時能一併標明出處我們會非常感謝。

詳細授權資訊請見[授權條款頁](https://github.com/twreporter/orangutan-monorepo/blob/master/LICENSE)。

## 給點意見回饋吧！

如果覺得小工具很實用，請給我們拍拍手:clap:，鼓勵一下~

1. 填寫「報導者／橫著滾吧照片！」圖表產生器回饋表單：https://forms.gle/TidE4vNBzsPWECXDA

2. 在我們的 [GitHub](https://github.com/twreporter/orangutan-monorepo/tree/master/packages/scrollable-image) 上開 issue 或 open PR

3. 來信至報導者工程部信箱 `developer@twreporter.org`，我們將有專人為你服務 :kissing_heart:。

## ABOUT 報導者開放實驗室 The Reporter Lab

「[報導者開放實驗室 The Reporter Lab](https://medium.com/twreporter)」的任務之一，是提供開源的數位敘事小工具，增加說故事的方式，並且幫助減少資訊產製過程中不必要的重複工作，讓內容生產者能專注在生產優質的內容。

「報導者／橫著滾吧照片！」是我們報導者開放實驗室所製作的各種新聞小工具其中之一，若您對更多新聞小工具有興趣，歡迎追蹤我們的頁面：

[報導者開放實驗室 The Reporter Lab](https://medium.com/twreporter)
