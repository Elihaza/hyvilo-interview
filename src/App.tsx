import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { MapProvider , Map, Marker, Popup} from 'react-map-gl';
// import { setMaxListeners } from 'events';
// import { createOptimisticUniqueName, sortAndDeduplicateDiagnostics } from 'typescript';

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
        <h1>Fiche de {tab[index]?.name}</h1>
        <div className="leContact">
          <p><strong>Nom : </strong>{tab[index]?.name}</p>
          <p><strong>Descr. : </strong>{tab[index]?.description}</p>
          <p><strong>Type : </strong>{tab[index]?.type}</p>
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
  
  let tab : {name: string, description: string, type: string}[] = infoContact;
  console.log(tab, '1erefious');
  
  const [currentContact, setCurrentContact] = useState<string>("");
  // const [show, setShow] = useState<boolean>(false);
  // const [index, setIndex] = useState<number>(0);
  const [leNom, setLeNom] = useState<string>(props.name);

  useEffect(() => {
    localStorage.setItem('my_array', JSON.stringify(infoContact));
    setLeNom(props.name);
    console.log('la');
  }, [props.name]);

  tab = JSON.parse(localStorage.getItem('my_array') || '[]');
  
  const handleClick = (name: string) => {
    setLeNom('');
    // setShow(true);
    setCurrentContact(name);
    // setIndex(contacts.findIndex(contact => contact.name === name));
  }

  return (
    <div className="Contacts">
      <div className="titreContacts">
        <h1>Contacts</h1>
      </div>
      <div className="Contact">
        {tab[3] ? tab?.map((contact, index) => (
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


function App() {
  const [lng, setLng] = useState<number>(2);
  const [lat, setLat] = useState<number>(46.95);
  const [currentContact, setCurrentContact] = useState<string>("");
  const tab : {name: string, description: string, type: string}[] = JSON.parse(localStorage.getItem('my_array') || '[]');
  const [showPopup, setShowPopup] = React.useState(false);

  const [newContactName, setNewContactName] = useState<string>("");
  const [newContactDescription, setNewContactDescription] = useState<string>("");
  const [newContactType, setNewContactType] = useState<string>("Entreprise");

  const handleClick = (name: string) => {
    // setShow(true);
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
              const newTab = JSON.stringify([...tab, {name: newContactName, description: newContactDescription, type: newContactType}]);
              localStorage.setItem('my_array', newTab);
              setShowPopup(showPopup => !showPopup);
            }
            }>Ajouter</button>
        </form> 
      </div>
      </Popup>)}
      </Map>
      
    </div>
    {lng} {lat}
    
    {currentContact ? <Contacts name={currentContact}/> : <Contacts name={'Prupe Corp.'}/>}
    {/* <div className="contacts">{show && <Fiche name={currentContact}/>}</div> */}
    
  </div>
  );
}

export default App;

