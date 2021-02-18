import UI from './classes/UI';
import * as utils from './utils';

document.addEventListener('DOMContentLoaded', () => {
  //DOM Elements
  const locationForm = document.querySelector('#location-form');
  const countrySelect = document.querySelector('#country');

  let networks = {};

  async function init() {
    const defaultLocation = { country: utils.getBrowserLanguage(), city: '' };

    if (Object.keys(networks).length === 0) {
      networks = await utils.fetchNetworks();
    }

    UI.displayStartPage(networks, defaultLocation);
  }

  //Event Handlers
  countrySelect.addEventListener('change', (e) =>
    initStart({ city: '', country: e.target.value })
  );

  locationForm.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  init();
});
