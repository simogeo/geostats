/**  Methods used for jenks classification */

function min(a){
	
	var min = a[0];
	
	for (i=1; i<a.length; i++){
		if (a[i] < min) {
			min = a[i];
		}
	}
	return min;
}


function mean(a) {
	
  var total = 0;
  
  for (var i=0; i<a.length; i++) {
	total += a[i];
  }
  return (total/ a.length);
}


/**   array_search in javascript -----------------*/
function array_search (needle, haystack, argStrict) {
 // Searches the array for a given value and returns the corresponding key if successful 
//
// ex : array_search ('string' ou chiffre, tableau)
// version: 909.322
// discuss at: http://phpjs.org/functions/array_search
// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// +      input by: Brett Zamir (http://brett-zamir.me)
// +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
// *     example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
// *     returns 1: 'surname'
	
	var strict = !!argStrict;
	var key = '';
	
	for (key in haystack) {
		if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
			return key;
	}
}

return false;
}

/**  function determineClass */
function determineClass(indVal,nbClass,classCounterTab){

	// pour chaque classe, on détermine les rangs des valeurs min et max et on
	// regarde si l'indice est compris dans la fourchette
	// for each class, min and max ranks values are set and determining whether
	// the index is inside
	
	var rgMin = 0;
	var rgMax = classCounterTab[0]-1;
	var indClass;
	for(i=0; i<nbClass; i++){
		if( (indVal>=rgMin) && (indVal<=rgMax) ){			
			indClass = i;
		}

		// mise a jour des rangs min et max
		rgMin = rgMin + classCounterTab[i];
		rgMax = rgMin + classCounterTab[i+1] -1;

	}

	return indClass;
}

/**  function extractBounds */
// Role : cette fonction determine, à partir de la liste "compteurClasse" donnée par jenks, 
// la liste des bornes des différentes classe
// Aim : this function set with "classCounter" given by Jenks, the classes list of bounds 

function extractBounds(values, classCounter){


	var nbindividuals = values.length;
	var nbClass = classCounter.length;

	values.sort(function(a,b) {return a - b;});

	var listBounds = [];
	var indBounds = 0;
	
	for(indClass=0;indClass<nbClass;indClass++){
		listBounds[indClass] = values[indBounds];
		indBounds = indBounds + classCounter[indClass];
	}

	listBounds[nbClass] = values[nbindividuals-1];

	return listBounds;
}