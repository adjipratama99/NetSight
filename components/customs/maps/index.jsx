import { useState, useRef, useCallback } from "react"
import Mapbox, { FullscreenControl, NavigationControl } from "react-map-gl"

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

export function Map ({
  children,
  className,
  initialViewState,
  height,
  mapStyle,
  control = true,
  fullScreen = true,
  ref,
  ...props
}) {
  const mapRef = useRef()
  const [viewState, setViewState] = useState(initialViewState ? initialViewState : {
    latitude: -1.2448863,
    longitude: 118.3804682,
    zoom: 1.5
  });

  const onMapLoad = useCallback(() => {
    // At low zooms, complete a revolution every two minutes.
    const secondsPerRevolution = 120;
    // Above zoom level 5, do not rotate.
    const maxSpinZoom = 5;
    // Rotate at intermediate speeds between zoom levels 3 and 5.
    const slowSpinZoom = 3;
    
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      const zoom = mapRef.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          // Slow spinning at higher zooms
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = mapRef.current.getCenter();
        center.lng -= distancePerSecond;
        // Smoothly animate the map over one second.
        // When this animation is complete, it calls a 'moveend' event.
        mapRef.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Pause spinning on interaction
    mapRef.current.on('mousedown', () => {
      userInteracting = true;
    });

    // Restart spinning the globe when interaction is complete
    mapRef.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });

    // These events account for cases where the mouse has moved
    // off the map, so 'mouseup' will not be fired.
    mapRef.current.on('dragend', () => {
      userInteracting = false;
      spinGlobe();
    });
    mapRef.current.on('pitchend', () => {
      userInteracting = false;
      spinGlobe();
    });
    mapRef.current.on('rotateend', () => {
      userInteracting = false;
      spinGlobe();
    });

    // When animation is complete, start spinning if there is no ongoing interaction
    mapRef.current.on('moveend', () => {
      spinGlobe();
    });

    spinGlobe()
  }, []);

  return (
    <Mapbox
      reuseMaps
      id={props.id ? props.id : "map"}
      style={{ width: "100%", height }}
      mapboxAccessToken={accessToken}
      mapStyle={mapStyle ? mapStyle : "mapbox://styles/mapbox/streets-v11"}
      attributionControl={false}
      projection="globe"
      ref={mapRef}
      // onLoad={onMapLoad}
      onMove={e => setViewState(e.viewState)}
      {...viewState}
      {...props}
    >
      {children}
      {control && <NavigationControl />}
      {fullScreen && <FullscreenControl />}
    </Mapbox>
  )
}