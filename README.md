# tag-builder

> A simple tag builder which isn't specific to any markup language

## Installation

`npm install @wmfs/tag-builder`

## Examples

```js
const builder = new TagBuilder()

builder.addTag('!doctype html', { includeClosingTag: false })

const html = builder.addTag('html')

html.addChildTag('head').content('HEAD CONTENT')
html.addChildTag('body').content('BODY CONTENT')

const template = builder.compile()
// template will be '<!doctype html><html><head>HEAD CONTENT</head><body>BODY CONTENT</body></html>'
```
