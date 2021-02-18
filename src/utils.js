function prepareNetworks(data) {
  const result = {};

  data.networks.forEach((network) => {
    const { location, id, href, name } = network;
    const { city, country, latitude, longitude } = location;

    if (result[country]) {
      if (result[country][city]) {
        result[country][city].networks.push({ id, href, name });
      } else {
        result[country][city] = {
          coords: [latitude, longitude],
          networks: [{ id, href, name }],
        };
      }
    } else {
      result[country] = {
        [city]: {
          coords: [latitude, longitude],
          networks: [{ id, href, name }],
        },
      };
    }
  });

  return result;
}

export function getBrowserLanguage() {
  return navigator.language.indexOf('-') === -1
    ? navigator.language.toUpperCase()
    : navigator.language.split('-')[0].toUpperCase();
}

export function fetchNetworks() {
  return new Promise((resolve, reject) => {
    fetch(`https://api.citybik.es/v2/networks`)
      .then((res) => res.json())
      .then((data) => resolve(prepareNetworks(data)))
      .catch((err) => reject(err));
  });
}
