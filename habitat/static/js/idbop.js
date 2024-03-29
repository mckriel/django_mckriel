let lineup2 = [];


const scheduleList = document.querySelector('.schedule-list');
const filterButton = document.querySelectorAll('.filter-button');
const filterButtons = document.querySelectorAll('.day-selector *');
const navFilterButton = document.querySelectorAll('.nav-item');
const navFilterButtons = document.querySelectorAll('.navbar *');


const dbPromise = idb.open('lineup-db', 1, function (upgradeDb) {
    upgradeDb.createObjectStore('lineup', {keyPath: 'pk'});
});


function pullRemoteLineupInformation() {
    return fetch('/habitat/get_lineup_info/1/')
        .then(function (response) {
            return response.json();
        })
        .then(function (jsondata) {
            console.log(`Response from remote server:`);
            console.log(jsondata);
            return dbPromise.then(function (db) {
                var tx = db.transaction('lineup', 'readwrite');
                var lineupStore = tx.objectStore('lineup');
                for (var key in jsondata) {
                    if (jsondata.hasOwnProperty(key)) {
                        lineupStore.put(jsondata[key]);
                    }
                }
            });
        });
}


function retrieveLineupFromIndexDB() {
    return new Promise(function (resolve, reject) {
        const dbName = 'lineup-db';
        const objectStoreName = 'lineup';
        const request = indexedDB.open(dbName);

        request.onerror = function (event) {
            console.error('Failed to open the database:', event.target.errorCode);
            reject();
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction([objectStoreName], 'readonly');
            const objectStore = transaction.objectStore(objectStoreName);
            const request = objectStore.openCursor();
            const jsonData = [];

            request.onsuccess = function (event) {
                const cursor = event.target.result;

                if (cursor) {
                    if (cursor.value) {
                        jsonData.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    console.log('Exported JSON:', jsonData);
                    lineup2 = jsonData;
                    resolve();
                }
            };

            request.onerror = function (event) {
                console.error('Error exporting JSON:', event.target.error);
                reject();
            };
        };
    });
}

function displayLineup(startDay) {
    let displayLineup = startDay.map(function (item) {
        return `<li class="schedule-card">
                <p class="schedule-card-title">${item.fields.artist_name}</p>
                <p class="schedule-card-genre">${item.fields.genre}</p>
                <p class="schedule-card-time">${item.fields.start_time} - ${item.fields.end_time}</p>
            </li>`;
    });
    displayLineup = displayLineup.join('');
    scheduleList.innerHTML = displayLineup;
}

window.addEventListener('DOMContentLoaded', function () {
    pullRemoteLineupInformation()
        .then(function () {
            return retrieveLineupFromIndexDB();
        })
        .then(function () {
            let startDay = lineup2.filter(function (lineupItem) {
                return String(lineupItem.fields.day_of_week) === '5'; // Filter for Saturday
            });

            displayLineup(startDay);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
});

//window.addEventListener('DOMContentLoaded', function () {
//    pullRemoteLineupInformation();
//    retrieveLineupFromIndexDB().then(function () {
//        let startDay = lineup2.filter(function (lineupItem) {
//            return String(lineupItem.fields.day_of_week) === "5"; // Filter for Saturday
//        });
//
//        displayLineupItems(startDay);
//    });
//});


filterButton.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        removeActiveFromDaySelector();
        btn.classList.add('day-select-active');
        const dayId = e.currentTarget.dataset.id;
        const lineupDay = lineup2.filter(function (lineupItem) {
            if (String(lineupItem.fields.day_of_week) === dayId) {
                return lineupItem;
            }
        });
        console.log(lineupDay);
        displayLineupItems(lineupDay);
    });
});


function removeActiveFromDaySelector() {
    filterButtons.forEach((element) => {
        element.classList.remove('day-select-active');
    })
}


function displayLineupItems(lineupItems) {
    let displayLineup = lineupItems.map(function (item) {
        return `<li class="schedule-card">
                <p class="schedule-card-title">${item.fields.artist_name}</p>
                <p class="schedule-card-genre">${item.fields.genre}</p>
                <p class="schedule-card-time">${item.fields.start_time} - ${item.fields.end_time}</p>
            </li>`;
    });
    displayLineup = displayLineup.join("");
    scheduleList.innerHTML = displayLineup;
}

// this makes no sense