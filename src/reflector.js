export default class Reflector {
	constructor(map, debug) {
		this.map = map;
		this.debug = debug;
	}

	process(letter) {

		var converted = letter;

		for (var i = 0; i < this.map.length; i++) {
			//Take the char code of the first letter and if it matches, return the char code of the last letter
			if (String.fromCharCode(this.map[i].charCodeAt(0)) == letter) {
				if (this.debug) {
					console.log("DEBUG: reflected letter " + letter + " to " + String.fromCharCode(this.map[i].charCodeAt(1)));
				}

				converted = String.fromCharCode(this.map[i].charCodeAt(1));

			//Take the char code of the laster letter and if it matches, return the char code of the first letter
			} else if (String.fromCharCode(this.map[i].charCodeAt(1)) == letter) {
				if (this.debug) {
					console.log("DEBUG: reflected letter " + letter + " to " + String.fromCharCode(this.map[i].charCodeAt(0)));
				}

				converted = String.fromCharCode(this.map[i].charCodeAt(0));
			}
		}

		return converted
	}
}