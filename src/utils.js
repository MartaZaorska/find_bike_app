function timeString(number) {
  return number < 10 ? `0${number}` : number;
}

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

function prepareStations(stations) {
  const results = [...stations];
  return results
    .map((item) => ({
      name: item.network.name,
      timestamp: item?.network?.stations[0]?.timestamp || 0,
      stations: item.network.stations.map((station) => ({
        empty_slots: station.empty_slots,
        free_bikes: station.free_bikes,
        name: station.name,
        id: station.id,
        coords: [station.latitude, station.longitude],
      })),
    }))
    .sort((a, b) => b.stations.length - a.stations.length);
}

async function sortStations(data, map) {
  let results = [...data];

  await getMyCoords().then((coords) => {
    results = results.map((item) => {
      const stations = item.stations.sort(
        (a, b) =>
          map.distance(coords, a.coords) - map.distance(coords, b.coords)
      );
      return { ...item, stations };
    });
  });

  return results;
}

export function fetchNetworks() {
  return new Promise((resolve, reject) => {
    fetch(`https://api.citybik.es/v2/networks`)
      .then((res) => res.json())
      .then((data) => resolve(prepareNetworks(data)))
      .catch((err) => reject(err));
  });
}

export function fetchStations(networks, map) {
  const pathList = networks.map((network) => network.id);
  return Promise.all(
    pathList.map((path) =>
      fetch(`https://api.citybik.es/v2/networks/${path}`).then((res) =>
        res.json()
      )
    )
  ).then(async (data) => {
    const stations = prepareStations(data);
    const sortedStations = await sortStations(stations, map);
    return sortedStations;
  });
}

export function getBrowserLanguage() {
  return navigator.language.indexOf('-') === -1
    ? navigator.language.toUpperCase()
    : navigator.language.split('-')[0].toUpperCase();
}

export function getMyCoords() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => reject(false)
    );
  });
}

export function filterStations(data, query) {
  const queryText = query.toLowerCase().normalize();
  const results = [...data];
  return results.map((item) => {
    const stations = item.stations.filter((station) => {
      return station.name.toLowerCase().normalize().indexOf(queryText) >= 0;
    });
    return { ...item, stations };
  });
}

export function getStringDate(timestamp) {
  if (timestamp === '') return '';
  const now = new Date();
  const date = new Date(timestamp);

  const time = `${timeString(date.getHours())}:${timeString(
    date.getMinutes()
  )}`;

  if (
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  ) {
    return `Today, ${time}`;
  } else {
    return `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}, ${time}`;
  }
}
