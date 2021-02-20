import { COUNTRIES } from '../constants';
import { getStringDate } from '../utils';

class UI {
  static toggleMap() {
    const mapContainer = document.querySelector('.map__container');
    mapContainer.classList.toggle('active');
  }

  static displayStartPage(networks, location) {
    const prevActive = document.querySelector('.main');
    const currActive = document.querySelector('.start');
    const yearSpan = document.querySelector('#year');

    yearSpan.innerText = `${new Date().getFullYear()}`;
    prevActive.classList.remove('active');
    currActive.classList.add('active');

    this.displayCountryList(location.country);

    if (COUNTRIES[location.country])
      this.displayCityList(networks[location.country], location.city);
  }

  static displayMainPage(location) {
    const prevActive = document.querySelector('.start');
    const currActive = document.querySelector('.main');
    const locationElement = document.querySelector('.location');
    const stations = document.querySelector('.stations');
    const loader = document.querySelector('.loader');

    loader.classList.add('active');
    prevActive.classList.remove('active');
    currActive.classList.add('active');
    stations.innerHTML = '';

    locationElement.innerText = `${location.city}, ${
      COUNTRIES[location.country]
    }`;
  }

  static displayCountryList(selectedCountry) {
    const selectElement = document.querySelector('#country');
    selectElement.innerHTML = '<option value="">Select country</option>';

    Object.entries(COUNTRIES).forEach((country) => {
      const selectedFlag = selectedCountry === country[0];
      selectElement.innerHTML += `
        <option ${selectedFlag ? 'selected' : ''} value="${country[0]}">${
        country[1]
      }</option>
      `;
    });
  }

  static displayCityList(cities, selectedCity) {
    const selectElement = document.querySelector('#city');
    selectElement.innerHTML = '<option value="">Select city</option>';

    Object.keys(cities).forEach((city) => {
      const selectedFlag = selectedCity === city;
      selectElement.innerHTML += `
        <option ${
          selectedFlag ? 'selected' : ''
        } value="${city}">${city}</option>
      `;
    });
  }

  static getStationsList(data) {
    let stationsList = '';

    data.forEach((station) => {
      const freeBikes =
        station.free_bikes === null
          ? ''
          : `<p>Free bikes <span>${station.free_bikes}</span></p>`;

      const emptySlots =
        station.empty_slots === null
          ? ''
          : `<p>Empty slots <span>${station.empty_slots}</span></p>`;

      stationsList += `
        <li class="stations__item" data-id="${station.id}">
          <h2>${station.name}</h2>
          ${freeBikes}
          ${emptySlots}
        </li>
      `;
    });

    return stationsList;
  }

  static displayNetworks(data) {
    const stationsElement = document.querySelector('.stations');
    const loader = document.querySelector('.loader');

    loader.classList.remove('active');
    stationsElement.innerHTML = '';

    const totalResults = data.reduce(
      (prev, curr) => prev + curr.stations.length,
      0
    );

    if (totalResults === 0) {
      stationsElement.innerHTML += `
        <header class="stations__header">
          <p class="empty">No results</p>
        </header>
      `;
    }

    data.forEach((item) => {
      if (item.stations.length > 0) {
        stationsElement.innerHTML += `
          <header class="stations__header">
            <p>${getStringDate(item.timestamp)}</p>
            <h1>${item.name}</h1>
            <p>${item.stations.length} results</p>
          </header>
          <ul class="stations__list">
            ${this.getStationsList(item.stations)}
          </ul>
        `;
      }
    });
  }
}

export default UI;
