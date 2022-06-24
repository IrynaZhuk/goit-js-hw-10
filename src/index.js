import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;


// refs
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// events
input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

// functions
function onInput (e) {
    const inputValue = e.target.value.trim();

    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
   
    if(inputValue === '') {
        return
    }
   else{fetchCountries(inputValue).then(r => {
    if(r.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.')
    }

    else if (r.length >= 2 && r.length <= 10) {
        countryList.innerHTML = countryListMarkup(r);
    } else {
        countryInfo.innerHTML = countryInfoMarkup(r);
    }
}).catch(error => {
    console.log(error);
    Notify.failure('Oops, there is no country with that name');
})
}} 


function countryListMarkup(countries) {
return countries.map(({flags, name}) => {
    return `
    <li class="country-item">
<img class="country-flag" src="${flags.svg}"></img>
<p class="country-name">${name.common}</p>
</li>`;
})
.join('');

}

function countryInfoMarkup(countries) {
return countries.map(({name, flags, capital, population, languages}) =>{
    return `<div class="country-info__name"><img src="${flags.svg}" alt="${
        name.official
      }" class="country-info__img" />${name.official}</div>
        <p><span class="country-info__boldtext">Capital: </span>${capital}</p>
        <p><span class="country-info__boldtext">Population: </span>${population}</p>
        <p><span class="country-info__boldtext">Languages: </span>${Object.values(
          languages
        ).join(', ')}</p>`;
}).join('');
}