/**
* geostats() is a tiny and standalone javascript library for classification 
* Project page - https://github.com/simogeo/geostats
* Copyright (c) 2011 Simon Georget, http://valums.com
* Licensed under the MIT license
*/

var _t = function(str) {
	return str;
};

var geostats = function(a) {

	this.separator = ' - ';
	this.legendSeparator = this.separator;
	this.method  = '';
	this.bounds  = Array();
	this.ranges  = Array();
	this.colors  = Array();
	this.counter = Array();

	if(typeof a !== 'undefined' && a.length > 0) {
		this.serie = a;
	} else {
		this.serie = Array();
	}
	/**
	 * Set a new serie
	 */
	this.setSerie = function(a) {
		this.serie = a;
	};
	
	/**
	 * Set colors
	 */
	this.setColors = function(colors) {
		
		this.colors = colors;
		
	};
	
	/**
	 * Get feature count
	 * With bounds array(0, 0.75, 1.5, 2.25, 3); 
	 * should populate this.counter with 5 keys
	 * and increment counters for each key
	 */
	this.doCount = function() {
		
		if (this._nodata())
			return;
		
		var tmp = this.sorted();
		
		// we init counter with 0 value
		for(i = 0; i < this.bounds.length -1; i++) {
			this.counter[i]= 0;
		}
		
		for(j=0; j < tmp.length; j++) {
			
			// get current class for value to increment the counter
			var cclass = this.getClass(tmp[j]);
			this.counter[cclass]++;

		}

	};
	
	/**
	 * Transform a bounds array to a range array the following array : array(0,
	 * 0.75, 1.5, 2.25, 3); becomes : array('0-0.75', '0.75-1.5', '1.5-2.25',
	 * '2.25-3');
	 */
	this.setRanges = function() {
		
		for (i = 0; i < (this.bounds.length - 1); i++) {
			this.ranges[i] = this.bounds[i] + this.separator + this.bounds[i + 1];
		}
	};

	/** return min value */
	this.min = function() {
		if (this._nodata())
			return;
		var min = this.serie[0];
		for (i = 0; i < this.pop(); i++) {
			if (this.serie[i] < min) {
				min = this.serie[i];
			}
		}
		return min;
	};

	/** return max value */
	this.max = function() {
		if (this._nodata())
			return;
		var max = this.serie[0];
		for (i = 0; i < this.pop(); i++) {
			if (this.serie[i] > max) {
				max = this.serie[i];
			}
		}
		return max;
	};

	/** return sum value */
	this.sum = function() {
		if (this._nodata())
			return;
		var total = 0;
		for (i = 0; i < this.pop(); i++) {
			total += this.serie[i];
		}
		return total;
	};

	/** return population number */
	this.pop = function() {
		if (this._nodata())
			return;
		return this.serie.length;
	};

	/** return mean value */
	this.mean = function() {
		if (this._nodata())
			return;
		return this.sum() / this.pop();
	};

	/** return median value */
	this.median = function() {
		if (this._nodata())
			return;
		val = 0;
		tmp = this.sorted();

		if (tmp.length % 2) {
			val = tmp[(Math.ceil(tmp.length / 2) - 1)];
		} else {
			val = (tmp[(tmp.length / 2) - 1] + tmp[(tmp.length / 2)]) / 2;
		}
		return val;
	};

	/** data test */
	this._nodata = function() {
		if (this.serie.length == 0) {
			alert("Error. You should first enter a serie!");
			return 1;
		} else
			return 0;
	};

	/** return sorted values (as array) */
	this.sorted = function() {
		return this.serie.sort(function(a, b) {
			return a - b;
		});
	};

	/** return all info */
	this.info = function() {
		if (this._nodata())
			return;
		var content = '';
		content += _t('Population') + ' : ' + this.pop() + ' - [' + _t('Min')
				+ ' : ' + this.min() + ' | ' + _t('Max') + ' : ' + this.max()
				+ ']' + "\n";
		content += _t('Mean') + ' : ' + this.mean() + ' - ' + _t('Median')
				+ ' : ' + this.median() + "\n";

		return content;
	};

	/**
	 * Equal intervals discretization Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	this.getEqInterval = function(nbClass) {

		if (this._nodata())
			return;

		this.method = _t('eq. intervals') + ' (' + nbClass + ' ' + _t('classes')
				+ ')';

		var a = Array();
		var val = this.min();
		var interval = (this.max() - this.min()) / nbClass;

		for (i = 0; i <= nbClass; i++) {
			a[i] = val;
			val += interval;
		}

		this.bounds = a;
		this.setRanges();
		
		return a;
	};

	/**
	 * Quantile discretization Return an array with bounds : ie array(0, 0.75,
	 * 1.5, 2.25, 3);
	 */
	this.getQuantile = function(nbClass) {

		if (this._nodata())
			return;

		this.method = _t('quantile') + ' (' + nbClass + ' ' + _t('classes') + ')';

		var a = Array();
		var tmp = this.sorted();

		var classSize = Math.round(this.pop() / nbClass);
		var step = classSize;
		var i = 0;

		// we set first value
		a[0] = tmp[0];

		for (i = 1; i < nbClass; i++) {
			a[i] = tmp[step];
			step += classSize;
		}
		// we set last value
		a.push(tmp[tmp.length - 1]);
		
		this.bounds = a;
		this.setRanges();
		
		return a;

	};
	
	/**
	 * from Mapfish http://old.nabble.com/file/p26421348/GeoStat.js
	 */
	this.getJenks = function(nbClass) {

		if (this._nodata())
			return;

		this.method = _t('Jenks') + ' (' + nbClass + ' ' + _t('classes') + ')';

		if (typeof determineClass != 'function') {
			alert(_t('./lib/jenks.util.js file should be included to use Jenks classification.'));
			return;
		}
		var bounds = [];
		var variation = 1;
		var tmp = this.sorted();

		var nbindividuals = this.pop(); // counts the number of individuals in
										// the dataset

		// premiere discretisation : DISCRETISATION PAR QUANTILE
		// first discretization : Quantile

		// TAILLE DES QUANTILES DE DEPART
		// Size quantile departure
		var sizeClass = Math.round(this.pop() / nbClass);

		// BORNES INITIALES
		// Initial Bounds
		var SizeClassPrevIteration = [];

		for (i = 0; i < nbClass - 1; i++) {
			SizeClassPrevIteration[i] = sizeClass;
		}

		// compte tenu de l'arrondi sur le nombre d'individu par quantile, la
		// derniere classe
		// contient le nombre d'individu qu'il reste. ce n'est pas forcement le
		// meme que les pr�c�dentes
		// given the flare on the number of individual by quantile, the latter
		// class includes the number
		// of individuals remaining
		SizeClassPrevIteration[i] = nbindividuals - (nbClass - 1) * sizeClass;

		// pour chaque iteration, on calcule la distance de chaque individu aux
		// moyennes des
		// classes definies dans l'iteration précédentes.
		// on affecte un individu a la classe dont il est le plus proche de la
		// moyenne.
		// each iteration, for each individual, calculate the distance
		// individual/classes
		// averages defined in the previous iteration
		// it assignes a value to the class which is closest to the average

		var iterations = 0;
		var classAvg = [];

		while (variation == 1) {
			// remise a zero de la variable indiquant s'il y a variation.
			// reset variable wich indicates the variation
			variation = 0;

			// mise a jour nb iteration
			// Updated number of iterations
			iterations++;

			// la discretisation courante s'inspire de la precedente et sera
			// mise a jour plus bas
			// current discretization is inspired by the previous and will be
			// update later
			var classCounterCurrentIteration = SizeClassPrevIteration;

			// indice du premier individu de la classe traitee dans la boucle
			// ci-dessous
			// index of the first individual of the class discussed below
			var minBoundCurrentClass = 0;

			// calcul des moyennes pour chaque classe
			// calculating averages for each class
			for (indClass = 0; indClass < nbClass; indClass++) {

				// calcul de la moyenne
				// averaging
				var nbIndivInClass = SizeClassPrevIteration[indClass];
				var maxBoundCurrentClass = minBoundCurrentClass
						+ nbIndivInClass;
				var class2 = tmp.slice(minBoundCurrentClass,
						maxBoundCurrentClass);
				var avg = mean(class2);

				// mise a jour de la liste de moyenne
				// update the average list
				classAvg[indClass] = avg;

				// mise a jour de la borne inf de la classe a extraire du
				// tableau de valeur
				// update min bound of the class to retrieve to the values grid
				minBoundCurrentClass = minBoundCurrentClass + nbIndivInClass;

			}

			// calcul des distances des individus à chacune des moyennes des
			// classes
			// calculate the distance between individual and averages of each
			// class

			// reinitialisation
			// reset
			var distanceAverages = [];
			// pour chaque valeur de la liste, on calcule la liste des distances
			// entre la valeur
			// et les moyennes des différentes classes
			// for each value in the list, calcultate the distance between the
			// value and averages
			// of each class
			for (indValue = 0; indValue < nbindividuals; indValue++) {

				var currentValue = tmp[indValue];

				// calcule de la distance aux différentes moyennes
				// calculate the distance averages
				for (indClass = 0; indClass < nbClass; indClass++) {
					var subtraction = classAvg[indClass] - currentValue;
					distanceAverages[indClass] = Math.pow(subtraction, 2);
				}
				// on determine le rang de la moyenne la plus proche.
				// c'est equivalent au rang de la classe a laquelle devrait
				// appartenir
				// l'element =>"rang courant"
				// determine the row of the closest average
				// is equivalent to the row of the class which should belong to
				// the element =>
				// "current row"

				var minDistanceAverages = min(distanceAverages);
				var minRowDistanceAverages = array_search(minDistanceAverages,
						distanceAverages);

				// rang de la classe precedemment associee a la valeur courante
				// => "rang precedent"
				// row of the class previoulsy associated to the current value
				// =>"previous row"
				var prevClassRowOfCurrentValue = determineClass(indValue,
						nbClass, SizeClassPrevIteration);

				// mise a jour eventuelle de la repartition des classes.
				// possible updating of the allocation of classes

				// si le "rang courant" est different du "rang precedent", alors
				// on met a jour l'element et $variation passe a true
				// if "current row" and "previous row" are different, element is
				// updated and $variation set to true
				if (minRowDistanceAverages != prevClassRowOfCurrentValue) {
					// le nombre d'element de la classe precedemment associee a
					// la valeur courante diminue
					// element number of the class previoulsy associated to the
					// current value decreases
					classCounterCurrentIteration[prevClassRowOfCurrentValue]--;

					// le nombre d'element de la classe qui sera associee a la
					// valeur courante augmente
					// element number of the class wich will be associated to
					// the current value increases
					classCounterCurrentIteration[minRowDistanceAverages]++;
					variation = 1;
				}
			}

			// pour la prochaine iteration, on met a jour
			// $SizeClassPrevIteration
			// for next iteration, update $SizeClassPrevIteration
			SizeClassPrevIteration = classCounterCurrentIteration;

		}

		bounds = extractBounds(tmp, classCounterCurrentIteration);

		this.bounds = bounds;
		this.setRanges();
		
		return bounds;
	};
	
	/**
	 * Return the class of a given value.
	 * For example value : 6
	 * and bounds array = (0, 4, 8, 12);
	 * Return 2
	 */
	this.getClass = function(value) {

		for(i = 0; i < this.bounds.length; i++) {

			if(value <= this.bounds[i + 1]) {
				return i;
			}
		}
		
		return "Unable to get value's class.";
		
	};

	/**
	 * Return the ranges array : array('0-0.75', '0.75-1.5', '1.5-2.25',
	 * '2.25-3');
	 */
	this.getRanges = function() {
		
		return this.ranges;
		
	};

	/*
	 * Returns the number/index of this.ranges that value falls into
	 */
	this.getRangeNum = function(value) {
		var bounds, i;

		for (i = 0; i < this.ranges.length; i++) {
			bounds = this.ranges[i].split(/ - /);
			if (value <= parseFloat(bounds[1])) {
				return i;
			}
		}
	}
	
	/**
	 * Return an html legend
	 * 
	 */
	this.getHtmlLegend = function(colors, legend, counter, callback) {
		
		var cnt= '';
		
		if(colors != null) {
			ccolors = colors;
		}
		else {
			ccolors = this.colors;
		}
		
		if(legend != null) {
			lg = legend;
		}
		else {
			lg =  'Legend';
		}
		
		if(counter != null) {
			this.doCount();
			getcounter = true;
		}
		else {
			getcounter = false;
		}
		
		if(callback != null) {
			fn = callback;
		}
		else {
			fn = function(o) {return o;};
		}
		
		
		if(ccolors.length < this.ranges.length) {
			alert(_t('The number of colors should fit the number of ranges. Exit'));
			return;
		}
		
		var content  = '<div class="geostats-legend"><div class="geostats-legend-title">' + _t(lg) + '</div>';
		for (i = 0; i < (this.ranges.length); i++) {
			if(getcounter===true) {
				cnt = ' <span class="geostats-legend-counter">(' + this.counter[i] + ')</span>';
			}
			// check if it has separator or not
			if(this.ranges[i].indexOf(this.separator) != -1) {
				var tmp = this.ranges[i].split(this.separator);
				var el = fn(tmp[0]) + this.legendSeparator + fn(tmp[1]);
			} else {
				var el = fn(this.ranges[i]);
			}
			content += '<div><div class="geostats-legend-block" style="background-color:' + ccolors[i] + '"></div> ' + el + cnt + '</div>';
		}
    content += '</div>';
		return content;
	};

	this.getSortedlist = function() {
		return this.sorted().join(', ');
	};

};