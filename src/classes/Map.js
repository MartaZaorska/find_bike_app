class Map {
  constructor(coords) {
    this.markers = {};
    this.zoom = {
      min: 0,
      max: 20,
      curr: 16,
    };

    this.map = L.map('map', { zoomControl: false });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '<span class="map__footer">&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>',
      maxZoom: 18,
      minZoom: 2,
    }).addTo(this.map);

    this.setView(coords);
  }

  setView(coords) {
    this.map.setView(coords, 16);
    this.zoom.curr = 16;
  }

  createMarkers(data, cb) {
    data.forEach((item) => {
      item.stations.forEach((station) => {
        const marker = this.createMarker(station, cb);
        this.markers[station.id] = marker;
        marker.addTo(this.map);
      });
    });
  }

  createMarker(station, cb) {
    const icon = L.icon({
      iconUrl: '/image/blue_pin_30x40.png',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    const freeBikes =
      station.free_bikes === null
        ? ''
        : `Free bikes <span>${station.free_bikes}</span></br>`;

    const emptySlots =
      station.empty_slots === null
        ? ''
        : `Empty slots <span>${station.empty_slots}</span></br>`;

    const marker = L.marker(station.coords, { icon });

    marker.bindTooltip(station.name);
    marker.bindPopup(`
        <p class="popup">
          <span class="title">${station.name}</span><br/>
          ${freeBikes}
          ${emptySlots}
        </p>
    `);

    marker.addEventListener('click', () => cb(station.id));

    return marker;
  }

  activeMarker(stationId) {
    if (Object.keys(this.markers).length > 0) {
      this.map.flyTo(this.markers[stationId].getLatLng(), 16);
      this.markers[stationId].openPopup();
      this.zoom.curr = 16;
    }
  }

  myPosition(coords) {
    if (this.markers['user']) this.markers['user'].remove(this.map);

    const icon = L.icon({
      iconUrl: '/image/pin_30x40.png',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    });

    const marker = L.marker(coords, { icon });
    marker.bindTooltip('My position');
    marker.bindPopup(`<p class="popup"><span>My position</span></p>`);
    marker.addTo(this.map);
    this.markers['user'] = marker;

    this.map.flyTo(marker.getLatLng(), 17);
    marker.openPopup();

    this.zoom.curr = 17;
  }

  zoomIn() {
    this.zoom.curr = Math.min(this.zoom.max, this.zoom.curr + 1);
    this.map.setZoom(this.zoom.curr);
  }

  zoomOut() {
    this.zoom.curr = Math.max(this.zoom.min, this.zoom.curr - 1);
    this.map.setZoom(this.zoom.curr);
  }

  clear() {
    Object.values(this.markers).forEach((marker) => marker.remove(this.map));
    this.markers = {};
  }
}

export default Map;
