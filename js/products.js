(function () {
    "use strict";

    window.NumberBackpack = window.NumberBackpack || {};

    // 商品只保存固定資訊；遊戲重量會在每一關由 generator.js 另外產生。
    window.NumberBackpack.products = [
        { id: "REE", name: "REE", image: "assets/products/ree.png", url: "https://www.012s.com.tw/products/%E6%96%B0-ree5-3%E4%BB%B6%E7%B5%84-%E6%96%B0%E5%93%81%E5%8D%87%E7%B4%9A%E7%89%88-%E7%B4%85%E6%A8%99%E9%8A%80%E8%93%8B-%E7%B5%84%E5%90%88%E5%84%AA%E6%83%A0%E5%83%B9" },
        { id: "PNN", name: "PNN", image: "assets/products/pnn.png", url: "https://www.012s.com.tw/products/pnn3%E4%BB%B6%E7%B5%84" },
        { id: "QCC", name: "QCC", image: "assets/products/qcc.png", url: "https://www.012s.com.tw/products/qcc3%E4%BB%B6%E7%B5%84" },
        { id: "ANN", name: "ANN", image: "assets/products/ann.png", url: "https://www.012s.com.tw/products/ann5-2-1" },
        { id: "BAA", name: "BAA", image: "assets/products/baa.png", url: "https://www.012s.com.tw/products/baa3%E4%BB%B6%E7%B5%84" },
        { id: "RTT", name: "RTT", image: "assets/products/rtt.png", url: "https://www.012s.com.tw/products/rtt3%E4%BB%B6%E7%B5%84" },
        { id: "MII+5", name: "MII+5", image: "assets/products/mii+5.png", url: "https://www.012s.com.tw/products/mii3%E4%BB%B6%E7%B5%84" },
        { id: "SIRT+10", name: "SIRT+10", image: "assets/products/sirt+10.png", url: "https://www.012s.com.tw/products/sirt10" },
        { id: "SNPD", name: "SNPD", image: "assets/products/snpd.png", url: "https://www.012s.com.tw/products/snpd" },
        { id: "URPG", name: "URPG", image: "assets/products/urpg.png", url: "https://www.012s.com.tw/products/urpg10" },
        { id: "PPT+1", name: "PPT+1", image: "assets/products/ppt+1.png", url: "https://www.012s.com.tw/products/ppt1" },
        { id: "YSS", name: "YSS 巧克力片", image: "assets/products/yss.png", url: "https://www.012s.com.tw/products/yss2-%E7%B6%93%E6%BF%9F%E5%8C%8530%E6%97%A5%E4%BB%BD" },
        { id: "BBB", name: "BBB 巧克力片", image: "assets/products/bbb.png", url: "https://www.012s.com.tw/products/bbb2-%E7%B6%93%E6%BF%9F%E5%8C%8530%E6%97%A5%E4%BB%BD"},
        { id: "EQQ+2", name: "EQQ+2 咖啡", image: "assets/products/eqq+2.png", url: "https://www.012s.com.tw/products/eqq2-30%E5%8C%85100%E5%8C%85%E5%92%96%E5%95%A11121-22%E6%B0%B4%E6%AF%8D%E6%97%A5%E7%89%B9%E6%83%A0%E9%99%90%E5%AE%9A"},
        { id: "IMM+2", name: "IMM+2 咖啡", image: "assets/products/imm+2.png", url: "https://www.012s.com.tw/products/imm2-30%E5%8C%85100%E5%8C%85%E5%92%96%E5%95%A11121-22%E6%B0%B4%E6%AF%8D%E6%97%A5%E7%89%B9%E6%83%A0%E9%99%90%E5%AE%9A"},
        { id: "SWW+2", name: "SWW+2 咖啡", image: "assets/products/sww+2.png", url: "https://www.012s.com.tw/products/sww2-30%E5%8C%85100%E5%8C%85%E5%92%96%E5%95%A11121-22%E6%B0%B4%E6%AF%8D%E6%97%A5%E7%89%B9%E6%83%A0%E9%99%90%E5%AE%9A-1"},
        { id: "jellyfish-silver-pendant", name: "水母銀飾", image: "assets/products/jellyfish-silver-pendant.png", url: "https://www.012s.com.tw/products/%E7%B4%80%E5%BF%B5%E5%93%81995%E9%8A%80%E9%A3%BE-%E7%AC%AC13%E7%94%9F%E8%82%96"},
        { id: "BF01+1", name: "早餐包", image: "assets/products/bf01+1.png", url:"https://www.012s.com.tw/products/bf01"},
    ];
}());
