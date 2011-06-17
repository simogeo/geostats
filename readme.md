[geostats](http://www.empreinte-urbaine.eu/mapping/geostats/) 
========================

geostats is a tiny standalone JS library for classification released by [Simon Georget](http://www.empreinte-urbaine.eu/)  under MIT license. 

It currently supports
--------------

- equal intervals
- quantiles
- jenks (natural breaks)

and **few statistical methods**

To use it, just download the geostats package and include the following lines into your html page :

```html
   <script type="text/javascript" src="path/to/lib/jenks.util.js"></script><!-- only if using Jenks classification -->
   <script type="text/javascript" src="path/to/lib/geostats.js"></script>
```

API
========================

**Attributes :**   
- serie
- separator
- method
   
**Methods :**
- min();
- max();
- sum();
- pop();
- mean();
- median();
- _nodata();
- sorted();
- info();
- getEqInterval(nbClass);
- getQuantile(nbClass);
- getJenks(nbClass);
- getRanges(array);
- getSortedlist();
 
 
 LICENSE
 ========================
 
 Copyright (c) 2011 Simon Georget

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 