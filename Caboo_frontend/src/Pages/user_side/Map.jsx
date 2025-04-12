import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import current_icon from "../../assets/current.png";
import destination_icon from "../../assets/destination.png";
import location_icon from "../../assets/location.png";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addCharges, addDistance, addPlaces } from "../../Redux/RideSlice";

const libraries = ["places"];
const apiKey = import.meta.env.VITE_google_map_api_key;

const pickupIcon = {
  url: location_icon,
  scaledSize: { width: 30, height: 30 },
};

const destinationIcon = {
  url: destination_icon,
  scaledSize: { width: 30, height: 30 },
};

const currentLocationIcon = {
  url: current_icon,
  scaledSize: { width: 40, height: 40 },
};

const MapComponent = ({ locationCoords, destinationCoords }) => {

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [userPosition, setUserPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [validRoute, setValidRoute] = useState(false);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!locationCoords.lat || !destinationCoords.lat) {

      dispatch(addCharges(null));
      dispatch(addDistance(null));
      dispatch(addPlaces(null));
    }
  }, [locationCoords, destinationCoords, dispatch]);

  useEffect(() => {
    if (!locationCoords.lat && !destinationCoords.lat) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
            setUserPosition(currentPosition);
          },
          (error) => {
            console.error("Error getting the current position: ", error);
            toast.error("Unable to retrieve your location. Please ensure location services are enabled.");
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [locationCoords, destinationCoords]);

  useEffect(() => {
    if (isLoaded && locationCoords.lat && destinationCoords.lat) {
      if (window.google && window.google.maps) {
        const directionsService = new window.google.maps.DirectionsService();
        const distanceService = new window.google.maps.DistanceMatrixService();

        const distanceRequest = {
          origins: [new window.google.maps.LatLng(locationCoords.lat, locationCoords.lng)],
          destinations: [new window.google.maps.LatLng(destinationCoords.lat, destinationCoords.lng)],
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        distanceService.getDistanceMatrix(distanceRequest, (response, status) => {
          if (status === window.google.maps.DistanceMatrixStatus.OK) {
            const result = response.rows[0].elements[0];
            if (result.status === 'OK') {
              const distanceInKm = result.distance.value / 1000;
              if (distanceInKm >= 150) {
                toast.error("We're sorry, but this area is currently out of service. Please choose a different location.");
                setRoute([]);
                setDistance(null);
                dispatch(addPlaces(null));
                setValidRoute(false);
              } else if (distanceInKm >= 1) {
                setDistance(distanceInKm.toFixed(2));
                dispatch(addCharges({
                  "bike": Math.round(distanceInKm * 7),
                  "auto": Math.round(distanceInKm * 10),
                  "car": Math.round(distanceInKm * 15),
                }));
                dispatch(addPlaces({
                  "location": locationCoords,
                  "destination": destinationCoords,
                }));

                dispatch(addDistance(result));
                setValidRoute(true);

                const directionsRequest = {
                  origin: new window.google.maps.LatLng(locationCoords.lat, locationCoords.lng),
                  destination: new window.google.maps.LatLng(destinationCoords.lat, destinationCoords.lng),
                  travelMode: window.google.maps.TravelMode.DRIVING,
                };

                directionsService.route(directionsRequest, (result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    const routePath = result.routes[0].overview_path.map((point) => ({
                      lat: point.lat(),
                      lng: point.lng(),
                    }));
                    setRoute(routePath);

                    const bounds = new window.google.maps.LatLngBounds();
                    bounds.extend(new window.google.maps.LatLng(locationCoords.lat, locationCoords.lng));
                    bounds.extend(new window.google.maps.LatLng(destinationCoords.lat, destinationCoords.lng));
                    routePath.forEach((point) => bounds.extend(new window.google.maps.LatLng(point.lat, point.lng)));
                    if (mapRef.current) {
                      mapRef.current.fitBounds(bounds);
                    }
                  } else {
                    console.error(`Directions request failed due to ${status}`);
                  }
                });
              } else {
                toast.warning("Minimum distance of 1 km required");
                setRoute([]);
                setDistance(null);
                dispatch(addPlaces(null));
                setValidRoute(false);
              }
            } else {
              console.error(`Distance request failed due to ${result.status}`);
            }
          } else {
            console.error(`Distance request failed due to ${status}`);
          }
        });
      } else {
        console.error("Google Maps API is not loaded.");
      }
    } else {
      setRoute([]);
      setDistance(null);
    }
  }, [isLoaded, locationCoords, destinationCoords, dispatch]);

  const mapCenter = userPosition || { lat: 51.505, lng: -0.09 };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return (
      <div className="spinner relative w-15 h-15">
        <svg viewBox="25 25 50 50" className="circular absolute inset-0 m-auto">
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="3"
            className="path"
          ></circle>
        </svg>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <GoogleMap
        center={mapCenter}
        zoom={15}
        mapContainerStyle={{ height: "100%", width: "100%" }}
        onLoad={(map) => (mapRef.current = map)}
      >
        {userPosition && !locationCoords.lat && !destinationCoords.lat && (
          <Marker
            position={userPosition}
            icon={currentLocationIcon}
          />
        )}

        {locationCoords.lat && validRoute && (
          <Marker
            position={locationCoords}
            icon={pickupIcon}
          />
        )}

        {destinationCoords.lat && validRoute && (
          <Marker
            position={destinationCoords}
            icon={destinationIcon}
          />
        )}

        {route.length > 0 && validRoute && (
          <Polyline path={route} options={{ strokeColor: "black" }} />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
