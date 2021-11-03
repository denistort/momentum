
const time = document.querySelector('.time');
const dateOut = document.querySelector('.date');
const greetingSpan = document.querySelector('.greeting');
const name2 = document.querySelector('.name');
const buttonQuotes = document.querySelector('.new-quote-button');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const cityInput = document.querySelector('.city');
//

//Settings

window.onload = function () {
    // document.body.classList.add('loaded_hiding');
    window.setTimeout(function () {
        document.querySelector('.loading-main').style.opacity = 0;

        timerUPDATERid = setTimeout(weatherUpdate);
        setTimeout(()=> {
            document.querySelector('.loading-main').style.display = 'none';
            
        }, 1000)
    }, 1000);
}

let minutesDelayWeatherUpdate = 5;
let delayWeatherUpdate = minutesDelayWeatherUpdate * 60 * 1000;
let timerUPDATERid;


const state = {
    language: 'ru',
    photoSource: 'github',
    blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio', 'todolist'],
    hour12: false,
};

const blocksState = {
    "time": true,
    "date": true,
    "greeting": true,
    "quote": true,
    "weather": true,
    "audio": true,
    "todolist": true,
};
//

function setLocalStorage() {
    localStorage.setItem('name', name2.value);
    if(cityInput.value != 'city not found'){
        localStorage.setItem('city', cityInput.value);
    }


    //save to localstorage blocks state)

    localStorage.setItem('time', blocksState.time);
    localStorage.setItem('date', blocksState.date);
    localStorage.setItem('greeting', blocksState.greeting);
    localStorage.setItem('quote', blocksState.quote);
    localStorage.setItem('weather', blocksState.weather);
    localStorage.setItem('audio', blocksState.audio);
    localStorage.setItem('todolist', blocksState.todolist);

    localStorage.setItem('hour12', state.hour12);




}
function getLocalStorage() {
    if(localStorage.getItem('name')) {
      name2.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        cityInput.value = localStorage.getItem('city');
    }


    //get from localStorage to blockstate on load
    blocksState.time = localStorage.getItem('time') === 'true' ? true : false;
    blocksState.date = localStorage.getItem('date') === 'true' ? true : false;
    blocksState.greeting = localStorage.getItem('greeting') === 'true' ? true : false;
    blocksState.quote = localStorage.getItem('quote') === 'true' ? true : false;
    blocksState.weather = localStorage.getItem('weather') === 'true' ? true : false;
    blocksState.audio = localStorage.getItem('audio') === 'true' ? true : false;
    blocksState.todolist = localStorage.getItem('todolist') === 'true' ? true : false;

    //state
    state.hour12 = localStorage.getItem('hour12') === 'true' ? true : false;
}


window.addEventListener('load', getLocalStorage)
window.addEventListener('beforeunload', setLocalStorage)

//initialize

setTimeout(initBlocksState, 700);

setTimeout(
    (function showTime() {
    

        time.innerHTML = getTime();
        dateOut.innerHTML = getDate();
        greetingSpan.textContent = `${greeting()},`;
        setTimeout(showTime, 1000);
        
    })(), 3000
)



function getTime(){
    let date = new Date();
    if(state.hour12 === true){
        return date.toLocaleString('en-US', { hour: 'numeric', minute: "2-digit", second: '2-digit', hour12: true })
    } else {
        return date.toLocaleString('ru-RU', { hour: '2-digit', minute: "2-digit", second: '2-digit'})
    }
}

function getDate(){
    const date = new Date();
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    let lang;
    if(state.language === 'en'){
        lang = 'en-US';
    } else {
        lang = 'ru-RU';
    }
    return date.toLocaleDateString(lang, options)
}


function greeting(){
    let periodOfDay;
    if(state.language === 'en'){
        periodOfDay = ["Good night", "Good morning", "Good afternoon", "Good evening"];
    } else {
        periodOfDay = ["Спокойной ночи", "Доброе утро", "Добрый день", "Добрый вечер"];
    }
    const date = new Date();
    const res = Math.floor(date.getHours() / 6);
    return periodOfDay[res];; 
}




async function getQuotes() {
    let lang;
    if(state.language === 'en'){
        lang = 'en';
    } else {
        lang = 'ru';
    }
    const url = `https://forismatic-proxy.herokuapp.com/?lang=${lang}`;
    const res = await fetch(url);
    const data = await res.json();
    
    showQuotes(data);

}
getQuotes();


buttonQuotes.addEventListener('click', () => {
    document.querySelector('.quote').classList.remove('fadeIn');
    document.querySelector('.author').classList.remove('fadeIn');
    document.querySelector('.quote').classList.add('fadeOut');
    document.querySelector('.author').classList.add('fadeOut');
    getQuotes();
    buttonQuotes.disabled = true;
    buttonQuotes.classList.add('loading');
    document.querySelector('.quotes-wrapper').style.opacity = '0';
})

function showQuotes(data){
    const arr = ['"',undefined,'"'];
    arr[1] = data.quoteText;
    setTimeout(() => {
        //
        document.querySelector('.quote').textContent = arr.join('');
        document.querySelector('.author').textContent = data.quoteAuthor;

        //
        document.querySelector('.quote').classList.remove('fadeOut');
        document.querySelector('.author').classList.remove('fadeOut');
        document.querySelector('.quote').classList.add('fadeIn');
        document.querySelector('.author').classList.add('fadeIn');
        //
        buttonQuotes.disabled = false;
        buttonQuotes.classList.remove('loading');
        document.querySelector('.quotes-wrapper').style.opacity = '.75';

    }, 200)



}

//weather plugin


function weatherUpdate(){
    getWeather(cityInput.value.length === 0 ? cityInput.value = 'Минск': cityInput.value);
    timerUPDATERid = setTimeout(weatherUpdate, delayWeatherUpdate);
}


async function getWeather(city, lang='') {
    let humidity1, windSpeed, mps;
    if(state.language === 'en') {
        lang='en'
        humidity1 = 'Humidity:';
        windSpeed = 'Wind speed:';
        mps = 'mps'
    }else{
        lang = 'ru';
        humidity1 = 'Влажность:';
        windSpeed = 'Скорость ветра:';
        mps = "мс"
    }


    const apiKey =  "42cf0e6f6fa6e11854aab15b16d75794";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${apiKey}&units=metric`;
    document.querySelector(".weather-info-wrapper").classList.add('loadingweather');
    document.querySelector('.loaderIMG').classList.add('loaderIMGisLoading');
    
    
    
    const res = await fetch(url);
    const data = await res.json(); 

    // console.log(data)
    if(data.cod != '200'){

        cityInput.value = data.message;
        cityInput.style.color = "red";

        cityInput.style.borderBottomColor = 'red';
        weatherIcon.classList.remove(weatherIcon.classList[2]);
        temperature.textContent = ``;
        weatherDescription.textContent = '';
        humidity.textContent = ``;
        wind.textContent = ``;
        document.querySelector('.loaderIMG').classList.remove('loaderIMGisLoading');

    } else {

        cityInput.style.color = "white";
        cityInput.style.borderBottomColor = 'white';
        if(weatherIcon.classList[2]){
            weatherIcon.classList.remove(weatherIcon.classList[2]);
            weatherIcon.classList.add(`owf-${data.weather[0].id}`);
            console.log(weatherIcon.classList)
        } else {
            weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        }
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        humidity.textContent = `${humidity1} ${Math.round(data.main.humidity)}%`;
        wind.textContent = `${windSpeed} ${Math.round(data.wind.speed)} ${mps}`;
        document.querySelector('.loaderIMG').classList.remove('loaderIMGisLoading');
        document.querySelector(".weather-info-wrapper").classList.remove('loadingweather');

    }


    // console.log(data.weather[0].id, data.weather[0].description, data.main.temp);


}

cityInput.addEventListener('change', () => {
    document.querySelector(".weather-info-wrapper").classList.remove('weatheronfocus')

    if(cityInput.value){
        clearTimeout(timerUPDATERid);

        timerUPDATERid = setTimeout(weatherUpdate);
        // getWeather(cityInput.value);


    } else {

    }
})

cityInput.addEventListener('focus', addFocus)

function addFocus(){
    document.querySelector(".weather-info-wrapper").classList.add('weatheronfocus')
    cityInput.style.borderBottomColor = 'white';
    cityInput.style.color = 'white';
    if(cityInput.value === 'city not found'){
        cityInput.value = '';
    }

}
cityInput.addEventListener('blur', () => {
    document.querySelector(".weather-info-wrapper").classList.remove('weatheronfocus')
})


// setTimeout(getWeather, 2000, cityInput.value.length === 0 ? cityInput.value = 'Минск': cityInput.value)


//slider images

let randNum;

function getTimeOfDay(){
    const periodOfDay = ["night", "morning", "afternoon", "evening"];
    const date = new Date();
    const res = Math.floor(date.getHours() / 6);

    return periodOfDay[res];
}
getTimeOfDay()

function getRandomNumber(){
    const num = Math.round(1 - 0.5 + Math.random() * 20)
    randNum = num;
    return num; 
}
console.log(getRandomNumber())

function setBg(number, timeOfDay) {
    const res = number > 9 ?  number: "0" + number;
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/denistort/stage1-tasks/assets/images/${timeOfDay}/${res}.jpg`; 
    img.onload = () => {      
        document.querySelector('body').style.backgroundImage = `url('${img.src}')`;
    }
}

setBg(getRandomNumber(),getTimeOfDay());


function getSlideNext(){
    if(randNum < 20) randNum++;
    else randNum = 1;
    setBg(randNum,getTimeOfDay());
}
function getSlidePrev(){
    if(randNum < 1) randNum = 20;
    else randNum--;
    setBg(randNum,getTimeOfDay());
}


document.querySelector('.slide-next').addEventListener('click', getSlideNext);
document.querySelector('.slide-prev').addEventListener('click', getSlidePrev);



//settings


document.querySelector(".settings-button").addEventListener('click', () => {
    document.querySelector('.settings-wrapper').classList.toggle('setting-Active');
    document.querySelector('.settings-button').classList.toggle('settings-button-Active')
})

const arrayBody = [...document.body.children].filter(elem => elem.className != 'footer');
const arrayFooter = [...document.body.children[3].children].filter(elem => elem.className != "settings-button" && elem.className != "settings-wrapper");
console.log(arrayFooter)
arrayBody.forEach(elem => {
    elem.addEventListener('click', function() {
        document.querySelector('.settings-wrapper').classList.remove('setting-Active');
        document.querySelector('.settings-button').classList.remove('settings-button-Active')
    })
})
arrayFooter.forEach(elem => {
    elem.addEventListener('click', function() {
        document.querySelector('.settings-wrapper').classList.remove('setting-Active');
        document.querySelector('.settings-button').classList.remove('settings-button-Active')
    })
})


function initBlocksState() {
    const greeting = document.querySelector('.greeting-container');
    const weather = document.querySelector('.weather');
    const audio = document.querySelector('.player');
    const quotes = document.querySelector('.quotes-wrapper');
    const todo = document.querySelector('.todo-wrapper')
    const time = document.querySelector('.time')
    const date = document.querySelector('.date')


    // !blocksState.time ? time.classList.add('hidden') : time.classList.remove('hidden');
    // !blocksState.date ? date.classList.add('hidden') : date.classList.remove('hidden');
    // !blocksState.todolist ? todo.classList.add('hidden') : todo.classList.remove('hidden');
    // !blocksState.quote ? quotes.classList.add('hidden') : quotes.classList.remove('hidden');
    // !blocksState.audio ? audio.classList.add('hidden') : audio.classList.remove('hidden');
    // !blocksState.weather ? weather.classList.add('hidden') : weather.classList.remove('hidden');
    // !blocksState.greeting ? greeting.classList.add('hidden') : greeting.classList.remove('hidden');

    // blocksState.weather === true ? weather.classList.add('hidden') : weather.classList.remove('hidden');


    if(blocksState.weather === false){
        console.log(blocksState.weather)
        document.querySelector('#toggle-weather').checked = false;
        weather.classList.add('hidden')
    } else {
        document.querySelector('#toggle-weather').checked = true;
        weather.classList.remove('hidden')
        console.log('skryt')
    }
    
    // blocksState.greeting === true ? document.querySelector('#toggle-greeting').checked = true 
    // : document.querySelector('#toggle-greeting').checked = false; 
    
    // blocksState.date === true ? document.querySelector('#toggle-date').checked = true 
    // : document.querySelector('#toggle-date').checked = false; 

    // blocksState.quote === true ? document.querySelector('#toggle-quote').checked = true 
    // : document.querySelector('#toggle-quote').checked = false; 

    // blocksState.audio === true ? document.querySelector('#toggle-audio').checked = true 
    // : document.querySelector('#toggle-audio').checked = false; 
    
    // blocksState.todolist === true ? document.querySelector('#toggle-todo').checked = true 
    // : document.querySelector('#toggle-todo').checked = false; 
}

// function initBlocksState(){
//     const greeting = document.querySelector('.greeting-container');
//     const weather = document.querySelector('.weather');
//     const audio = document.querySelector('.player');
//     const quotes = document.querySelector('.quotes-wrapper');
//     const todo = document.querySelector('.todo-wrapper')
//     const time = document.querySelector('.time')
//     const date = document.querySelector('.date')


//     // !blocksState.time ? time.classList.add('hidden') : time.classList.remove('hidden');
//     // !blocksState.date ? date.classList.add('hidden') : date.classList.remove('hidden');
//     // !blocksState.todolist ? todo.classList.add('hidden') : todo.classList.remove('hidden');
//     // !blocksState.quote ? quotes.classList.add('hidden') : quotes.classList.remove('hidden');
//     // !blocksState.audio ? audio.classList.add('hidden') : audio.classList.remove('hidden');
//     // !blocksState.weather ? weather.classList.add('hidden') : weather.classList.remove('hidden');
//     // !blocksState.greeting ? greeting.classList.add('hidden') : greeting.classList.remove('hidden');

//     // blocksState.weather === true ? weather.classList.add('hidden') : weather.classList.remove('hidden');


//     if(blocksState.weather === false){
//         console.log(blocksState.weather)
//         document.querySelector('#toggle-weather').checked = false;
//         weather.classList.add('hidden')
//     } else {
//         document.querySelector('#toggle-weather').checked = true;
//         weather.classList.remove('hidden')
//         console.log('skryt')
//     }
    
//     // blocksState.greeting === true ? document.querySelector('#toggle-greeting').checked = true 
//     // : document.querySelector('#toggle-greeting').checked = false; 
    
//     // blocksState.date === true ? document.querySelector('#toggle-date').checked = true 
//     // : document.querySelector('#toggle-date').checked = false; 

//     // blocksState.quote === true ? document.querySelector('#toggle-quote').checked = true 
//     // : document.querySelector('#toggle-quote').checked = false; 

//     // blocksState.audio === true ? document.querySelector('#toggle-audio').checked = true 
//     // : document.querySelector('#toggle-audio').checked = false; 
    
//     // blocksState.todolist === true ? document.querySelector('#toggle-todo').checked = true 
//     // : document.querySelector('#toggle-todo').checked = false; 
// }

// const blocksState = {
//     "time": true,
//     "date": true,
//     "greeting": true,
//     "quote": true,
//     "weather": true,
//     "audio": true,
//     "todolist": true,
// };

document.querySelector('#toggle-weather').addEventListener('change', function(){
    const weather = document.querySelector('.weather');
    blocksState.weather = this.checked;
    this.checked ? weather.classList.remove('hidden') : weather.classList.add('hidden');
})

document.querySelector('#toggle-greeting').addEventListener('change', function(){
    const greeting = document.querySelector('.greeting-container');
    blocksState.greeting = this.checked;
    this.checked ? greeting.classList.remove('hidden') : greeting.classList.add('hidden');

})

document.querySelector('#toggle-date').addEventListener('change', function(){
    const date = document.querySelector('.date')
    blocksState.date = this.checked;
    this.checked ? date.classList.remove('hidden') : date.classList.add('hidden');

})

document.querySelector('#toggle-quote').addEventListener('change', function(){
    const quotes = document.querySelector('.quotes-wrapper');
    blocksState.quote = this.checked;
    this.checked ? quotes.classList.remove('hidden') : quotes.classList.add('hidden');

})

document.querySelector('#toggle-audio').addEventListener('change', function(){
    const audio = document.querySelector('.player');
    blocksState.audio = this.checked;
    this.checked ? audio.classList.remove('hidden') : audio.classList.add('hidden');

})

document.querySelector('#toggle-todo').addEventListener('change', function(){
    const todo = document.querySelector('.todo-wrapper');
    blocksState.todolist = this.checked;
    this.checked ? todo.classList.remove('hidden') : todo.classList.add('hidden');

})