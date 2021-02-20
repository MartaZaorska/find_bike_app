import UI from './classes/UI';
import Store from './classes/Store';
import Map from './classes/Map';

import * as utils from './utils';

document.addEventListener('DOMContentLoaded', () => {
  //DOM Elements
  const locationForm = document.querySelector('#location-form');
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const countrySelect = document.querySelector('#country');
  const changeLocationButton = document.querySelector('#change-location');
  const openMapButton = document.querySelector('#open-map');
  const closeMapButton = document.querySelector('#close-map');
  const myPositionButton = document.querySelector('#my-position');
  const zoomInButton = document.querySelector('#zoom-in');
  const zoomOutButton = document.querySelector('#zoom-out');
  const stationsContainer = document.querySelector('.stations');
  const scrollUpButton = document.querySelector('.scroll__button');

  let networks = {};
  let stations = [];
  let map;

  function setActiveStation(stationId) {
    const prevActive = document.querySelector('.stations__item.active');
    const currActive = document.querySelector(
      `.stations__item[data-id="${stationId}"]`
    );

    if (prevActive) prevActive.classList.remove('active');
    if (currActive) {
      currActive.classList.add('active');
      currActive.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    Store.setData({ stationId });
    map.activeMarker(stationId);
  }

  function initMap(coords) {
    if (!map) {
      map = new Map(coords);
    } else {
      map.setView(coords);
    }
  }

  async function initStart(location) {
    if (Object.keys(networks).length === 0) {
      networks = await utils.fetchNetworks();
    }

    UI.displayStartPage(networks, location);
  }

  async function initMain(location) {
    UI.displayMainPage(location);
    searchInput.value = '';

    initMap(location.coords);

    stations = await utils.fetchStations(location.networks, map.map);

    map.createMarkers(stations, setActiveStation);
    UI.displayNetworks(stations);

    if (location.stationId !== '') setActiveStation(location.stationId);
  }

  function init() {
    const storeLocation = Store.getData();
    if (storeLocation.city === '') {
      const defaultLocation = { country: utils.getBrowserLanguage(), city: '' };
      initStart(defaultLocation);
    } else {
      initMain(storeLocation);
    }
  }

  //Event Handlers
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const buttonActive = scrollUpButton.classList.contains('active');

    if (scrollY > 180 && !buttonActive) {
      scrollUpButton.classList.add('active');
    } else if (scrollY <= 180 && buttonActive) {
      scrollUpButton.classList.remove('active');
    }
  });

  scrollUpButton.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  changeLocationButton.addEventListener('click', () =>
    initStart(Store.getData())
  );

  countrySelect.addEventListener('change', (e) =>
    initStart({ city: '', country: e.target.value })
  );

  locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const { city, country } = e.target.elements;

    if (city.value === '' || country.value === '') {
      window.alert('You must select city and country');
      return;
    }

    const data = networks[country.value][city.value];
    const newLocation = {
      country: country.value,
      city: city.value,
      coords: data.coords,
      networks: data.networks,
      stationId: '',
    };

    if (map) map.clear();

    Store.setData(newLocation);
    initMain(newLocation);
  });

  searchForm.addEventListener('submit', (e) => e.preventDefault());

  searchInput.addEventListener('input', (e) => {
    if (e.target.value === '') {
      UI.displayNetworks(stations);
    } else {
      const filteredStations = utils.filterStations(stations, e.target.value);
      UI.displayNetworks(filteredStations);
    }
  });

  stationsContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('stations__item')) return;

    const stationId = e.target.getAttribute('data-id');
    if (window.innerWidth < 992) UI.toggleMap();
    setActiveStation(stationId);
  });

  openMapButton.addEventListener('click', UI.toggleMap);
  closeMapButton.addEventListener('click', UI.toggleMap);

  zoomInButton.addEventListener('click', () => {
    if (map) map.zoomIn();
  });

  zoomOutButton.addEventListener('click', () => {
    if (map) map.zoomOut();
  });

  myPositionButton.addEventListener('click', () => {
    utils
      .getMyCoords()
      .then((coords) => map.myPosition(coords))
      .catch(() => window.alert("We can't get your location"));
  });

  //serviceWorker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./serviceWorker.js')
        .then((reg) => console.log('Service Worker: Registered'))
        .catch((err) => console.log('Service Worker: Error'));
    });
  }

  init();
});
