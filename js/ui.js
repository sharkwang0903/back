(function () {
    "use strict";

    window.NumberBackpack = window.NumberBackpack || {};

    var elements = {};
    var callbacks = {};
    var lastFocusedElement = null;

    function cacheElements() {
        elements.homeScreen = document.getElementById("home-screen");
        elements.gameScreen = document.getElementById("game-screen");
        elements.modeLabel = document.getElementById("mode-label");
        elements.levelHeading = document.getElementById("level-heading");
        elements.missionText = document.getElementById("mission-text");
        elements.selectedStatus = document.getElementById("selected-status");
        elements.weightStatus = document.getElementById("weight-status");
        elements.weightCard = document.getElementById("weight-card");
        elements.backpackSlots = document.getElementById("backpack-slots");
        elements.productGrid = document.getElementById("product-grid");
        elements.previousLevel = document.getElementById("previous-level");
        elements.nextLevel = document.getElementById("next-level");
        elements.homeButton = document.getElementById("home-button");
        elements.modal = document.getElementById("result-modal");
        elements.modalKicker = document.getElementById("modal-kicker");
        elements.modalTitle = document.getElementById("modal-title");
        elements.modalMessage = document.getElementById("modal-message");
        elements.modalActions = document.getElementById("modal-actions");
    }

    function bindEvents() {
        document.querySelectorAll("[data-mode]").forEach(function (button) {
            button.addEventListener("click", function () {
                callbacks.startMode(button.dataset.mode);
            });
        });

        elements.productGrid.addEventListener("click", function (event) {
            var selectButton = event.target.closest("[data-product-id]");
            if (selectButton) {
                callbacks.toggleProduct(selectButton.dataset.productId);
            }
        });

        elements.previousLevel.addEventListener("click", function () {
            callbacks.goToPrevious();
        });
        elements.nextLevel.addEventListener("click", function () {
            callbacks.goToNext();
        });
        elements.homeButton.addEventListener("click", function () {
            callbacks.goHome();
        });
        elements.modalActions.addEventListener("click", function (event) {
            var actionButton = event.target.closest("[data-action]");
            if (actionButton) {
                callbacks.modalAction(actionButton.dataset.action);
            }
        });
    }

    function init(eventCallbacks) {
        callbacks = eventCallbacks;
        cacheElements();
        bindEvents();
    }

    function showHome() {
        elements.gameScreen.hidden = true;
        elements.homeScreen.hidden = false;
        window.scrollTo(0, 0);
        document.querySelector("[data-mode]").focus();
    }

    function showGame() {
        elements.homeScreen.hidden = true;
        elements.gameScreen.hidden = false;
        window.scrollTo(0, 0);
    }

    function getMonogram(name) {
        return name.replace("商品 ", "") || "物";
    }

    function escapeAttribute(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function renderBackpack(level, selectedCards) {
        var slots = [];
        var index;
        var card;
        var imageContent;
        var columnCount = level.targetCount === 6 ? 3 : level.targetCount;

        elements.gameScreen.dataset.backpackSlots = level.targetCount;
        elements.backpackSlots.style.gridTemplateColumns = "repeat(" + columnCount + ", minmax(0, 1fr))";
        elements.backpackSlots.dataset.count = level.cards.length;
        elements.backpackSlots.dataset.slots = level.targetCount;

        for (index = 0; index < level.targetCount; index += 1) {
            card = selectedCards[index];
            if (card) {
                imageContent = card.image
                    ? '<img src="' + card.image + '" alt="" aria-hidden="true">'
                    : '<span class="slot-monogram" aria-hidden="true">' + getMonogram(card.name) + '</span>';

                slots.push(
                    '<div class="backpack-slot is-filled">' +
                        '<span class="slot-product">' +
                            '<span class="slot-product-image" aria-hidden="true">' + imageContent + '</span>' +
                            '<span class="slot-name">' + card.name + '</span>' +
                        '</span>' +
                    '</div>'
                );
            } else {
                slots.push('<div class="backpack-slot"><span class="empty-mark">＋</span></div>');
            }
        }

        elements.backpackSlots.innerHTML = slots.join("");
    }

    function renderProducts(level, selectedIds) {
        var columnCount = Math.ceil(level.cards.length / 2);
        var totalGap = (columnCount - 1) * 5;

        elements.productGrid.dataset.count = level.cards.length;
        elements.productGrid.style.setProperty(
            "--product-card-width",
            "calc((100% - " + totalGap + "px) / " + columnCount + ")"
        );

        elements.productGrid.innerHTML = level.cards.map(function (card) {
            var isSelected = selectedIds.indexOf(card.id) !== -1;
            var imageContent = card.image
                ? '<img src="' + card.image + '" alt="" aria-hidden="true">'
                : '<span class="product-monogram" aria-hidden="true">' + getMonogram(card.name) + '</span>';
            var productUrl = typeof card.url === "string" ? card.url.trim() : "";
            var productLink = productUrl
                ? '<a class="product-link" href="' + escapeAttribute(productUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="了解商品：' + escapeAttribute(card.name) + '">了解商品</a>'
                : "";

            return (
                '<article class="product-card' + (isSelected ? ' is-selected' : '') + '">' +
                    (isSelected ? '<span class="selected-check" aria-hidden="true">✓</span>' : '') +
                    '<button class="product-select" type="button" data-product-id="' + card.id + '" aria-pressed="' + isSelected + '">' +
                        '<span class="product-image-placeholder' + (card.image ? ' has-image' : '') + '" aria-hidden="true">' +
                            imageContent +
                        '</span>' +
                        '<span class="product-name">' + card.name + '</span>' +
                        '<span class="product-weight">重量 ' + card.weight + '</span>' +
                    '</button>' +
                    productLink +
                '</article>'
            );
        }).join("");
    }

    function renderLevel(viewModel) {
        var level = viewModel.level;
        var selectedCards = level.cards.filter(function (card) {
            return viewModel.selectedIds.indexOf(card.id) !== -1;
        });
        var totalWeight = selectedCards.reduce(function (sum, card) {
            return sum + card.weight;
        }, 0);
        var isExact = totalWeight === level.target && selectedCards.length === level.targetCount;
        var isOver = totalWeight > level.target;

        elements.modeLabel.textContent = viewModel.modeLabel + "模式";
        elements.levelHeading.textContent = "第 " + level.number + " / 8 關";
        elements.missionText.textContent = "選 " + level.targetCount + " 件｜重量 " + level.target;
        elements.selectedStatus.textContent = selectedCards.length + " / " + level.targetCount;
        elements.weightStatus.textContent = totalWeight + " / " + level.target + (isExact ? " ✓" : "");
        elements.weightCard.classList.toggle("is-over", isOver);
        elements.weightCard.classList.toggle("is-exact", isExact);
        elements.previousLevel.disabled = viewModel.currentIndex === 0;
        elements.nextLevel.disabled = viewModel.currentIndex >= viewModel.unlockedIndex || viewModel.currentIndex === 7;
        renderBackpack(level, selectedCards);
        renderProducts(level, viewModel.selectedIds);
    }

    function showModal(modalData) {
        lastFocusedElement = document.activeElement;
        elements.modalKicker.textContent = modalData.kicker;
        elements.modalTitle.textContent = modalData.title;
        elements.modalMessage.innerHTML = modalData.message;
        elements.modalActions.innerHTML = modalData.actions.map(function (action, index) {
            return '<button class="modal-button' + (index === 0 ? ' primary' : '') + '" type="button" data-action="' + action.action + '">' + action.label + '</button>';
        }).join("");
        elements.modal.hidden = false;
        document.body.style.overflow = "hidden";
        elements.modalActions.querySelector("button").focus();
    }

    function closeModal() {
        elements.modal.hidden = true;
        document.body.style.overflow = "";
        if (lastFocusedElement && document.contains(lastFocusedElement)) {
            lastFocusedElement.focus();
        }
    }

    window.NumberBackpack.ui = {
        init: init,
        showHome: showHome,
        showGame: showGame,
        renderLevel: renderLevel,
        showModal: showModal,
        closeModal: closeModal
    };
}());
