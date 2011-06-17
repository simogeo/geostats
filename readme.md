[geostats](http://www.empreinte-urbaine.eu/mapping/geostats/) 
========================

geostats is a tiny standalone JS library for classification released by [Simon Georget](http://www.empreinte-urbaine.eu/)  under MIT licence. 

It currently supports
--------------

- equal intervals
- quantiles
- jenks (natural breaks)

and **few statistical methods**

To use it, just download the geostats package and include the following lines into your html page :

```html
   <script type="text/javascript" src="path/to/lib/jenks.util.js"></script>
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
   