import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { MapProvider , Map, Marker} from 'react-map-gl';
import { setMaxListeners } from 'events';
import { createOptimisticUniqueName } from 'typescript';

// mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpaGF6YSIsImEiOiJjbDc0cnR5NjMwODcxM29wNnNqaGk1MnB3In0.O2YDd_RJn0jlC6izyWfCjA';

const MAPBOX_TOKEN : string = "pk.eyJ1IjoiZWxpaGF6YSIsImEiOiJjbDc0cnR5NjMwODcxM29wNnNqaGk1MnB3In0.O2YDd_RJn0jlC6izyWfCjA";

function Fiche(props: {name: string}) {
  const [index, setIndex] = useState<number>(0);
  const tab : {name: string, description: string, type: string}[] = JSON.parse(localStorage.getItem('my_array') || '[]');
  useEffect(() => {
    setIndex(tab.findIndex(contact => contact.name === props.name));
  } , [props.name]);

  return (
    <div className="ficheContact">
        <h1>Fiche de {tab[index].name}</h1>
        <div className="leContact">
          <p><strong>Nom : </strong>{tab[index].name}</p>
          <p><strong>Descr. : </strong>{tab[index].description}</p>
          <p><strong>Type : </strong>{tab[index].type}</p>
        </div>
      </div>
  )
}

function Contacts(props: {name: string}) {
  const [contacts, setContacts] = useState<{name: string}[]>([
    {name: 'Prupe Corp.'}, {name: 'Michel'}, {name: 'Bizières sur Zoid'}],);

  const [infoContact, setInfoContact] = useState<{name: string, description: string, type: string}[]>([
    {name: 'Prupe Corp.', description: 'Prupe Corp. is a French multinational conglomerate headquartered in Paris, France', type: 'Entreprise'},
    {name: 'Michel', description: 'Michel is a French mathematician', type: 'Particulier'},
    {name: 'Bizières sur Zoid', description: 'Bizières sur Zoid is a French city in the Loire Valley', type: 'Collectivite'}
  ]);
  
  const [currentContact, setCurrentContact] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  localStorage.setItem('my_array', JSON.stringify(infoContact));

  const handleClick = (name: string) => {
    setShow(true);
    setCurrentContact(name);
    console.log(currentContact);
    setIndex(contacts.findIndex(contact => contact.name === name));
  }

  return (
    <div className="Contacts">
      <div className="titreContacts">
        <h1>Contacts</h1>
      </div>
      <div className="Contact">
        {contacts.map((contact, index) => (
          <div onClick={() => handleClick(contact.name)} className="Personne" key={index}>
            <p>{contact.name}</p>
          </div>
        ))}
      </div>
      {props.name ? <Fiche name={props.name} />
        :  <Fiche name={currentContact}/>}
    </div>
  );
}


function App() {
  // const {current: myMap} = useMap();
  // const [lng, setLng] = useState<number>(2);
  // const [lat, setLat] = useState<number>(46.95);

  // const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
  //   setLng(e.lngLat.lng);
  //   setLat(e.lngLat.lat);
  //   console.log('tronchw');
  //   myMap?.flyTo({center: [4, 40]});
  // }

  

  // return (
  //   <div className="App">
  //     <MapProvider>
  //       <Map
  //         id="myMap"
  //         onClick={(e) => {handleClick(e)}}
  //         mapboxAccessToken={MAPBOX_TOKEN}
  //         initialViewState={{
  //           longitude: lng,
  //           latitude: lat,
  //           zoom: 5.4,
  //         }}
  //         mapStyle="mapbox://styles/mapbox/streets-v11"
  //       >
  //       </Map>
  //     </MapProvider>
  //     <Contacts />
  //   </div>
  // );
  
  // const mapContainer = useRef<HTMLDivElement>(null);
  // const map = useRef<Map | null>(null);
  // const [myMap, setMyMap] = useState<Map | null>(null);
  const [lng, setLng] = useState<number>(2);
  const [lat, setLat] = useState<number>(46.95);
  const [show, setShow] = useState<boolean>(false);
  const [currentContact, setCurrentContact] = useState<string>("");
  const tab : {name: string, description: string, type: string}[] = JSON.parse(localStorage.getItem('my_array') || '[]');
  // const [zoom, setZoom] = useState<number>(5.4);

  // const marker = new mapboxgl.Marker()
  //   .setLngLat([lng, lat])
  //   .addTo(myMap);
  
  // useEffect(() => {
  //   if (map.current) return; // initialize map only once 
  //   map.current = new Map({
  //     container: mapContainer.current || '',
  //     style: 'mapbox://styles/mapbox/streets-v11',
  //     center: [lng, lat],
  //     zoom: zoom
  //   });

  //   setMyMap(map.current);

  //   const markerParis = new mapboxgl.Marker()
  //   .setLngLat([2.33, 48.86])
  //   .addTo(map.current);
  //   const markerMichel = new mapboxgl.Marker()
  //   .setLngLat([4.8, 45.7])
  //   .addTo(map.current);
  //   const markerBizieres = new mapboxgl.Marker()
  //   .setLngLat([1.9, 47.903])
  //   .addTo(map.current);
  //   map.current.on('click', (e) => {});
  // });

  const handleClick = (name: string) => {
    setShow(true);
    setCurrentContact(name);
    console.log(currentContact);
  }

  const createNewMarker = (e: mapboxgl.MapLayerMouseEvent) => {
    setLng(e.lngLat.lng);
    setLat(e.lngLat.lat);
  }

  return (
  <div className="App">
    <div className="map-container">
      <Map
        initialViewState={{
          longitude: 2,
          latitude: 46.95,
          zoom: 5.4
        }}
        onClick={(e) => createNewMarker(e)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}>
      <Marker onClick={() => handleClick('Prupe Corp.')} longitude={2.33} latitude={48.86}/>
      <Marker onClick={() => handleClick('Michel')} longitude={4.8} latitude={45.7}/>
      <Marker onClick={() => handleClick('Bizières sur Zoid')} longitude={1.9} latitude={47.903}/>
      </Map>
    </div>
    {lng} {lat}
    {currentContact ? <Contacts name={currentContact}/> : <Contacts name={'Prupe Corp.'}/>}
    {/* <div className="contacts">{show && <Fiche name={currentContact}/>}</div> */}
  </div>
  );
}

export default App;

