import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl';
import {Map, useMap} from "react-map-gl";
import mapboxgl, {Marker} from 'mapbox-gl';

const MAPBOX_TOKEN : string = "pk.eyJ1IjoiZWxpaGF6YSIsImEiOiJjbDc0cnR5NjMwODcxM29wNnNqaGk1MnB3In0.O2YDd_RJn0jlC6izyWfCjA";

function Contacts() {
  const [contacts, setContacts] = useState<{name: string}[]>([
    {name: 'Prupe Corp.'}, {name: 'Michel'}, {name: 'Bizières sur Zoid'}],);
  const [infoContact, setInfoContact] = useState<{name: string, description: string, type: string}[]>([
    {name: 'Prupe Corp.', description: 'Prupe Corp. is a French multinational conglomerate headquartered in Paris, France.', type: 'Entreprise'},
    {name: 'Michel', description: 'Michel is a French mathematician.', type: 'Particulier'},
    {name: 'Bizières sur Zoid', description: 'Bizières sur Zoid is a French city in the Loire Valley.', type: 'Collectivite'}
  ]);
  const [currentContact, setCurrentContact] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const handleClick = (name: string) => {
    setShow(true);
    setCurrentContact(name);
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
      {show &&
      <div className="ficheContact">
        <h1>Fiche de {currentContact}</h1>
        <div className="leContact">
          <p><strong>Nom : </strong>{infoContact[index].name}</p>
          <p><strong>Descr. : </strong>{infoContact[index].description}</p>
          <p><strong>Type : </strong>{infoContact[index].type}</p>
        </div>
      </div>
      }
    </div>
  );
}


function App() {
  const [lng, setLng] = useState<number>(2);
  const [lat, setLat] = useState<number>(46.95);

  const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
    setLng(e.lngLat.lng);
    setLat(e.lngLat.lat);
    const marker = new Marker()
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
  }

  

  return (
    <div className="App">
      <Map
        onClick={(e) => {handleClick(e)}}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 5.4,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
      </Map>
      <Contacts />
    </div>
  );
}

export default App;

