

  const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
    center: coordinates,
    zoom: 5,
    pitch: 45,
    bearing: -17.6,
    antialias: true
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  new maplibregl.Marker()
    .setLngLat(coordinates)
    .setPopup(
      new maplibregl.Popup({ offset: 25 }).setHTML(`
        <b><h4>Welcome to Wanderlust </h4></b>
        <p>You can start your booking! </p>
      `)
    )
    .addTo(map);