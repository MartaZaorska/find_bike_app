class Store {
  static getData() {
    const localData = localStorage.getItem('find_bike_app');
    return localData === null
      ? { country: '', city: '', coords: [], networks: [], stationId: '' }
      : JSON.parse(localData);
  }

  static setData(data) {
    const currData = this.getData();
    localStorage.setItem(
      'find_bike_app',
      JSON.stringify({ ...currData, ...data })
    );
  }

  static clearData() {
    localStorage.clear();
  }
}

export default Store;
