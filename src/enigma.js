import Rotor from './rotor';
import Reflector from './reflector';
import Iterator from './iterator';

export default class Enigma {

	static rotors = [{
			type: "III",
			map: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
			step: "W"
		},
		{
			type: "II",
			map: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
			step: "F"
		},
		{
			type: "I",
			map: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
			step: "R"
		},
	]

	//TODO: I think this is the only reflector?
	static reflectors = {
		"B": {
			type: "B",
			map: ["AY", "BR", "CU", "DH", "EQ", "FS", "GL", "IP", "JX", "KN", "MO", "TZ", "VW"]
		}
	}


	setup(num_rotors, settings, reflector, debug, pluboard) {
		this.debug = debug;

		this.rotors = [];
		for (var i = 0; i < num_rotors; i++) {
			this.rotors.push(new Rotor(Enigma.rotors[i].map, settings[i], i, Enigma.rotors[i].step, debug));
		}

		this.reflector = new Reflector(Enigma.reflectors[reflector].map, debug);

		//Reflectors and plugboards do the exact same thing but with a different map
		pluboard = pluboard || ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ", "KK", "LL", "MM", "NN", "OO", "PP", "QQ", "RR", "SS", "TT", "UU", "VV", "WW", "XX", "YY", "ZZ"];
		this.plugboard = new Reflector(pluboard, debug);

		this.iterator = new Iterator(debug);

	}

	encrypt(word) {
		word = Array.from(word);

		let encrypted = "";

		for (var i = 0; i < word.length; i++) {
			let letter = word[i];
			if (letter != " ") {

				this.iterator.iterate(this.rotors);

				let output = letter;

				output = this.plugboard.process(output);

				for (var j = 0; j < this.rotors.length; j++) {
					output = this.rotors[j].rotate(output, true);
				}

				output = this.reflector.process(output);

				//Go through the rotors again except backwards
				for (var j = this.rotors.length - 1; j >= 0; --j) {
					output = this.rotors[j].rotate(output, false);
				}

				output = this.plugboard.process(output);

				letter = output;

				if (this.debug) {
					console.log("DEBUG: Done processing letter. Output: " + letter);
				}

				encrypted += letter;


			} else {
				encrypted += " ";
			}
		}

		if (this.debug) {
			console.log("DEBUG: Done processing. output: " + encrypted);
		}


		for (var i = 0; i < this.rotors.length; i++) {
			if (this.debug) {
				console.log("DEBUG: rotor position: " + this.rotors[i].position);
			}
		}

		return encrypted;
	}

	decrypt(word) {
		return this.encrypt(word);
	}

	//TODO: Clean this up
	//This is an experimental approach to bruteforcing an enigma using webworkers
	bruteforce_noplugboard(word) {
		return new Promise(function (resolve, reject) {
			var workers = [];

			var worker = function () {
				//HACK: Webworkers need to load a local script
				importScripts('http://localhost:8080/enigma.js');
				importScripts('http://localhost:8080/wordlist.js');
				self.addEventListener('message', function (e) {

					var enigma = new self.Enigma.default();
					
					//TODO: Pass this stuff here somehow
					enigma.setup(3, e.data.code, "B", false);

					var output = enigma.decrypt(e.data.text);

					var list = output.split(" ");
					var found = true;
					for (var i = 0; i < list.length; i++) {
						if (found) {
							found = Word_List.isInList(list[i]);
						}
					}

					self.postMessage(JSON.stringify({
						output: output,
						code: e.data.code,
						found: found
					}));
				}, false);
			}


			var workerData = new Blob(['(' + worker.toString() + ')()'], {
				type: "javascript/worker"
			});

			var results = [];
			var count = 0;

			//16 is the max workers for chrome
			for (var i = 0; i < 16; i++) {
				var worker = new Worker(window.URL.createObjectURL(workerData));
				workers.push(worker);

				worker.onmessage = function (e) {
					count--
					if (JSON.parse(e.data).found) {
						results.push([JSON.parse(e.data).code, JSON.parse(e.data).output])
					}

					if (!count) {
						for (var j = 0; j < workers.length; j++) {
							workers[j].terminate();
						}
						resolve(results);
					}
				}
			}

			const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			//FIXME: This only works for 3 rotors
			for (var i = 0; i < alph.length; i++) {
				var rotor3 = alph[i];
				for (var j = 0; j < alph.length; j++) {
					var rotor2 = alph[j];
					for (var k = 0; k < alph.length; k++) {
						var rotor1 = alph[k];

						count++;

						workers[Math.floor(Math.random() * 15) + 1].postMessage({
							code: [rotor3, rotor2, rotor1],
							text: word
						});

					}
				}
			}
		});
	}
}