import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import { countryListTempl } from './js/countryListTempl';
import { countryInfoTempl } from './js/countryInfoTempl';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const searchParams = 'fields=name,capital,population,flags,languages';

inputRef.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  const country = event.target.value.trim();

  if (country === '') {
    clearMarkup();
    return;
  }

  fetchCountries(`${country}?${searchParams}`)
    .then(renderMarkup)
    .catch(() => {
      clearMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkup(countries) {
  if (countries.length > 10) {
    clearMarkup();
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countries.length === 1) {
    countryInfoRef.innerHTML = countryInfoTempl(countries[0]);
    countryListRef.innerHTML = '';
    return;
  }

  countryInfoRef.innerHTML = '';
  countryListRef.innerHTML = countryListTempl(countries);
}

function clearMarkup() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}
