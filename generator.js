// ywP-MUA-pA2-Awn
// mycHum-ravwo1-zadcug
// кол-во отрезков
// длина отрезков
// делаем, в итоге, 4 отрезка по 4 элемента
// вроде убрал все похожие знаки
// 1234-5678-9012-3456
// 16 symbols + 3 "-"

let len_cut = 4  // длина маленького отрезочка
let count_len = 3    // количество отрезков

let alphabet = [
	"A", "B", "C", "D", "E", "F", "G", "H",
	"J", "K", "L", "M", "N", "P", "Q", "R",
	"S", "T", "U", "V", "W", "X", "Y", "Z",
	
	"a", "b", "c", "d", "e", "f", "g", "h",
	"j", "k", "m", "n", "o", "p", "q", "r",
	"s", "t", "u", "v", "w", "x", "y", "z",
	
	"2", "3", "4", "5", "6", "7", "8", "9",
	"2", "3", "4", "5", "6", "7", "8", "9",
	"2", "3", "4", "5", "6", "7", "8", "9"
];

function b_click(){
	let field_to_pass = document.getElementById("luhn");

	/*
	let some_pass = "";
	let counter = 0;
	let count_sumbols = 0;
	// while (some_pass.length < all_len + all_len % count_cut) {
	while (count_sumbols < all_len + all_len % count_cut) {
		if (counter === count_cut) {
			some_pass += "-";
			counter = 0;
		}
		else {
			some_pass += alphabet[Math.floor(Math.random() * alphabet.length)];
			counter ++;
			count_sumbols ++;

		}
		// some_pass += alphabet[Math.floor(Math.random() * alphabet.length)];
		// counter ++
	}
	*/
	
	let some_pass = ""
	let coun_len_in = 0
	while (coun_len_in < count_len) {
		let small_pass = "";
		while (small_pass.length < len_cut) {
			small_pass += alphabet[Math.floor(Math.random() * alphabet.length)];
		}
		some_pass += small_pass;
		if (coun_len_in < count_len - 1) {
			some_pass += "-";
		}
		coun_len_in += 1;
	}

	field_to_pass.value = some_pass;

	let dummy = document.createElement("textarea");
	document.body.appendChild(dummy);
	dummy.value = some_pass;
	dummy.select();
	document.execCommand("copy");
	document.body.removeChild(dummy);
}
