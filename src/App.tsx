import './App.css';
import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import {Map, Marker, Popup} from 'react-map-gl';

const MAPBOX_TOKEN : string = "pk.eyJ1IjoiZWxpaGF6YSIsImEiOiJjbDc0cnR5NjMwODcxM29wNnNqaGk1MnB3In0.O2YDd_RJn0jlC6izyWfCjA";

// Component that renders info about selected Contact
// Props is the name of the Contact
function Fiche(props: {name: string}) {
  const [index, setIndex] = useState<number>(0);
  const tab_contacts : {name: string, description: string, type: string}[] = JSON.parse(localStorage.getItem('array_contacts') || '[]');
  useEffect(() => {
    setIndex(tab_contacts.findIndex(contact => contact.name === props.name));
  } , [props.name]);

  return (
    <div className="ficheContact">
        <h1>Fiche de {tab_contacts[index]?.name}</h1>
        <div className="leContact">
          <p><strong>Nom : </strong>{tab_contacts[index]?.name}</p>
          <p><strong>Descr. : </strong>{tab_contacts[index]?.description}</p>
          <p><strong>Type : </strong>{tab_contacts[index]?.type}</p>
        </div>
      </div>
  )
}

// Component that displays the list of Contacts
function Contacts(props: {name: string}) {
  const [infoContact, setInfoContact] = useState<{name: string, description: string, type: string}[]>([
    {name: 'Prupe Corp.', description: 'Prupe Corp. is a French multinational conglomerate headquartered in Paris, France', type: 'Entreprise'},
    {name: 'Michel', description: 'Michel is a French mathematician', type: 'Particulier'},
    {name: 'Bizières sur Zoid', description: 'Bizières sur Zoid is a French city in the Loire Valley', type: 'Collectivite'}
  ]);
  
  const [currentContact, setCurrentContact] = useState<string>("");
  const [leNom, setLeNom] = useState<string>(props.name);

  useEffect(() => {
    {localStorage.array_contacts ? JSON.parse(localStorage.getItem('array_contacts') || '[]')
    : localStorage.setItem('array_contacts', JSON.stringify(infoContact))}
    setLeNom(props.name);
  }, [props.name]);

  const tab_contacts : {name: string, description: string, type: string}[] = JSON.parse(localStorage.getItem('array_contacts') || '[]');
  
  const handleClick = (name: string) => {
    setLeNom('');
    setCurrentContact(name);
  }

  return (
    <div className="Contacts">
      <div className="titreContacts">
        <h1>Contacts</h1>
      </div>
      <div className="Contact">
        {tab_contacts[3] ? tab_contacts?.map((contact, index) => (
          <div onClick={() => handleClick(contact.name)} className="Personne" key={index}>
            <p><strong>{contact.name}</strong></p>
          </div>
        ))
      : infoContact?.map((contact, index) => (
        <div onClick={() => handleClick(contact.name)} className="Personne" key={index}>
          <p><strong>{contact.name}</strong></p>
        </div>
      ))}
      </div>
      {leNom ? <Fiche name={leNom}/> : <Fiche name={currentContact}/>}
    </div>
  );
}

// Main component that renders the map
function App() {
  const [lng, setLng] = useState<number>(2);
  const [lat, setLat] = useState<number>(46.95);
  const [currentContact, setCurrentContact] = useState<string>("");
  const tab_contacts : {name: string, description: string, type: string}[] = JSON.parse(localStorage.getItem('array_contacts') || '[]');
  const tab_markers : {longitude: number, latitude: number, name: string}[] = JSON.parse(localStorage.getItem('array_markers') || '[]');
  const [showPopup, setShowPopup] = React.useState(false);

  const [newContactName, setNewContactName] = useState<string>("");
  const [newContactDescription, setNewContactDescription] = useState<string>("");
  const [newContactType, setNewContactType] = useState<string>("Entreprise");

  useEffect(() => {
    {localStorage.array_markers ? JSON.parse(localStorage.getItem('array_markers') || '[]')
    : localStorage.setItem('array_markers', JSON.stringify([]))}
  }, []);

  const handleClick = (name: string) => {
    setShowPopup(true);
    setCurrentContact(name);
  }

  const createNewMarker = (e: mapboxgl.MapLayerMouseEvent) => {
    setLng(e.lngLat.lng);
    setLat(e.lngLat.lat);
    setShowPopup(showPopup => !showPopup);
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
        {tab_markers.map((marker, index) => (
          <Marker onClick={() => handleClick(marker.name)} key={index} longitude={marker.longitude} latitude={marker.latitude}/>
        ))}
        {showPopup && (
        <Popup longitude={lng} latitude={lat} anchor="bottom" onClose={() => {setNewContactName(''); setNewContactDescription(''); setNewContactType('');}}>
          <div className="titrePopup"><h2>Ajouter nouveau contact</h2></div>
          <div className="allInputs">
            <input className="inputName"
              type="text"
              placeholder='Nom'
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
            />
            <textarea className="inputDesc"
              rows={5}
              cols={21}
              placeholder='Description'
              value={newContactDescription}
              onChange={(e) => setNewContactDescription(e.target.value)}
            />
            <form className="inputType">
              <strong>Séléctionner le type de contact :</strong>
              <select value={newContactType} onChange={(e) => setNewContactType(e.target.value)}>
                <option value="Entreprise">Entreprise</option>
                <option value="Particulier">Particulier</option>
                <option value="Collectivité">Collectivité</option>
              </select>
              <button className="btnAdd" onClick={(e) => {
                e.preventDefault();
                const newTabContacts = JSON.stringify([...tab_contacts, {name: newContactName, description: newContactDescription, type: newContactType}]);
                localStorage.setItem('array_contacts', newTabContacts);
                const newTabMarkers = JSON.stringify([...tab_markers, {longitude: lng, latitude: lat, name: newContactName}]);
                localStorage.setItem('array_markers', newTabMarkers);
                setShowPopup(showPopup => !showPopup);
              }
              }>Ajouter</button>
          </form> 
        </div>
        </Popup>)}
      </Map>
    </div>
    {currentContact ? <Contacts name={currentContact}/> : <Contacts name={'Prupe Corp.'}/>}
  </div>
  );
}

export default App;

