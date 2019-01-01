
require("babel-core/register")({
	"presets": ["es2015"],
	"plugins": ["transform-class-properties"],
});

require("babel-polyfill")

var assert = require('chai').assert;
var Enigma = require('../src/enigma.js').default;

function randomword(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

function randomTest(count, length){
	for(var i = 0; i < count; i++){
		const word = randomword(length);
		const combo = [randomword(1), randomword(1), randomword(1)];


		enigma.setup(3, combo, "B");
		const encrypt = enigma.encrypt(word);

		enigma.setup(3, combo, "B");
		const decrypt = enigma.decrypt(encrypt)


		assert.equal(decrypt, word);
	}
}


describe('enigma', () => {
	describe('HELLO WORLD', () => {

		beforeEach(() => {
			enigma = new Enigma();
			enigma.setup(3, ["A", "A", "A"], "B");
		});

		it('encrypt', () => {
			const output = enigma.encrypt("HELLOWORLD")
      			assert.equal(output, "TOZQYCVIEN");
    		});

		it('decrypt', () => {
			const output = enigma.decrypt("TOZQYCVIEN");
			assert.equal(output, "HELLOWORLD");
		});

		it('should handle spaces', () => {
			var output = enigma.encrypt("HELLO WORLD")
			enigma.setup(3, ["A", "A", "A"], "B");
			output = enigma.decrypt(output);
			assert.equal(output, "HELLO WORLD");
		});

		it('should handle plugboard', () => {
			enigma.setup(3, ["A", "A", "A"], "B", false, ["TA", "NV"]);
			var output = enigma.encrypt("HELLO WORLD")
			assert.equal(output, "AOZQY CNIEV");

			enigma.setup(3, ["A", "A", "A"], "B", false, ["TA", "NV"]);
			output = enigma.decrypt(output);
			assert.equal(output, "HELLO WORLD");
		})
  	});

	describe("random", () => {

		beforeEach(() => {
			enigma = new Enigma();
		});

		it('1000 short random words', () => {
			randomTest(1000, 5);
		});

		it('100 long random words', () => {
			randomTest(100, 50);
		});

		it('10 super long word', () => {
			randomTest(10, 500);
		});

		it('1 super long word', () => {
			randomTest(1, 5000);
		});
	});
});
