import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import { debounce, throttle } from 'lodash';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

searchBox.addEventListener('input', debounce(onCountriesFetch, DEBOUNCE_DELAY));

function onCountriesFetch(evt) {
  const inputValue = evt.target.value.trim();
  if (inputValue.length === 0) {
    countryList.innerHTML = '';
    return;
  } else {
    fetchCountries(inputValue)
      .then(showCountries)
      .catch(error)
  }
}

function showCountries(countries) {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (countries.length > 10) {
    return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.', DEBOUNCE_DELAY)
  }
  if (countries.length >= 2) {
    markupInfo(countries);
  }
  if (countries.length === 1) {
    markupList(countries);
  }
};

function markupInfo(countries) {
  const markupInfo = countries.map(({ name, flags, }) => {
    return `<li><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 80px; width: 100px"> ${name.official}</li>`
  }).join('');
  countryList.innerHTML = markupInfo;
};

function markupList(countries) {
  countries.map(({ name, capital, population, flags, languages }) => {
    const markup =
      `<h1><img src="${flags.svg}" alt="Flag of ${name.official}" style="height: 80px; width: 100px"> ${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages)}</p>`;
    countryInfo.innerHTML = markup;
  })

}
function error() {
  countryList.innerHTML = "";
  return Notiflix.Notify.failure('Oops, there is no country with that name', DEBOUNCE_DELAY);
};