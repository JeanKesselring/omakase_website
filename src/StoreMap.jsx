import L from 'leaflet';
import { useEffect, useRef } from 'react';
import favicon from '../Assets/Web/favicon.png';

const defaultCenter = [46.8182, 8.2275];
const markerSize = 36;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createMarkerIcon(isSelected = false) {
  return L.icon({
    iconUrl: favicon,
    className: `omakase-marker-icon${isSelected ? ' is-selected' : ''}`,
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerSize / 2, markerSize / 2],
    popupAnchor: [0, -(markerSize / 2)]
  });
}

function getPopupHtml(shop, labels) {
  const location = [shop.city, shop.country].filter(Boolean).join(', ');
  const address = [shop.address, location].filter(Boolean).map(escapeHtml).join('<br>');
  const links = [
    shop.productUrl && `<a class="shop-popup-button primary" href="${escapeHtml(shop.productUrl)}" target="_blank" rel="noreferrer">${escapeHtml(labels.buyOnline)}</a>`,
    shop.websiteUrl && `<a class="shop-popup-button" href="${escapeHtml(shop.websiteUrl)}" target="_blank" rel="noreferrer">${escapeHtml(labels.website)}</a>`
  ].filter(Boolean).join('');

  return `
    <div class="shop-popup">
      <div class="shop-popup-heading">
        <img src="${favicon}" alt="" />
        <div>
          <strong>${escapeHtml(shop.name)}</strong>
          ${location ? `<span>${escapeHtml(location)}</span>` : ''}
        </div>
      </div>
      ${address ? `<p>${address}</p>` : ''}
      ${shop.sellsOnline ? `<span class="shop-popup-badge">${escapeHtml(labels.online)}</span>` : ''}
      ${links ? `<div class="shop-popup-actions">${links}</div>` : ''}
    </div>
  `;
}

export function StoreMap({
  shops,
  emptyLabel,
  selectedShopId,
  onSelectShop,
  popupLabels = { buyOnline: 'Buy online', website: 'Website', online: 'Online available' }
}) {
  const nodeRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());

  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return;

    mapRef.current = L.map(nodeRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView(defaultCenter, 7);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(mapRef.current);

    // Leaflet caches the container size at init; recompute when it changes
    // so tiles don't render cropped.
    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    resizeObserver.observe(nodeRef.current);

    return () => {
      resizeObserver.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    const locatedShops = shops.filter((shop) => Number.isFinite(shop.lat) && Number.isFinite(shop.lng));

    locatedShops.forEach((shop) => {
      const marker = L.marker([shop.lat, shop.lng], {
        icon: createMarkerIcon(false),
        riseOnHover: true
      })
        .addTo(mapRef.current)
        .bindPopup(getPopupHtml(shop, popupLabels));

      marker.on('click mouseover', () => onSelectShop?.(shop.id));
      markersRef.current.set(shop.id, marker);
    });

    if (locatedShops.length > 0) {
      const bounds = L.latLngBounds(locatedShops.map((shop) => [shop.lat, shop.lng]));
      mapRef.current.fitBounds(bounds.pad(0.25), { maxZoom: 13 });
    } else {
      mapRef.current.setView(defaultCenter, 7);
    }
  }, [shops, popupLabels, onSelectShop]);

  useEffect(() => {
    markersRef.current.forEach((marker, shopId) => {
      const isSelected = shopId === selectedShopId;
      marker.setIcon(createMarkerIcon(isSelected));
      marker.setZIndexOffset(isSelected ? 1000 : 0);

      if (isSelected && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    });
  }, [selectedShopId]);

  return (
    <div className="map-shell">
      <div ref={nodeRef} className="store-map" aria-label="Store map" />
      {shops.length === 0 && <div className="map-empty">{emptyLabel}</div>}
    </div>
  );
}
