var _ = function(str) {
	return str;
};

var geostats = {

	serie : Array(),
	separator : ' - ',
	method : '',

	/** set a new serie */
	setSerie : function(a) {
		this.serie = a;
	},

	/** return min value */
	min : function() {
		if (this._nodata())
			return;
		var min = this.serie[0];
		for (i = 0; i < this.pop(); i++) {
			if (this.serie[i] < min) {
				min = this.serie[i];
			}
		}
		return min;
	},

	/** return max value */
	max : function() {
		if (this._nodata())
			return;
		var max = this.serie[0];
		for (i = 0; i < this.pop(); i++) {
			if (this.serie[i] > max) {
				max = this.serie[i];
			}
		}
		return max;
	},

	/** return sum value */
	sum : function() {
		if (this._nodata())
			return;
		var total = 0;
		for (i = 0; i < this.pop(); i++) {
			total += this.serie[i];
		}
		return total;
	},

	/** return population number */
	pop : function() {
		if (this._nodata())
			return;
		return this.serie.length;
	},

	/** return mean value */
	mean : function() {
		if (this._nodata())
			return;
		return this.sum() / this.pop();
	},

	/** return median value */
	median : function() {
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
	},

	/** data test */
	_nodata : function() {
		if (this.serie.length == 0) {
			alert("Error. You should first enter a serie!");
			return 1;
		} else
			return 0;
	},

	/** return sorted values (as array) */
	sorted : function() {
		return this.serie.sort(function(a, b) {
			return a - b;
		});
	},

	/** return all info */
	info : function() {
		if (this._nodata())
			return;
		var content = '';
		content += _('Population') + ' : ' + this.pop() + ' - [' + _('Min')
				+ ' : ' + this.min() + ' | ' + _('Max') + ' : ' + this.max()
				+ ']' + "\n";
		content += _('Mean') + ' : ' + this.mean() + ' - ' + _('Median')
				+ ' : ' + this.median() + "\n";

		return content;
	},

	/**
	 * Equal intervals discretization Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	getEqInterval : function(nbClass) {

		if (this._nodata())
			return;

		this.method = _('eq. intervals') + ' (' + nbClass + ' ' + _('classes')
				+ ')';

		var a = Array();
		var val = this.min();
		var interval = (this.max() - this.min()) / nbClass;

		for (i = 0; i <= nbClass; i++) {
			a[i] = val;
			val += interval;
		}

		return a;
	},

	/**
	 * Quantile discretization Return an array with bounds : ie array(0, 0.75,
	 * 1.5, 2.25, 3);
	 */
	getQuantile : function(nbClass) {

		if (this._nodata())
			return;

		this.method = _('quantile') + ' (' + nbClass + ' ' + _('classes') + ')';

		var a = Array();
		var tmp = this.sorted();
		val = this.min();
		var classSize = Math.round(this.pop() / nbClass);
		var j = classSize;
		var k = 0;

		for (i = 0; i < tmp.length; i++) {
			if (j == classSize) {
				a[k] = tmp[i];
				k++;
				j = 0;
			}
			j++;
		}
		if (a.length < nbClass + 1) {
			a.push(tmp[tmp.length - 1]);
		}

		return a;

	},

	/**
	 * from Mapfish http://old.nabble.com/file/p26421348/GeoStat.js
	 */
	getJenks : function(nbClass) {

		if (this._nodata())
			return;

		this.method = _('Jenks') + ' (' + nbClass + ' ' + _('classes') + ')';

		if (typeof determineClass != 'function') {
			alert(_('./lib/jenks.util.js file should be included to use Jenks classification.'));
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

		return bounds;
	},

	/**
	 * Transform a bounds array to a range array the following array : array(0,
	 * 0.75, 1.5, 2.25, 3); becomes : array('0-0.75', '0.75-1.5', '1.5-2.25',
	 * '2.25-3');
	 */
	getRanges : function(a) {

		var ranges = Array();
		for (i = 0; i < (a.length - 1); i++) {
			ranges[i] = a[i] + this.separator + a[i + 1];
		}
		return ranges;
	},

	getSortedlist : function() {
		return this.sorted().join(', ');
	}

};