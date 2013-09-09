geostats
========================

[geostats](http://www.empreinte-urbaine.eu/mapping/geostats/) is a tiny standalone JS library for classification released by [Simon Georget](http://www.empreinte-urbaine.eu/)  under MIT license. 

Other contributors : [Doug Curl](http://kgs.uky.edu/kgsmap/ukengage/) (Jenks algorithm), [Casey Thomas](http://cpt.ph/), [Dreamind](https://github.com/dreamind), 


It currently supports
--------------

- equal intervals
- quantiles
- jenks (natural breaks)
- uniques values

and **few statistical methods**

To use it, just download the geostats package and include the following line into your html page :

```html
   <script type="text/javascript" src="path/to/lib/geostats.js"></script>
```

**Please see the samples page to understand how it works!**

API
========================

**Attributes :**

- *serie* : contains the statistic population. Default : empty.
- *separator* : used to separate ranges values, by default : ' - '
- *legendSeparator* : by default, equals to *separator* value
- *method* : give information regarding the classification method used. Default : empty.
- *bounds* : classification bounds
- *ranges* : classification ranges
- *colors* : classification colors
   
**Methods :**

- *min();* : return the min value
- *max();* : return the max value
- *sum();* : return the sum of the population
- *pop();* : return the number of individuals
- *mean();* : return the mean
- *median();* : return the median
- *variance();* : return the variance
- *stddev();* : return the standard deviation
- *cov();* : return the coefficient of variation
- *setSerie();* : fill up the *serie* attribute
- *setColors();* : fill up the *colors* attribute
- *setPrecision();* : set precision on serie - only usefull for float series. Can take no value (for automatic precision), or an integer between 0-20. By default, the precision will be computed automatically by geostats.
- *setRanges()* : fill up the *ranges* attribute (array of classes range)
- *_nodata();* : check if *serie* attribute if not empty
- *sorted();* : return the sorted (asc) serie
- *info();* : return information about the population in text format
- *getEqInterval(nbClass);* : Do an equal interval classification and return bounds into an array
- *getQuantile(nbClass);* : Do a quantile classification and return bounds into an array
- *getJenks(nbClass);* : Do a Jenks classification and return bounds into an array
- *getUniqueValues();* : Do a unique values classification and return bounds (values) into an array
- *getRanges(array);* : return an array of classes range (*ranges* value)
- *getRangeNum()* : return the number/index of this.ranges that value falls into
- *getHtmlLegend(colors, legend, callback, mode);* : return a legend in html format. Please refer [to code comment](https://github.com/simogeo/geostats/blob/master/lib/geostats.js#L681) to know how about option.
- *getSortedlist();* : return the sorted serie in text format
- *getClass();* : return a given value class
- *doCount();* : perform count feature by classes, used to display count feature in legend
 
 
MIT LICENSE
========================
 
 Copyright (c) 2011 Simon Georget

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
