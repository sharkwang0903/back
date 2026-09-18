(function () {
    "use strict";

    window.NumberBackpack = window.NumberBackpack || {};

    window.NumberBackpack.difficulties = {
        easy: {
            key: "easy",
            label: "簡單",
            itemCount: 6,
            targetCounts: [2, 2, 3, 3, 3, 4, 4, 4],
            targetRange: [10, 30],
            // 第一版測試參數，之後可依實際遊玩感受調整。
            distractorDistance: 4,
            nextMode: "medium"
        },
        medium: {
            key: "medium",
            label: "中等",
            itemCount: 8,
            targetCounts: [3, 3, 4, 4, 4, 5, 5, 5],
            targetRange: [20, 50],
            // 第一版測試參數，之後可依實際遊玩感受調整。
            distractorDistance: 3,
            nextMode: "hard"
        },
        hard: {
            key: "hard",
            label: "困難",
            itemCount: 10,
            targetCounts: [4, 4, 5, 5, 5, 6, 6, 6],
            targetRange: [40, 100],
            // 第一版測試參數，之後可依實際遊玩感受調整。
            distractorDistance: 2,
            nextMode: null
        }
    };
}());
