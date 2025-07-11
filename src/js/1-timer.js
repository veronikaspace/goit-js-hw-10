import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
let timerId = null;

const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const refs = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};
  
startBtn.disabled = true;

flatpickr(input, {
    enableTime: true,         // Дозволяє вибрати час разом з датою
    time_24hr: true,          // Формат часу 24 години (без AM/PM)
    defaultDate: new Date(),  // Початкова дата — зараз
    minuteIncrement: 1,       // Крок вибору хвилин — 1
    onClose([date]) {  // Функція, що виконується при закритті календаря
        if (date <= Date.now()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topRight',
                class: 'custom-error',
              });
            startBtn.disabled = true;
            userSelectedDate = null;
            return;
        }
        
        startBtn.disabled = false;
        userSelectedDate = date;         
    },
  });

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    input.disabled = true;

    timerId = setInterval(() => {
        const ms = userSelectedDate - Date.now();
        if (ms <= 0) { 
        clearInterval(timerId);
        input.disabled = false;
        return updateTimer(0);
        }
        updateTimer(ms);
    }, 1000);
});

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

function updateTimer(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
  }
  

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }

