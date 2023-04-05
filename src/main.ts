import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
function main(): void {

  let map = L.map("map").setView([42.34953, -71.07844], 18);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    opacity: 0.5,
  }).addTo(map).setOpacity(0.75);

  L.tileLayer('https://s3.us-east-2.wasabisys.com/urbanatlases/39999059011864/tiles/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    opacity: 0.5,
  }).addTo(map);

  L.imageOverlay('http://localhost:1234/map.svg',
    [[42.49325, -71.25774], [42.20630, -70.98950]]).addTo(map)
}

main();