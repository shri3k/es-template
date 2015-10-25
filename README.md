# es-template
---
A simple ES6/2015 template string-esque syntax for HTML.

# Syntax:-
```js
require('es-template')(<rootDir>[,<options>])(<filename>|<filename.ext>,<values> [,moreOptions]);
```

## Parameters:-
**filename**  
Name of your template file

**values**  
JSON object with key as the variable name used in the filename and value as value

**options**  
JSON object with user defined options (only takes `ext` as options right now)

# Returns:-
[Stream](https://nodejs.org/api/stream.html)

# Usage:-
```html
//index.html
<html>
<h1>${test}</h1> there </em>${test2}<em>
</html>
```

```js
var tmpl = require('es-template')();
tmpl('index', {"test":"hello", "test2":"world"}).pipe(process.stdout);
//Outputs:-
// hello there world
```
