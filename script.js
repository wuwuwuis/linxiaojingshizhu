        const singlePullButton = document.getElementById('singlePull');
        const tenPullsButton = document.getElementById('tenPulls');
        const historyButton = document.getElementById('historyButton');
        const backButton = document.getElementById('backButton');
        const currentPull = document.getElementById('currentPull');
        const historyOverlay = document.getElementById('historyOverlay');
        const historyList = document.getElementById('historyList');
        const UP_5STAR_CHARACTER = "迪希雅";
        const NON_UP_5STAR_CHARACTERS = ["提纳里", "刻晴", "莫娜", "七七", "迪卢克", "琴"];
        const UP_4STAR_CHARACTERS = ["柯莱", "班尼特", "芭芭拉"];
        const NON_UP_4STAR_ITEMS = [
            "瑶瑶", "珐露珊", "莱依拉", "坎蒂丝", "多莉", "久岐忍", "云堇", "鹿野院平藏",
            "九条裟罗", "五郎", "早柚", "托马", "烟绯", "罗莎莉亚", "辛焱", "砂糖",
            "迪奥娜", "重云", "诺艾尔", "菲谢尔", "凝光", "行秋", "北斗", "香菱", "雷泽",
            "弓藏", "祭礼弓", "绝弦", "西风猎弓", "昭心", "祭礼残章", "流浪乐章", "西风秘典",
            "西风长枪", "匣里灭辰", "雨裁", "祭礼大剑", "钟剑", "西风大剑", "匣里龙吟", "祭礼剑",
            "笛剑", "西风剑"
        ];

        let pullCounter5Star = 0;
        let pullCounter4Star = 0;
        let pullHistory = [];
        let last4Star = "";
        let last5Star = "";
        let totalPullsCount = 0;


        let last5StarIsUp = true;
        let last4StarIsUp = true;
        
        function gachaPull(counter5Star, counter4Star) {
            let result;
        
            if (counter5Star >= 89) {
                result = "5-star";
            } else if (counter4Star >= 9) {
                result = "4-star";
            } else {
                let pd5Star = counter5Star < 73 ? 0.006 : 0.006 + 0.06 * (counter5Star - 73);
                let pd4Star = 0.051;
                let prob = Math.random();
        
                if (prob < pd5Star) {
                    result = "5-star";
                } else if (prob < pd5Star + pd4Star) {
                    result = "4-star";
                } else {
                    result = "3-star";
                }
            }
        
            if (result === "5-star") {
                if (last5StarIsUp) {
                    const upProb = 0.5;
                    if (Math.random() < upProb) {
                        result = UP_5STAR_CHARACTER;
                    } else {
                        result = NON_UP_5STAR_CHARACTERS[Math.floor(Math.random() * NON_UP_5STAR_CHARACTERS.length)];
                    }
                } else {
                    result = UP_5STAR_CHARACTER;
                }
                last5StarIsUp = result === UP_5STAR_CHARACTER;
            } else if (result === "4-star") {
                if (last4StarIsUp) {
                    const upProb = 1 / 3;
                    if (Math.random() < upProb) {
                        result = UP_4STAR_CHARACTERS[Math.floor(Math.random() * UP_4STAR_CHARACTERS.length)];
                    } else {
                        result = NON_UP_4STAR_ITEMS[Math.floor(Math.random() * NON_UP_4STAR_ITEMS.length)];
                    }
                } else {
                    result = UP_4STAR_CHARACTERS[Math.floor(Math.random() * UP_4STAR_CHARACTERS.length)];
                }
                last4StarIsUp = UP_4STAR_CHARACTERS.includes(result);
            }
        
            return result;
        }
        




        function singlePull() {
            const result = gachaPull(pullCounter5Star, pullCounter4Star, last4Star, last5Star);
            pullCounter5Star++;
            pullCounter4Star++;

            if (result === UP_5STAR_CHARACTER || NON_UP_5STAR_CHARACTERS.includes(result)) {
                pullCounter5Star = 0;
            }

            if (UP_4STAR_CHARACTERS.includes(result) || NON_UP_4STAR_ITEMS.includes(result)) {
                pullCounter4Star = 0;
            }

            return result;
        }


function tenPulls() {
    const results = [];
    for (let i = 0; i < 10; i++) {
        results.push(singlePull());
    }
    pullHistory.push(...results);
    updateTotalPulls();
    return results;
}

function displaySortedResults(results) {
    const sortedResults = [...results].sort((a, b) => {
        if (a === "5-star" || NON_UP_5STAR_CHARACTERS.includes(a)) return -1;
        if (b === "5-star" || NON_UP_5STAR_CHARACTERS.includes(b)) return 1;
        return 0;
    });
    return sortedResults.join(', ');
}


function updateTotalPulls() {
    totalPullsCount = pullHistory.length;
    totalPulls.textContent = `总抽数：${totalPullsCount}`;
}



function displayHistory() {
    historyList.innerHTML = '';

    let fiveStarList = document.createElement('div');
    let fourStarList = document.createElement('div');
    fiveStarList.classList.add('five-star');
    fourStarList.classList.add('four-star');

    let fiveStarCount = 0;
    let fourStarCount = {};

    pullHistory.forEach((pull, index) => {
        if (pull === UP_5STAR_CHARACTER || NON_UP_5STAR_CHARACTERS.includes(pull)) {
            const span = document.createElement('span');
            span.textContent = `${pull} (${fiveStarCount + 1}抽) `;
            fiveStarList.appendChild(span);
            fiveStarCount = 0;
        } else if (UP_4STAR_CHARACTERS.includes(pull) || NON_UP_4STAR_ITEMS.includes(pull)) {
            if (!fourStarCount[pull]) {
                fourStarCount[pull] = 1;
            } else {
                fourStarCount[pull]++;
            }
            fiveStarCount++;
        } else {
            fiveStarCount++;
        }
    });

    let firstFiveStar = true;
    fiveStarList.insertAdjacentHTML('afterbegin', '五星：');
    for (const [itemName, count] of Object.entries(fourStarCount)) {
        const fourStarCountDisplay = document.createElement('span');
        if (firstFiveStar) {
            fourStarCountDisplay.textContent = `四星：${itemName} × ${count} `;
            firstFiveStar = false;
        } else {
            fourStarCountDisplay.textContent = `       ${itemName} × ${count} `;
        }
        fourStarList.appendChild(fourStarCountDisplay);
    }

    historyList.appendChild(fiveStarList);
    historyList.appendChild(fourStarList);
    historyOverlay.classList.remove('hidden');
}


function displaySortedResults(results) {
    let fiveStar = [];
    let fourStar = [];
    let threeStar = [];

    results.forEach(result => {
        if (result === UP_5STAR_CHARACTER || NON_UP_5STAR_CHARACTERS.includes(result)) {
            fiveStar.push(result);
        } else if (UP_4STAR_CHARACTERS.includes(result) || NON_UP_4STAR_ITEMS.includes(result)) {
            fourStar.push(result);
        } else {
            threeStar.push(result);
        }
    });

    return [...fiveStar, ...fourStar, ...threeStar].join(', ');
}

function sortedResults(results) {
    let fiveStar = [];
    let fourStar = [];
    let threeStar = [];

    results.forEach(result => {
        if (result === UP_5STAR_CHARACTER || NON_UP_5STAR_CHARACTERS.includes(result)) {
            fiveStar.push(result);
        } else if (UP_4STAR_CHARACTERS.includes(result) || NON_UP_4STAR_ITEMS.includes(result)) {
            fourStar.push(result);
        } else {
            threeStar.push(result);
        }
    });

    return [...fiveStar, ...fourStar, ...threeStar];
}



tenPullsButton.addEventListener('click', () => {
    const results = [];
    for (let i = 0; i < 10; i++) {
        results.push(singlePull());
    }
    pullHistory.push(...results);

    const sortedDisplay = displaySortedResults(results);
    currentPull.textContent = `当前抽取：${sortedDisplay}`;
    updateTotalPulls();
});



historyButton.addEventListener('click', displayHistory);

backButton.addEventListener('click', () => {
    historyOverlay.classList.add('hidden');
});

updateTotalPulls();

