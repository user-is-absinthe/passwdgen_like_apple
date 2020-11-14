// ywP-MUA-pA2-Awn
// mycHum-ravwo1-zadcug
// кол-во отрезков
// длина отрезков
// делаем, в итоге, 4 отрезка по 4 элемента
// вроде убрал все похожие знаки
// 1234-5678-9012-3456
// 16 symbols + 3 "-"

let alphabet = [
	"A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N",
	"O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n",
	"o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
	"2", "3", "4", "5", "6", "7", "8", "9"
];

function b_click(){
	let field_to_pass = document.getElementById("luhn");

	let some_pass = "";
	let counter = 0;
	while (some_pass.length < 19) {
		if (counter === 4) {
			some_pass += "-";
			counter = 0;
		}
		some_pass += alphabet[Math.floor(Math.random() * alphabet.length)];
		counter ++
	}

	field_to_pass.value = some_pass;

	/* Select the text field */
	field_to_pass.select();
	field_to_pass.setSelectionRange(0, 99999); /*For mobile devices*/
	/* Copy the text inside the text field */
	document.execCommand("copy");
}
