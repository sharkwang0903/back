(function () {
    "use strict";

    window.NumberBackpack = window.NumberBackpack || {};

    var state = {
        modeKey: null,
        levels: [],
        currentIndex: 0,
        unlockedIndex: 0,
        selectedByLevel: [],
        hint: ""
    };

    function getConfig() {
        return window.NumberBackpack.difficulties[state.modeKey];
    }

    function getLevel() {
        return state.levels[state.currentIndex];
    }

    function getSelectedIds() {
        return state.selectedByLevel[state.currentIndex];
    }

    function render() {
        window.NumberBackpack.ui.renderLevel({
            modeLabel: getConfig().label,
            level: getLevel(),
            currentIndex: state.currentIndex,
            unlockedIndex: state.unlockedIndex,
            selectedIds: getSelectedIds(),
            hint: state.hint
        });
    }

    function resetSelections() {
        state.selectedByLevel = state.levels.map(function () {
            return [];
        });
    }

    function startMode(modeKey) {
        state.modeKey = modeKey;
        state.levels = window.NumberBackpack.generator.generateMode(modeKey);
        state.currentIndex = 0;
        state.unlockedIndex = 0;
        state.hint = "";
        resetSelections();
        window.NumberBackpack.ui.showGame();
        render();
    }

    function getSelectedCards() {
        var selectedIds = getSelectedIds();
        return getLevel().cards.filter(function (card) {
            return selectedIds.indexOf(card.id) !== -1;
        });
    }

    function checkCompletion() {
        var level = getLevel();
        var selectedCards = getSelectedCards();
        var totalWeight = selectedCards.reduce(function (sum, card) {
            return sum + card.weight;
        }, 0);

        if (selectedCards.length === level.targetCount && totalWeight === level.target) {
            if (state.currentIndex < 7) {
                state.unlockedIndex = Math.max(state.unlockedIndex, state.currentIndex + 1);
                window.NumberBackpack.ui.showModal({
                    kicker: "重量吻合",
                    title: "過關！",
                    message: "成功選出 " + level.targetCount + " 件商品<br>總重量剛好 " + level.target + "！",
                    actions: [
                        { action: "next", label: "下一關" },
                        { action: "replay-level", label: "再玩一次" },
                        { action: "home", label: "返回首頁" }
                    ]
                });
            } else {
                showModeComplete();
            }
        }
    }

    function toggleProduct(productId) {
        var selectedIds = getSelectedIds();
        var existingIndex = selectedIds.indexOf(productId);

        state.hint = "";
        if (existingIndex !== -1) {
            selectedIds.splice(existingIndex, 1);
        } else if (selectedIds.length < getLevel().targetCount) {
            selectedIds.push(productId);
        } else {
            state.hint = "已選滿 " + getLevel().targetCount + " 件，請先取消一件商品";
        }

        render();
        checkCompletion();
    }

    function goToLevel(index) {
        if (index < 0 || index > state.unlockedIndex || index >= state.levels.length) {
            return;
        }
        state.currentIndex = index;
        state.hint = "";
        render();
        window.scrollTo(0, 0);
    }

    function replayCurrentLevel() {
        state.selectedByLevel[state.currentIndex] = [];
        state.hint = "本關已清空，題目保持不變";
        window.NumberBackpack.ui.closeModal();
        render();
    }

    function showModeComplete() {
        var config = getConfig();
        var actions = [];

        if (config.nextMode) {
            actions.push({
                action: "start-" + config.nextMode,
                label: "挑戰" + window.NumberBackpack.difficulties[config.nextMode].label + "模式"
            });
        }
        actions.push({ action: "restart-mode", label: "再玩一次" + config.label + "模式" });
        actions.push({ action: "home", label: "返回首頁" });

        window.NumberBackpack.ui.showModal({
            kicker: "八關全數完成",
            title: "完成！",
            message: "你已通過<br>「" + config.label + "模式」全部 8 關",
            actions: actions
        });
    }

    function goHome() {
        window.NumberBackpack.ui.closeModal();
        window.NumberBackpack.ui.showHome();
    }

    function handleModalAction(action) {
        if (action === "next") {
            window.NumberBackpack.ui.closeModal();
            goToLevel(state.currentIndex + 1);
        } else if (action === "replay-level") {
            replayCurrentLevel();
        } else if (action === "restart-mode") {
            window.NumberBackpack.ui.closeModal();
            startMode(state.modeKey);
        } else if (action === "home") {
            goHome();
        } else if (action.indexOf("start-") === 0) {
            window.NumberBackpack.ui.closeModal();
            startMode(action.replace("start-", ""));
        }
    }

    function init() {
        window.NumberBackpack.ui.init({
            startMode: startMode,
            toggleProduct: toggleProduct,
            goToPrevious: function () { goToLevel(state.currentIndex - 1); },
            goToNext: function () { goToLevel(state.currentIndex + 1); },
            goHome: goHome,
            modalAction: handleModalAction
        });
    }

    window.NumberBackpack.game = {
        init: init,
        startMode: startMode,
        getState: function () { return state; }
    };
}());
