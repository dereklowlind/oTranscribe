import {getPlayer} from './player/player';

function getTime(){
    // get timestamp
    const player = getPlayer();
    let time = 0;
    if (player) {
        time = player.getTime();
    }

    return {
        formatted: formatMilliseconds(time),
        raw: time
    };
};

function formatMilliseconds(time) {
    const hours = Math.floor(time / 3600).toString();
    const minutes = ("0" + Math.floor(time / 60) % 60).slice(-2);
    const seconds = ("0" + Math.floor( time % 60 )).slice(-2);
    let formatted = minutes+":"+seconds;
    if (hours !== '0') {
        formatted = hours + ":" + minutes + ":" + seconds;
    }
    formatted = formatted.replace(/\s/g,'');
    return formatted;
}

// http://stackoverflow.com/a/25943182
function insertHTML(newElement) {
    var sel, range;
    if (window.getSelection && (sel = window.getSelection()).rangeCount) {
        range = sel.getRangeAt(0);
        range.collapse(true);
        range.insertNode(newElement);

        // Move the caret immediately after the inserted span
        range.setStartAfter(newElement);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}


function insertWordstamp(){
    var time = getTime();
    if (time) {
        const space = document.createTextNode("\u00A0");
        insertHTML(createWordstampEl(time));
        insertHTML(space);
        activateWordstamps();
    }
}

function createWordstampEl(time) {
    const timestamp = document.createElement('span');
    timestamp.innerText = time.formatted;
    timestamp.className = 'wordstamp';
    timestamp.setAttribute('contenteditable', 'true');
    timestamp.setAttribute('data-timestamp', 15);
    return timestamp;
}

function activateWordstamps(){
    Array.from(document.querySelectorAll('.wordstamp')).forEach(el => {
        el.contentEditable = true;
        // el.removeEventListener('click', onClick);
        // el.addEventListener('click', onClick);
    });
}


// create fast and slow versions in order to increase response time by not checking all words every 100ms

function timeHighlightingFast(){
    var time = getTime();
    Array.from(document.querySelectorAll('.wordstamp')).forEach(el => {
        // alert("timestamp is " + parseFloat(el.getAttribute('data-timestamp')) + "\n raw.time = " + parseFloat(time.raw));
        const timeDiff = parseFloat(time.raw) - parseFloat(el.getAttribute('data-timestamp'));
        if(timeDiff >= 0 && timeDiff <= 20){
            // alert("Active wordstamp!");
            el.className = "wordstamp active"
        } else if(timeDiff >= 0 && timeDiff > 10){
            // alert("Active wordstamp!");
            el.className = "wordstampSlow"
        } else {
            // alert("Not active wordstamp!");
            el.className = "wordstamp"
        }
    });
}

function timeHighlightingSlow(){
    var time = getTime();
    Array.from(document.querySelectorAll('.wordstampSlow')).forEach(el => {
        // alert("timestamp is " + parseFloat(el.getAttribute('data-timestamp')) + "\n raw.time = " + parseFloat(time.raw));
        const timeDiff = parseFloat(time.raw) - parseFloat(el.getAttribute('data-timestamp'));
        if(timeDiff >= 0 && timeDiff <= 20){
            // alert("Active wordstamp!");
            el.className = "wordstamp active"
        } else if(timeDiff >= 0 && timeDiff > 10){
            // alert("Active wordstamp!");
            el.className = "wordstampSlow"
        } else {
            // alert("Not active wordstamp!");
            el.className = "wordstamp"
        }
    });
}

// function onClick() {
//     const player = getPlayer();
//     var time = this.dataset.timestamp;
//     if (player) {
//         if (typeof time === 'string' && time.indexOf(':') > -1) {
//             // backwards compatibility, as old timestamps have string rather than number
//             player.setTime(convertTimestampToSeconds(time));
//         } else {
//             player.setTime( time );
//         }
//     }    
// }

function convertTimestampToSeconds(hms) {
    var a = hms.split(':');
    if (a.length === 3) {
        return ((+a[0]) * 60 * 60) + (+a[1]) * 60 + (+a[2]);
    }
    return (+a[0]) * 60 + (+a[1]);
}

export {activateWordstamps, timeHighlightingFast, timeHighlightingSlow, insertWordstamp };
