# My Personal JavaScript Utility Library: `general.js`

Welcome! This post is a technical overview of my personal JavaScript utility library, `general.js`, which I’ve developed and refined over several years. This file is the backbone of many of my web projects, providing a robust set of helper functions and utilities that streamline development and solve common problems efficiently.

## What is `general.js`?

`general.js` is a comprehensive collection of JavaScript utility functions designed to make frontend development faster, more reliable, and more enjoyable. It covers a wide range of tasks, from DOM manipulation and event handling to color conversions, AJAX requests, date calculations, and more. The goal is to have a single, well-tested file that I can drop into any project to instantly boost productivity and code quality.

## Why I Built It

Over the years, I found myself repeatedly writing the same utility functions for different projects—copying, tweaking, and sometimes debugging the same code over and over. This was inefficient and error-prone. I wanted a single, reliable source of truth for all my helper functions, so I created `general.js` as my personal JavaScript standard library. It solves the problem of code duplication, reduces bugs, and lets me focus on building features instead of reinventing the wheel.

## Technologies and Tools Used

- **JavaScript (ES6+)**: The entire library is written in modern vanilla JavaScript, with a focus on browser compatibility and performance.
- **No external dependencies**: Everything is self-contained, so it’s easy to integrate into any project.

## Key Features and Code Examples

Below are some highlights from `general.js`, with real code snippets and detailed explanations of some of the more advanced helper functions.

### File Extension Extraction

```js
function getExtension(string) {
	let extensions = ['jpg', 'png', 'webp', 'jpeg', 'tif', 'tiff', 'bmp', 'gif', 'svg', 'ico', 'mp4'];
	for (let extension of extensions) {
		if (string.includes(`.${extension}`)) {
			return extension;
		} else if (string.includes(`.${extension.toUpperCase()}`)) {
			return extension.toUpperCase();
		}
	}
}
```
This function scans a string for a known file extension, returning the extension if found. It’s useful for quickly determining file types from filenames or URLs.

### DOM Element Fade Animation

```js
function fade(el, dir, speed) {
	if (el.hasAttribute('fading')) {
		el.setAttribute('fading', 'false');
	} else {
		el.setAttribute('fading', 'true');
	}
	// ...existing code...
}
```
`fade` smoothly transitions an element’s opacity and display state, handling both fade-in and fade-out. It manages transition states and ensures that multiple fade operations don’t conflict, making it robust for UI effects.

### Event Listener Management (Advanced)

```js
const listener = {
	functions: {},
	add(arg1, arg2, arg3, arg4) {
		// ...existing code...
	},
	remove(name) {
		// ...existing code...
	}
};
```
The `listener` object is a flexible event management system. It allows you to add and remove event listeners by name, supports bulk operations, and prevents duplicate listeners. This is especially useful for complex UIs where you need to manage many dynamic event handlers and avoid memory leaks.

### Deep Cloning Variables (Advanced)

```js
function cloneVar(variable) {
	if (typeof structuredClone === 'function') {
		return structuredClone(variable);
	}
	return JSON.parse(JSON.stringify(variable));
}
```
`cloneVar` creates a deep copy of any variable, including complex types like arrays, objects, and even some special types if the environment supports `structuredClone`. This is essential for safely duplicating data without reference issues.

### AJAX and Fetch Helpers (Advanced)

```js
async function fetchNode(JWToken, endpoint, data) {
	if (!JWToken && (data === undefined)) {
		throw new Error('fetchNode(): Invalid data provided');
	}
	const headers = {
		'Content-Type': 'application/json',
		...(JWToken ? { 'Authorization': `Bearer ${JWToken}` } : {})
	};
	const options = {
		method: data !== undefined ? 'POST' : 'GET',
		headers,
		...(data !== undefined ? { body: JSON.stringify(data) } : {})
	};
	const url = `${global.serverUrl}/api/${endpoint}`;
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`Request failed: ${response.status} ${response.statusText}`);
	}
	return await response.json();
}
```
`fetchNode` is a robust wrapper for making authenticated API requests. It automatically sets headers, chooses the HTTP method, and parses the response. It throws clear errors for failed requests, making error handling much easier.

### Date and Time Utilities (Advanced)

```js
const date = {
	getString(format) {
		const now = new Date();
		// ...existing code...
	},
	calc(current) {
		if (!current) {
			return new Date();
		}
		// ...existing code...
	},
	parse(dateObject, object) {
		// ...existing code...
	},
	diff(date1, date2) {
		// ...existing code...
	}
};
```
The `date` object is a full-featured date utility. `getString` formats dates with custom tokens, `calc` computes new dates by adding offsets, `parse` normalizes partial date objects, and `diff` returns the difference between two dates in multiple units. This suite makes date handling in JavaScript much more powerful and less error-prone.

### Deep Color Analysis

```js
function hexToLightness(value) {
	if ((typeof value !== 'string') || !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
		return null;
	}
	if (value.length === 4) {
		value = '#' + [...value.slice(1)].map(c => c + c).join('');
	}
	const r = parseInt(value.slice(1, 3), 16) / 255;
	const g = parseInt(value.slice(3, 5), 16) / 255;
	const b = parseInt(value.slice(5, 7), 16) / 255;
	const cmin = Math.min(r, g, b);
	const cmax = Math.max(r, g, b);
	const lightness = (cmax + cmin) / 2;
	return +(lightness * 100).toFixed(1);
}
```
`hexToLightness` calculates the perceived lightness of a color from its hex code, returning a percentage. This is useful for dynamic theming, accessibility, and UI adjustments based on color brightness.

### String Utilities

```js
const str = {
	removePos(str, pos) {
		return str.slice(0, pos) + str.slice(pos + 1);
	},
	copy(str) {
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(str).catch(err => {
				console.error('Clipboard copy failed:', err);
			});
		} else {
			// ...existing code...
		}
	},
	objToQuery(obj, encode = false) {
		const params = Object.entries(obj).map(([key, value]) => {
			if (encode) {
				return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
			}
			return `${key}=${value}`;
		});
		return params.length ? `?${params.join('&')}` : '';
	}
};
```
The `str` object provides a suite of string manipulation helpers. `removePos` removes a character at a specific index, `copy` copies a string to the clipboard (using the modern Clipboard API if available), and `objToQuery` converts an object to a URL query string, optionally encoding keys and values. These utilities make string handling and data serialization much more convenient.

### Color and Ratio Calculations

```js
function rgbToHex(rgb) {
	const match = rgb.match(/rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
	if (!match) return null;
	return '#' + match.slice(1, 4).map(x => {
		const hex = parseInt(x).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	}).join('');
}

const ratio = {
	getWidth(width, height, newHeight) {
		if ((typeof width !== 'number') || (typeof height !== 'number') || (typeof newHeight !== 'number')) {
			console.error('ratio.getWidth(): All parameters must be numbers.');
			return 0;
		}
		if (height === 0) {
			console.error('ratio.getWidth(): Height can not be 0.');
			return 0;
		}
		return (width / height) * newHeight;
	}
};
```
`rgbToHex` converts an RGB color string to a hex color code, which is useful for color manipulation and CSS styling. The `ratio` object provides helpers for maintaining aspect ratios, such as calculating a new width given a height (or vice versa), which is essential for responsive design and image processing.

## What Have I Learned?

Building and maintaining `general.js` has taught me the value of reusable code, defensive programming, and the importance of clear documentation. It’s also helped me develop a keen eye for edge cases and browser quirks. Most importantly, it’s made me a faster and more reliable developer, able to deliver features with confidence and consistency.

If you’d like to know more about the project, feel free to reach out!
