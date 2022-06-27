import L from "leaflet";
import * as RL from 'react-leaflet';
import polyline from '@mapbox/polyline';
import Segment from '../Segment';
import React from 'react';

export type Category = 0 | 1 | 2 | 3 | 4 | 5;

const icons = new Map<Category, L.DivIcon>();

export default ({segments}: { segments: Segment[] }) => {

    const getIcon = (c: Category, description: string): L.DivIcon | undefined => {
        if (!icons.has(c)) icons.set(c, L.divIcon({html: description}));
        return icons.get(c);
    };
    let positions = segments.map(_ => [_.start_latlng, _.end_latlng]);
    const latitudes = positions.map(([[start_lat], [end_lat]]) => [start_lat, end_lat]).flat();
    const maxLatitude = Math.max(...latitudes);
    const minLatitude = Math.min(...latitudes);

    const longitudes = positions.map(([[_, start_lng], [__, end_lng]]) => [start_lng, end_lng]).flat();
    const maxLongitude = Math.max(...longitudes);
    const minLongitude = Math.min(...longitudes);

    return <RL.Map bounds={[[minLatitude, minLongitude], [maxLatitude, maxLongitude]]}>
        <RL.TileLayer
            url='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}'
            id="mapbox/outdoors-v11"
            minZoom={1}
            maxZoom={18}
            accessToken="pk.eyJ1IjoiZGF2aWRhcmtlbXAiLCJhIjoidUkwVnZIWSJ9.mCLcitoDx8zvccKNS6-tEA"
        />
        {/*<RL.TileLayer
            url='https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png'
            attribution='Wikimedia Labs | Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            maxZoom={16}
            />*/}
        {segments.map(segment =>
            <React.Fragment key={segment.id}>

                {/*<RL.Marker position={[segment.start_latitude, segment.start_longitude]}>

                </RL.Marker>*/}
                <RL.Polyline
                    color={segment.athlete_segment_stats.effort_count ? 'lime' : 'black'}
                    positions={polyline.decode(segment.map.polyline).map(latLngArray => new L.LatLng(latLngArray[0], latLngArray[1]))}>
                    <RL.Popup>
                        {segment.name}
                    </RL.Popup>
                </RL.Polyline>
            </React.Fragment>
        )
        }
    </RL.Map>;
}
