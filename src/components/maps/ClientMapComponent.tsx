import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Map as LeafletMap } from 'leaflet';
import styles from './ClientMap.module.css';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
// Use a safer approach to set icon paths that works with TypeScript
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.7.1/dist/images/';

// Define custom icon for better visibility on dark map
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Define blue icon for user location
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface ClientMapComponentProps {
  address: string;
}

interface MapPosition {
  lat: number;
  lng: number;
}

const ClientMapComponent: React.FC<ClientMapComponentProps> = ({ address }) => {
  const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);
  const [userPosition, setUserPosition] = useState<MapPosition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  
  // Default map center (will be overridden if geocoding succeeds)
  const defaultPosition: MapPosition = { lat: 51.505, lng: -0.09 }; // London

  // Get current user position if available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.log('Error getting user location:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Geocode the address to get coordinates
  const geocodeAddress = useCallback(async (addressToGeocode: string) => {
    setIsLoading(true);
    setError(null);

    console.log('Geocoding address:', addressToGeocode);
    
    if (!addressToGeocode || addressToGeocode.trim() === '') {
      console.log('No address provided to geocode');
      setError('No address provided');
      setIsLoading(false);
      return false;
    }

    try {
      // First try OpenStreetMap Nominatim API
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressToGeocode)}`;
      console.log('Fetching from Nominatim:', nominatimUrl);
      
      const response = await fetch(nominatimUrl, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await response.json();
      
      console.log('Nominatim response:', data);
      
      if (data && data.length > 0) {
        const bestMatch = data[0];
        console.log('Best match:', bestMatch);
        
        setMapPosition({
          lat: parseFloat(bestMatch.lat),
          lng: parseFloat(bestMatch.lon)
        });
        
        setIsLoading(false);
        return true;
      } else {
        console.log('No results from Nominatim');
        
        // Fall back to city/region search if exact address fails
        console.log('Trying fallback with city/region extraction');
        
        // Try to extract city or region from the address
        const cityMatch = addressToGeocode.match(/([A-Za-z\s]+),?\s*[A-Z]{2}/);
        if (cityMatch) {
          const cityQuery = cityMatch[1].trim();
          console.log('Extracted city:', cityQuery);
          
          const cityNominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityQuery)}`;
          const cityResponse = await fetch(cityNominatimUrl, {
            headers: { 'Accept-Language': 'en' }
          });
          const cityData = await cityResponse.json();
          
          if (cityData && cityData.length > 0) {
            const cityMatch = cityData[0];
            console.log('City fallback match:', cityMatch);
            
            setMapPosition({
              lat: parseFloat(cityMatch.lat),
              lng: parseFloat(cityMatch.lon)
            });
            
            setIsLoading(false);
            return true;
          }
        }
        
        setError('Could not find location for this address');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Error geocoding address:', err);
      setError('Error looking up address');
      setIsLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // Initialize the map when component mounts
    geocodeAddress(address);
  }, [address, geocodeAddress]);

  if (isLoading) {
    return <div className={styles.loadingMap}>Loading map...</div>;
  }

  if (error) {
    return <div className={styles.mapError}>{error}</div>;
  }

  const position = mapPosition || defaultPosition;
  const zoom = mapPosition ? 15 : 3; // Zoom in if we have a geocoded position

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>, &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        
        {mapPosition && (
          <Marker 
            position={[mapPosition.lat, mapPosition.lng]}
            icon={customIcon}
          >
            <Popup>
              Client address: {address}
            </Popup>
          </Marker>
        )}
        
        {userPosition && (
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={blueIcon}
          >
            <Popup>
              Your location
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ClientMapComponent;
