import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MbtaLine, MbtaLineInfoMap, stringToLine } from "./mbta-line";
async function main(): Promise<any> {

  const map = L.map("map").setView([42.34953, -71.07844], 18);
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

  // L.tileLayer('https://s3.us-east-2.wasabisys.com/urbanatlases/39999059011864/tiles/{z}/{x}/{y}.png', {
  //   maxZoom: 19,
  //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //   opacity: 0.5,
  // }).addTo(map);

  // L.imageOverlay('http://localhost:1234/map.svg',
  //   [[42.49325, -71.25774], [42.20630, -70.98950]]).addTo(map)

  // await addGeoJson("2022-12-12_Tufts", "#00884B", map);
  // await addGeoJson("2004_Causeway_Street_Realignment", "#00884B", map);
  // await addGeoJson("1954_Wonderland", "#0071BA", map);
  // await addGeoJson("1985_Alewife", "#EC1C24", map);
  // await addGeoJson("1987_SW_Corridor", "#F6921E", map);
  await addGeoJson("export", map);
}



async function addGeoJson(name: string, map: L.Map) {

  const cutoffDate = new Date("2020");

  const allData = await fetch(`http://localhost:1234/${name}.geojson`)
    .then(res => res.json())
    .catch(err => {
      throw err;
    });

  // This is a pretty crap way of finding the closest station, but it'll work for now
  // Lots of the stations don't have a start_date, so we'll have to add it manually
  // TODO
  // const stationsByLine: Record<MbtaLine, []> = {
  //   [MbtaLine.Green]: [],
  //   [MbtaLine.Orange]: [],
  //   [MbtaLine.Blue]: [],
  //   [MbtaLine.Red]: [],
  //   [MbtaLine.Other]: []
  // }

  const stations = L.geoJSON(
    allData,
    {
      filter: function(feature) {
        if (feature.geometry.type != "Point") {
          return false;
        }

        const station = feature.properties.station;
        return station == "subway" || station == "light_rail" || station == "tram";
      },
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#FFFFFF",
          color: "#000000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
    }
  )

  const rails = L.geoJSON(
    allData,
    {
      style: function(feature) {
        const line = stringToLine(feature.properties.name);
        return {
          "color": MbtaLineInfoMap[line].color,
          "weight": line == MbtaLine.Other ? 2 : 5,
          "opacity": 1.00
        }
      },
      filter: function(feature) {
        if (feature.geometry.type != "LineString") {
          return false;
        }

        // If a segment has a start date built in, easy.
        const start_date: string | null = feature.properties.start_date || feature.properties.opening_date;
        const end_date: string = feature.properties.end_date;
        if ((start_date == null || new Date(start_date) <= cutoffDate) && (end_date == null || cutoffDate <= new Date(end_date))) {
          return true;
        } else {
          return false;
        }

        // If not, we'll have to check by looking at the nearest station[s]
        // TODO
      }
    })

  rails.addTo(map);
  stations.addTo(map);
}


main().then(r => r);