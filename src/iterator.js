export default class Iterator {
	constructor(debug) {
		this.debug = debug;
	}

	iterate(rotors) {
		//The first rotor always rotates
		let new_position = String.fromCharCode(rotors[0].position.charCodeAt(0) + 1);

		if (rotors[0].position == 'Z') {
			new_position = 'A';
		}
		rotors[0].setPosition(new_position);

		//Start at 1 since we rotated the first one already
		for (var i = 1; i < rotors.length; i++) {
			//If the last rotor has reached its step then rotate this rotor
			if (rotors[i - 1].position == rotors[i - 1].step) {
				if (this.debug) {
					console.log('DEBUG: Shifting next rotor');
				}

				let new_position = String.fromCharCode(rotors[i].position.charCodeAt(0) + 1);

				if (rotors[i].position == 'Z') {
					new_position = 'A';
				}

				rotors[i].setPosition(new_position);
			}
		}
	}
}