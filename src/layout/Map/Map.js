import React, { useState } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import Choropleth from 'react-leaflet-choropleth';

import 'leaflet/dist/leaflet.css';
import './Map.css';

import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import topology from '../../assets/json/countries-50m.json';

const style = {
  fillColor: '#F28F3B',
  weight: 0.5,
  color: 'white',
  fillOpacity: 0.7,
};

const mapBounds = [
  [89, 179],
  [-89, -179],
];

function getRank(country, scores) {
  const currentScore = scores.find(
    (element) => element.id === country.id || element.name === country.properties.name
  );
  if (currentScore === undefined || currentScore.score === undefined) {
    return 0;
  }
  if (Number.isNaN(currentScore.score)) {
    return 0;
  }
  return currentScore.score;
}

function setEventOnEachFeature(country, layer) {
  layer.bindTooltip(`${country.properties.name}`);
  layer.on('mouseover', (e) => {
    e.target.openTooltip(e.latlng);
  });
  layer.on('mouseout', (e) => {
    e.target.closeTooltip();
  });
  layer.on('mousemove', (e) => {
    e.target.getTooltip().setLatLng(e.latlng);
  });
}

function MapContainer(props) {
  const { scores } = props;
  const [isColorBlind, setIsColorBlind] = useState(true);
  return (
    <Map
      id="Map"
      center={[46.227638, 2.213749]}
      zoom={2}
      maxZoom={6}
      minZoom={2}
      maxBounds={mapBounds}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Source: Esri"
        noWrap
        bounds={mapBounds}
      />
      <Choropleth
        data={topology}
        valueProperty={(country) => getRank(country, scores)}
        scale={isColorBlind ? ['#F3B400', '#BB8B00', '#837171', '#0079CE', '#3994FC'].reverse() : ['red', 'orange', 'green']}
        steps={7}
        mode="e"
        style={style}
        onEachFeature={(country, layer) => {
          setEventOnEachFeature(country, layer);
        }}
      />

      <div className="colorGradient-container">
        <span className="color-text--1">Mauvais</span>
        {/* eslint-disable */}
        <div
          id="colorBlindBtn"
          name="colorBlindBtn"
          className="colorGradient"
          style={{
            background: isColorBlind ? 'linear-gradient(to left, #F3B400, #BB8B00,#837171,#0079CE,#3994FC)' : 'linear-gradient(to right, red, orange, green)',
          }}

          onClick={(e) => {
            setIsColorBlind(value => !value)
          }}
        />
        { /* eslint-enable */}

        <span className="color-text--2">Excellent</span>
      </div>
      <button
        type="button"
        className="iconEye-container"
        onClick={() => {
          setIsColorBlind((value) => !value);
        }}
        onKeyDown={() => {

        }}
      >
        <FontAwesomeIcon icon={faEye} size="lg" className="iconEye" />

      </button>
    </Map>
  );
}

export default MapContainer;
