import React from 'react';
import styles from './ClientMap.module.css';
import dynamic from 'next/dynamic';

// Define interface for the component props
interface ClientMapProps {
  address: string;
}

// Define the same props interface for the dynamically loaded component
interface ClientMapComponentProps {
  address: string;
}

// Create a client-side only version of the real map component using dynamic import
// This ensures Leaflet only loads on the client side and prevents SSR errors
const ClientMapComponentWithNoSSR = dynamic<ClientMapComponentProps>(
  () => import('./ClientMapComponent'),
  { 
    ssr: false, // This ensures the component only loads on the client side
    loading: () => <div className={styles.loadingMap}>Loading map...</div>
  }
);

// This is a simple wrapper component that ensures the map only renders on the client side
const ClientMap: React.FC<ClientMapProps> = ({ address }) => {
  return (
    <div className={styles.mapContainer}>
      <ClientMapComponentWithNoSSR address={address} />
    </div>
  );
};

export default ClientMap;
