(function () {
    "use strict";

    window.NumberBackpack = window.NumberBackpack || {};

    var RETRY_LIMIT = 80;
    var HARD_LEVEL_RETRY_LIMIT = 4000;

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(items) {
        var result = items.slice();
        var index;
        var swapIndex;
        var temporary;

        for (index = result.length - 1; index > 0; index -= 1) {
            swapIndex = randomInt(0, index);
            temporary = result[index];
            result[index] = result[swapIndex];
            result[swapIndex] = temporary;
        }

        return result;
    }

    function isArithmeticSequence(numbers) {
        var difference = numbers[1] - numbers[0];
        return numbers.every(function (number, index) {
            return index === 0 || number - numbers[index - 1] === difference;
        });
    }

    function generateTargets(range, count) {
        var min = range[0];
        var max = range[1];
        var pool = [];
        var attempt;
        var targets;
        var value;

        for (value = min; value <= max; value += 1) {
            pool.push(value);
        }

        if (pool.length < count) {
            throw new Error("目標範圍不足以產生不重複的關卡數值。");
        }

        for (attempt = 0; attempt < RETRY_LIMIT; attempt += 1) {
            targets = shuffle(pool).slice(0, count).sort(function (a, b) {
                return a - b;
            });

            if (!isArithmeticSequence(targets)) {
                return targets;
            }
        }

        // 極低機率的保底：用一次局部替換打破等差，同樣維持唯一與遞增。
        targets = shuffle(pool).slice(0, count).sort(function (a, b) {
            return a - b;
        });
        if (isArithmeticSequence(targets)) {
            return pool.slice(0, count - 1).concat(pool[count]).sort(function (a, b) {
                return a - b;
            });
        }
        return targets;
    }

    function createPositivePartition(total, partCount) {
        var maxWeight = partCount > 2 ? Math.floor(total / 2) : total - 1;
        var attempt;
        var weights;
        var remaining;
        var remainingParts;
        var minValue;
        var maxValue;
        var index;
        var value;

        if (total <= partCount) {
            throw new Error("目標重量太小，無法切分成指定數量的正整數。");
        }

        for (attempt = 0; attempt < RETRY_LIMIT; attempt += 1) {
            weights = [];
            remaining = total;

            for (index = 0; index < partCount - 1; index += 1) {
                remainingParts = partCount - index - 1;
                minValue = Math.max(1, remaining - remainingParts * maxWeight);
                maxValue = Math.min(maxWeight, remaining - remainingParts);

                if (minValue > maxValue) {
                    weights = [];
                    break;
                }

                value = randomInt(minValue, maxValue);
                weights.push(value);
                remaining -= value;
            }

            if (
                weights.length === partCount - 1 &&
                remaining > 0 &&
                remaining <= maxWeight
            ) {
                weights.push(remaining);
                return shuffle(weights);
            }
        }

        throw new Error("無法在有限次數內建立符合重量上限的保證解。");
    }

    function createDistractor(seedWeights, target, maxDistance, maxWeight) {
        var attempt;
        var seed;
        var offset;
        var candidate;

        if (typeof maxWeight !== "number") {
            maxWeight = target - 1;
        }

        for (attempt = 0; attempt < RETRY_LIMIT; attempt += 1) {
            seed = seedWeights[randomInt(0, seedWeights.length - 1)];
            offset = randomInt(-maxDistance, maxDistance);
            candidate = seed + offset;

            if (candidate > 0 && candidate < target && candidate <= maxWeight) {
                return candidate;
            }
        }

        seed = seedWeights[0];
        return Math.min(maxWeight, target - 1, Math.max(1, seed));
    }

    function sampleProducts(products, count) {
        if (products.length < count) {
            throw new Error("商品數量不足，無法建立本關。");
        }
        return shuffle(products).slice(0, count);
    }

    function createLevelCandidate(config, target, targetCount, levelIndex, products) {
        var seedWeights = createPositivePartition(target, targetCount);
        var maxWeight = targetCount > 2 ? Math.floor(target / 2) : target - 1;
        var weightedEntries = seedWeights.map(function (weight) {
            return { weight: weight, isSeed: true };
        });
        var distractorCount = config.itemCount - targetCount;
        var selectedProducts = sampleProducts(products, config.itemCount);
        var cards;
        var index;

        for (index = 0; index < distractorCount; index += 1) {
            weightedEntries.push({
                weight: createDistractor(
                    seedWeights,
                    target,
                    config.distractorDistance,
                    maxWeight
                ),
                isSeed: false
            });
        }

        weightedEntries = shuffle(weightedEntries);
        cards = selectedProducts.map(function (product, productIndex) {
            return {
                id: product.id,
                name: product.name,
                image: product.image,
                url: product.url,
                weight: weightedEntries[productIndex].weight,
                isSeed: weightedEntries[productIndex].isSeed
            };
        });

        return {
            number: levelIndex + 1,
            target: target,
            targetCount: targetCount,
            seedWeights: seedWeights.slice(),
            cards: shuffle(cards)
        };
    }

    function hasAllowedAdjacentGap(cards, maxGap) {
        var sortedWeights = cards.map(function (card) {
            return card.weight;
        }).sort(function (a, b) {
            return a - b;
        });

        return sortedWeights.every(function (weight, index) {
            return index === 0 || weight - sortedWeights[index - 1] <= maxGap;
        });
    }

    function createLevel(config, target, targetCount, levelIndex, products) {
        var isHardMode = config.key === "hard";
        var maxGap = isHardMode
            ? Math.max(2, Math.min(6, Math.round(target / (3 * targetCount))))
            : null;
        var attemptLimit = isHardMode ? HARD_LEVEL_RETRY_LIMIT : 1;
        var attempt;
        var level;

        for (attempt = 0; attempt < attemptLimit; attempt += 1) {
            level = createLevelCandidate(
                config,
                target,
                targetCount,
                levelIndex,
                products
            );

            if (!isHardMode || hasAllowedAdjacentGap(level.cards, maxGap)) {
                return level;
            }
        }

        throw new Error("無法在有限次數內建立重量分布符合限制的困難關卡。");
    }

    function generateMode(modeKey) {
        var config = window.NumberBackpack.difficulties[modeKey];
        var products = window.NumberBackpack.products;
        var targets;

        if (!config) {
            throw new Error("找不到指定的難度模式。");
        }

        targets = generateTargets(config.targetRange, config.targetCounts.length);

        return targets.map(function (target, index) {
            return createLevel(
                config,
                target,
                config.targetCounts[index],
                index,
                products
            );
        });
    }

    window.NumberBackpack.generator = {
        generateMode: generateMode,
        utilities: {
            generateTargets: generateTargets,
            createPositivePartition: createPositivePartition,
            createDistractor: createDistractor
        }
    };
}());
