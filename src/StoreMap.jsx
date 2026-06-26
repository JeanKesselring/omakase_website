import L from 'leaflet';
import { useEffect, useRef } from 'react';

const defaultCenter = [46.8182, 8.2275];

export function StoreMap({ shops, emptyLabel }) {
  const nodeRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return;

    mapRef.current = L.map(nodeRef.current, {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView(defaultCenter, 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const markerIcon = L.divIcon({
      className: 'omakase-marker',
      html: '<span>お</span>',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const locatedShops = shops.filter((shop) => Number.isFinite(shop.lat) && Number.isFinite(shop.lng));

    locatedShops.forEach((shop) => {
      const marker = L.marker([shop.lat, shop.lng], { icon: markerIcon })
        .addTo(mapRef.current)
        .bindPopup(`<strong>${shop.name}</strong><br>${[shop.city, shop.country].filter(Boolean).join(', ')}`);
      markersRef.current.push(marker);
    });

    if (locatedShops.length > 0) {
      const bounds = L.latLngBounds(locatedShops.map((shop) => [shop.lat, shop.lng]));
      mapRef.current.fitBounds(bounds.pad(0.25), { maxZoom: 13 });
    } else {
      mapRef.current.setView(defaultCenter, 7);
    }
  }, [shops]);

  return (
    <div className="map-shell">
      <div ref={nodeRef} className="store-map" aria-label="Store map" />
      {shops.length === 0 && <div className="map-empty">{emptyLabel}</div>}
    </div>
  );
}
