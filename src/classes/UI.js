import { COUNTRIES } from '../constants';

class UI {
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
}

export default UI;
