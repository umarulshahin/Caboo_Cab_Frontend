import { useLoadScript } from "@react-google-maps/api";


const libraries = ["places"];
const apiKey = import.meta.env.VITE_google_map_api_key;


const DriverLocation = () => {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
      });

    const handleDriverLocation = (driverLocation, clientLocation) => {
        return new Promise((resolve, reject) => {
            if (isLoaded && driverLocation && clientLocation) {
                if (window.google && window.google.maps) {
                    const directionsService = new window.google.maps.DirectionsService();
                    const distanceService = new window.google.maps.DistanceMatrixService();
                    const geocoder = new window.google.maps.Geocoder();
    
                    // Create LatLng objects for driver and client locations
                    const driverLatLng = new window.google.maps.LatLng(driverLocation.lat, driverLocation.lng);
                    const clientLatLng = new window.google.maps.LatLng(clientLocation.lat, clientLocation.lng);
    
                    // Request distance and duration
                    const distanceRequest = {
                        origins: [driverLatLng],
                        destinations: [clientLatLng],
                        travelMode: window.google.maps.TravelMode.DRIVING,
                    };
    
                    distanceService.getDistanceMatrix(distanceRequest, (response, status) => {
                        if (status === window.google.maps.DistanceMatrixStatus.OK) {
                            const result = response.rows[0]?.elements[0];
                            
                            // Log result for debugging
                            console.log('Distance Matrix result:', result);
    
                            if (result && result.status === 'OK') {
                                const distance = result.distance;
                                const duration = result.duration;
    
                                // Log distance and duration for debugging
                                console.log('Distance:', distance);
                                console.log('Duration:', duration);
    
                                if (distance && duration) {
                                    const distanceInKm = distance.value / 1000;
                                    const durationInMinutes = duration.value / 60; // Convert to minutes
    
                                    // Request directions to get the route
                                    const directionsRequest = {
                                        origin: driverLatLng,
                                        destination: clientLatLng,
                                        travelMode: window.google.maps.TravelMode.DRIVING,
                                    };
    
                                    directionsService.route(directionsRequest, (result, status) => {
                                        if (status === window.google.maps.DirectionsStatus.OK) {
                                            // Geocode the locations to get place names
                                            const geocodeLocation = (latLng) => {
                                                return new Promise((resolve, reject) => {
                                                    geocoder.geocode({ location: latLng }, (results, status) => {
                                                        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                                                            resolve(results[0].formatted_address);
                                                        } else {
                                                            reject(`Geocode failed due to ${status}`);
                                                        }
                                                    });
                                                });
                                            };
    
                                            Promise.all([
                                                geocodeLocation(driverLatLng),
                                                geocodeLocation(clientLatLng),
                                            ])
                                            .then(([driverAddress, clientAddress]) => {
                                                resolve({
                                                    driverLocation: {
                                                        lat: driverLocation.lat,
                                                        lng: driverLocation.lng,
                                                        address: driverAddress,
                                                    },
                                                    clientLocation: {
                                                        lat: clientLocation.lat,
                                                        lng: clientLocation.lng,
                                                        address: clientAddress,
                                                    },
                                                    distance: {
                                                        text: distance.text, 
                                                        value: distance.value
                                                    },
                                                    duration: {
                                                        text: duration.text, 
                                                        value: duration.value
                                                    }
                                                });
                                            })
                                            .catch(error => {
                                                reject(`Geocoding failed: ${error}`);
                                            });
    
                                        } else {
                                            reject(`Directions request failed due to ${status}`);
                                        }
                                    });
                                } else {
                                    reject('Distance or duration data is not available.');
                                }
                            } else {
                                reject(`Distance request failed due to ${result?.status || 'unknown error'}`);
                            }
                        } else {
                            reject(`DistanceMatrixService failed due to ${status}`);
                        }
                    });
                } else {
                    reject("Google Maps API is not loaded.");
                }
            } else {
                reject('Driver and client locations are required');
            }
        });
    };
    
    
    return {handleDriverLocation}
}

export default DriverLocation

