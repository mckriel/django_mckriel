let lineup2 = [];


const scheduleList = document.querySelector('.schedule-list');
const filterButton = document.querySelectorAll('.filter-button');
const filterButtons = document.querySelectorAll('.day-selector *');
const navFilterButton = document.querySelectorAll('.nav-item');
const navFilterButtons = document.querySelectorAll('.navbar *');


const dbPromise = idb.open('lineup-db', 1, function (upgradeDb) {
    upgradeDb.createObjectStore('lineup', {keyPath: 'pk'});
});

// New function to handle both click and touch events
function handleClickOrTouch() {
    pullRemoteLineupInformation();
    retrieveLineupFromIndexDB().then(function () {
        let startDay = lineup2.filter(function (lineupItem) {
            return String(lineupItem.fields.day_of_week) === "5"; // Filter for Saturday
        });

        displayLineupItems(startDay);
    });
}


function pullRemoteLineupInformation() {
    return fetch('/habitat/get_lineup_info/1/').then(function (response) {
        return response.json();
    }).then(function (jsondata) {
        console.log(`Response from remote server:`)
        console.log(jsondata);

        return dbPromise.then(function(db){
            var tx = db.transaction('lineup', 'readwrite');
            var lineupStore = tx.objectStore('lineup');
            var putPromises = [];

            for (var key in jsondata) {
                if (jsondata.hasOwnProperty(key)) {
                    putPromises.push(lineupStore.put(jsondata[key]));
                }
            }

            // Return a promise that resolves when all put operations are complete
            return Promise.all(putPromises);
        });
    });
}


function retrieveLineupFromIndexDB() {
    return dbPromise.then(function (db) {
        const objectStore = db.transaction('lineup').objectStore('lineup');
        const request = objectStore.getAll();

        return new Promise(function (resolve, reject) {
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };

            request.onerror = function (event) {
                console.error('Error exporting JSON:', event.target.error);
                reject();
            };
        });
    });
}


window.addEventListener('DOMContentLoaded', function () {
    pullRemoteLineupInformation().then(function () {
        return retrieveLineupFromIndexDB();
    }).then(function (lineupData) {
        // Now you have the populated lineupData array
        console.log('Exported JSON:', lineupData);

        let startDay = lineupData.filter(function (lineupItem) {
            return String(lineupItem.fields.day_of_week) === "5"; // Filter for Saturday
        });

        displayLineupItems(startDay);
    }).catch(function (error) {
        console.error('Error:', error);
    });
});

// Modified function to handle both click and touch events
function handleClickOrTouch(event) {
    event.preventDefault();  // Prevent default action for touch events
    const button = event.currentTarget;

    pullRemoteLineupInformation();
    retrieveLineupFromIndexDB().then(function () {
        removeActiveFromDaySelector();

        // Ensure that button.dataset exists and has an 'id' property
        const dayId = button.dataset && button.dataset.id;
        if (!dayId) {
            console.error("Data id not found on clicked/touched element.");
            return;
        }

        button.classList.add('day-select-active');

        let lineupDay = lineup2.filter(function (lineupItem) {
            return String(lineupItem.fields.day_of_week) === dayId;
        });

        displayLineupItems(lineupDay);
    });
}


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
