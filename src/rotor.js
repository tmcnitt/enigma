export default class Rotor {

	static alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

	constructor(map, position, ring, step, debug) {
		//conversion table for the letters.
		this.map = map;

		//The position letter of the rotor.
		this.position = position;

		//The inital ring position
		this.ring = ring;

		//The character to to rotate the next rotor on
		this.step = step;

		this.debug = debug;
	}

	rotate(letter, increment) {
		if (this.debug) {
			console.log("DEBUG: rotating " + letter + " using " + this.map + " map and position " + this.position + " and ring " + this.ring);
		}

		const alphabet = Array.from(Rotor.alphabet);
		const map = Array.from(this.map);

		let output = letter;

		//Start off by rotating the letter for the position
		output = this.convertLetter(output, this.position.charCodeAt(0) - 65);

		//Then rotate the letter for the ring offset
		output = this.convertLetter(output, this.ring);


		//reflect output to rotor map
		if (increment) {
			output = map[(output.charCodeAt(0) - 65)];
		} else {
			output = String.fromCharCode(65 + map.indexOf(output));
		}

		//Do the same on the reflected value
		output = this.convertLetter(output, -(this.position.charCodeAt(0) - 65));
		output = this.convertLetter(output, -this.ring);

		if (this.debug) {
			console.log("DEBUG: Done rotating letter " + letter + " output " + output);
		}

		return output;
	}

	setPosition(position) {
		if (this.debug) {
			console.log("DEBUG: setting position to " + position);
		}

		this.position = position;
	}

	convertLetter(letter, number) {
		var letternum = letter.charCodeAt(0) - 65;
		letternum += 26;
		letternum += number;
		letternum %= 26;
		return String.fromCharCode(65 + letternum);
	}

}