import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MbtaLine, MbtaLineInfoMap, stringToLine } from './mbta-line';
import { Slider } from './leaflet-slider';

async function main(): Promise<any> {

  const map = L.map('map').setView([42.34953, -71.07844], 18);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    opacity: 0.5,
  }).addTo(map).setOpacity(0.75);

  // L.tileLayer("http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
  //   {
  //     attribution: "<a href=\"https://www.openstreetmap.org/copyright\">© OpenStreetMap contributors</a>, Style: <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA 2.0</a> <a href=\"http://www.openrailwaymap.org/\">OpenRailwayMap</a> and OpenStreetMap",
  //     minZoom: 2,
  //     maxZoom: 19,
  //     tileSize: 256
  //   }).addTo(map);

  L.tileLayer('https://s3.us-east-2.wasabisys.com/urbanatlases/39999059011690/tiles/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    opacity: 0.5,
  }).addTo(map);

  // L.imageOverlay('http://localhost:1234/map.svg',
  //   [[42.49325, -71.25774], [42.20630, -70.98950]]).addTo(map)

  const allData = await fetch(`http://localhost:1234/export.geojson`)
    .then(res => res.json())
    .catch(err => {
      throw err;
    });

  const stations = L.geoJSON(
    allData,
    {
      filter: feature => {
        if (feature.geometry.type != 'Point') {
          return false;
        }

        const station = feature.properties.station;
        return station == 'subway' || station == 'light_rail' || station == 'tram';
      },
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#FFFFFF',
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }),
    },
  );

  const rails = L.geoJSON(
    allData,
    {
      filter: feature => feature.geometry.type == 'LineString',
    });

  rails.addTo(map);
  stations.addTo(map);

  const slider = new Slider(
    function(value) {
      console.log(value);
      stations.setStyle(feature => {
        const show: boolean = filterByDate(feature, new Date(value));
        return {
          stroke: show,
          fill: show,
        };
      });
      rails.setStyle(feature => {
        const line = stringToLine(feature.properties.name);
        return {
          stroke: filterByDate(feature, new Date(value)),
          color: MbtaLineInfoMap[line].color,
          weight: line == MbtaLine.Other ? 2 : 5,
          opacity: 1.00,
        };
      });
    },
    {
      size: '500px',
      min: 1895,
      max: new Date().getFullYear(),
      step: 1,
      id: 'slider',
      value: new Date().getFullYear(),
      collapsed: true,
      title: 'MBTA Year',
      orientation: 'horizontal',
      showValue: true,
      syncSlider: true,
    });
  slider.addTo(map);
}

function filterByDate(feature, cutoffDate: Date): boolean {
  // If a segment has a start date built in, easy.
  const start_date: string | null = feature.properties.start_date || feature.properties.opening_date;
  const end_date: string = feature.properties.end_date;
  return (start_date == null || new Date(start_date) <= cutoffDate) && (end_date == null || cutoffDate <= new Date(end_date));
}

main().then(r => r);