var object = {};
var saved = {}; // name: [password, code]
var passwordCount = 0;
var colCount;

// Creates a randomly generated code. Assigns an object to the 'object' variable that has 
// the alphabet as the keys and each letter's newly assigned value as values. It populates 
// the html table with these values.
function createCode() {
	var alphabet = "abcdefghijklmnopqrstuvwxyz";
	var options = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&<>~".split("");
	var random;
	for (var i = 0; i < alphabet.length; i++) {
		random = Math.floor(Math.random() * options.length);
		object[alphabet[i]] = options[random];
		options.splice(random, 1);
	}
	createTable();
}

// Collects information from user about what to name the current code and what the password
// will be. It then saves this information in the object 'saved' with the name as the key and 
// an array with the password and code as the value.
function saveCode() {
	var nameArr = [];
	var password = "";	
	var finalArr = [];
	var names = [];	
	// Ask what the user will name the code.
	var name = prompt("Please name this code.");
	// If they don't enter anything, tell them to and repeat the previosu step.
	if (name.length === 0) {
		alert("Please enter something.");
		return saveCode();
	}
	// Populate the 'names' array with the names of all the saved codes.
	for (var key in saved) {
		names.push(key);
	}
	// If the user entered a name that already exists, tell them it is taken and repeat the 
	// previous steps.
	for (var i = 0; i < names.length; i++) {
		if (names[i] === name) {
			alert("That name is taken.");
			return (saveCode());
		}
	}
	password = choosePassword();
	finalArr.push(password);
	finalArr.push(object);
	saved[name] = finalArr;
}

// Asks the user to choose a password. Asks them to enter the password again to confirm it 
// is correct. Compares the two inputs. If they match, it returns the password. If they don't
// it informs the user they didn't match and repeats itself until they do.
function choosePassword() {
	var password1 = prompt("Choose a password.");
	var password2 = prompt("Confirm password.");
	if (password1 === password2) {
		return password1;
	} else {
		alert("Your passwords did not match.")
		return choosePassword();
	}
}

// Populates the html table with values from the 'object' object.
function createTable() {
	var count = 0;
	var position = gridPosition(count);
	for (var key in object) {	
		document.getElementById(count).innerHTML = key + "  :  " + object[key];
		count ++;	
	}
}

// Takes the count from the create(Table) and returns an array that acts as coordinates (row, col) 
// to that number's position on the grid.
function gridPosition(num) {
	var final=[];
	if (num < 4) {
		final.push(num)
		final.push(colCount);
		colCount = 0;	
		return final;
	}
	colCount++;
	var value = num - 4;
	return gridPosition(value);
}

// Accepts a string of words that has no punctuation or numbers and uses the current code ('object')
// to change the normal letters to their newly assigned value.
function encrypt() {
	var final = "";
	var count = 0;
	var str = document.getElementById("inputEncrypt").value;
	str = str.toLowerCase();
	// Encode the string using 'object' if the character is a letter. If it is a space, add a space.
	// If there are punctuation or numbers in the string, tell the user to remove them.
	for (var i = 0; i < str.length; i++) {
		if (str[i].search(/[(a-z)]/gi) > -1) {
			final += object[str[i]];
		} else if (str[i] === " ") {
			final += " ";
		} else {
			final = "Remove all punctuation and numbers.";
			break;
		}
	}
	// If there is no current code:
	if (Object.getOwnPropertyNames(object).length === 0) {
		final = "Generate a code.";
	// If there is no text entered:
	} else if (str.length === 0) {
		final = "Enter text to encrypt.";
	}
	
	document.getElementById("outputEncrypt").innerHTML = final;
}

// Accepts a string and uses the current code ('object') to decode it.
function decrypt() {
	var final = "";
	var count = 0;
	var alpha = "";
	var other = "";
	var str = document.getElementById("inputDecrypt").value;
	str = str.toLowerCase();
	// Create an array of the two elements of the code (the alphabet and the new values).
	for (var key in object) {
		alpha += key;
		other += object[key];
	}
	// Go through the string and replace the values with the original letters according to
	// 'object'. If there is a space, leave it as a space. If a character in the string is
	// not present in the code, tell the user it was invalid input.
	for (var i = 0; i < str.length; i++) {
		if (str[i] === " ") {
			final += " ";
		} else {
			var index = other.indexOf(str[i]);
			// If there are characters entered that are not part of the code:
			if (index === -1) {
				final = "Invalid input detected for this code.";
				break;
			} else {
				final += alpha[index];
			}
		}
	}
	// If there is no current code.
	if (Object.getOwnPropertyNames(object).length === 0) {
		final = "Generate a code."
	// If there is no text entered.
	} else if (str.length === 0) {
		final = "Enter text to decrypt."
	}	
	
	document.getElementById("outputDecrypt").innerHTML = final;
}

// Asks the user for the name of the code they are searching for. If there is a saved code by that
// name, it asks the user for the password. If not, it tells them there is no code by that name and 
// asks for the name again. If the user gives the right password, the saved code becomes the current
// code and the html table is populated with values from 'object'.
// ****** There is an error somewhere in this code. The current code does not take on the saved code
// value. Needs to be corrected. **********
function findSaved() {
	var names = [];
	for (var key in saved) {
		names.push(key);
	}	

	var name = findName(names);
	var code = checkPassword(name);

	object = code;

	createTable();	
}

// Asks the user for the name of the code they are looking for. If there is a saved code with that name,
// it returns the name. If not, it tells the user there is no code by that name and asks for the name again.
function findName(names) {
	var name = prompt("What is the name of the code you are looking for? Type 'stop' to make it stop.");
	for (var i = 0; i < names.length; i++) {
		if (names[i] === name) {
			return name;
		} else if (name === "stop") {
			return 1;
		}
	}
	alert("There is no code by that name.");
	findName();
}

// Asks the user for the password. If the password is correct, tell them it is correct and return the
// object representing the saved code. If the password is incorrect, let the user try to enter it two 
// more times. After three failed attempts, tell the user they man not access the code.
function checkPassword(name) {
	var password = prompt("What is the password?");
	var password2 = "";
	for (var key in saved) {
		if (key === name) {
			password2 = saved[key][0];
			if (password === password2) {
				alert("Correct")
				return saved[key][1];
			} else if (passwordCount < 3) {
				alert("That password is incorrect.");
				passwordCount++;
				return checkPassword(name);
			} else {
				alert ("I'm sorry, you can not access this code.");
				return;
			}
		}
	}
}
























