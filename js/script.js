
const time = document.querySelector('.time');
const dateOut = document.querySelector('.date');
const greetingSpan = document.querySelector('.greeting');
const name2 = document.querySelector('.name');


//
(function showTime() {
    

    time.innerHTML = getTime();
    dateOut.innerHTML = getDate();
    greetingSpan.textContent = `${greeting()},`;
    setTimeout(showTime, 1000);
    
})();


function getTime(){
    let date = new Date();
    let hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    let seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();

    let str = `${hours}:${minutes}:${seconds}`;
    return str;
}

function getDate(){
    const date = new Date();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options)
}


function greeting(){
    const periodOfDay = ["Good night", "Good morning", "Good afternoon", "Good evening"];
    const date = new Date();
    const res = Math.floor(date.getHours() / 6);
    return periodOfDay[res];; 
}


function setLocalStorage() {
    localStorage.setItem('name', name2.value);
}
function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name2.value = localStorage.getItem('name');
    }
}


window.addEventListener('load', getLocalStorage)
window.addEventListener('beforeunload', setLocalStorage)

