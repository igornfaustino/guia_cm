import React, {Component} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const mapaConfig = require('../config/mapsConfig.js');
// module.exports = {
// 	apiKey: '.dfjalkdfjlaksdjfladjflajdslaldfjl'
// }

const EstiloMapa={ height:'70%', width:'60%'};

export class Mapa extends Component {
	render() {
		return (
			<Map google={this.props.google} zoom={14} initialCenter= {{ lat: -24.043411, lng:-52.378299 }} className="map">
				{/* marcador tem posição inicial igual a posição inicial do mapa
				mas pode ser modificada usando position*/}
				<Marker position = {{ lat: -24.060904, lng: -52.386995 }} onClick={this.onMarkerClick}
				name={'Current location'} />
			</Map>
		);
	}
}

export default GoogleApiWrapper({
	apiKey: mapaConfig.apiKey
})(Mapa)