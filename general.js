'use strict';

// getExtension ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Extract file type extension from string.
* 
* Matches against a predefined list of extensions and is case-sensitive.
* 
* @param {string} string - String to search.
* @returns {string|undefined} Matched file extension, null if none found.
*/
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

// fade ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function fade(el, dir, speed) {
	if (el.hasAttribute('fading')) {
		el.setAttribute('fading', 'false');
	} else {
		el.setAttribute('fading', 'true');
	}
	
	let currentDisplay = window.getComputedStyle(el, null).getPropertyValue('display');
	let currentOpacity = window.getComputedStyle(el, null).getPropertyValue('opacity');
	let originalDisplay = el.getAttribute('originaldisplay');
	let originalOpacity = el.getAttribute('originalopacity');
	let originalTransition = window.getComputedStyle(el, null).getPropertyValue('transition');
	let transitions = originalTransition.split(',');
	
	for (let i = 0; i < transitions.length; i++) {
		if (transitions[i].toLowerCase().includes('opacity ')) {
			if (transitions[i].toLowerCase().trim().indexOf('opacity ') > 0) {
				continue;
			} else {
				transitions.splice(i, 1);
				i--;
			}
		}
	}
	
	if ((dir === 1) && ((currentOpacity === originalOpacity) && (currentDisplay === originalDisplay) && (originalDisplay !== 'none'))) {
		return;
	}
	
	if ((dir === 1) && (currentOpacity === 1)) {
		el.style.opacity = '0';
	} else if ((dir === 0) && (currentOpacity === 0)) {
		el.style.opacity = '1';
	}
	
	let opacitylessTransitions = transitions.join(',');
	el.style.transition = `${opacitylessTransitions}, opacity ${speed / 1000}s`;
	
	if (dir === 0) {
		if (currentDisplay === 'none') {
			return;
		}
		
		setTimeout(() => {
			el.style.opacity = 0;
			
			setTimeout(() => {
				if (el.getAttribute('fading') === 'false') {
					el.setAttribute('fading', 'true');
					return;
				}
				
				el.style.display = 'none';
				el.style.transition = opacitylessTransitions;
				el.removeAttribute('fading');
			}, speed);
		}, 10);
	} else {
		el.style.display = originalDisplay;
		
		setTimeout(() => {
			el.style.opacity = originalOpacity;
			
			setTimeout(() => {
				if (el.getAttribute('fading') === 'false') {
					el.setAttribute('fading', 'true');
					return;
				}
				
				el.style.transition = opacitylessTransitions;
				el.removeAttribute('fading');
			}, speed);
		}, 10);
	}
}

// htmlEntityDecode ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Decode HTML entities in string.
 * 
 * For example: "&amp;" becomes "&", "&lt;" becomes "<", etc.
 * 
 * @param {string} input - String with HTML entities.
 * @returns {string} Decoded string.
 */
function htmlEntityDecode(input) {
	let parser = new DOMParser().parseFromString(input, "text/html");
	return parser.documentElement.textContent;
}

// imageExists ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Check if image exists.
 * 
 * @param {string} src - Source of image.
 * @returns {Promise<boolean>} True if image loads, false if fails.
 */
function imageExists(src) {
	return new Promise((resolve) => {
		const image = new Image();
		
		image.onload = () => resolve(true);
		image.onerror = () => resolve(false);
		
		image.src = src;
		
		if (image.complete) {
			resolve(true);
		}
	});
}

// listener ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const listener = {
	functions: {},
	
	add(arg1, arg2, arg3, arg4) {
		let name = false, elements, events, callback, id;
		
		if ((typeof arg1 === 'object') || ((typeof arg1 === 'string') && (['#', '.'].includes(arg1.charAt(0))))) {
			elements = arg1;
			events = arg2;
			callback = arg3;
		} else {
			name = arg1;
			elements = arg2;
			events = arg3;
			callback = arg4;
		}
		
		if ((elements !== window) && ((Array.isArray(elements) && (elements.length === 0)) || (elements.length === 0) || (elements === undefined))) {
			return false;
		}
		
		if (typeof elements === 'string') {
			elements = document.querySelectorAll(elements);
		} else if ((elements.tagName === undefined) || ((elements.tagName !== undefined) && (elements.tagName !== 'SELECT'))) {
			if ((elements.length === undefined) || (elements.length === 0) || (elements === window)) {
				elements = [elements];
			}
		}
		
		if (!Array.isArray(events)) {
			events = [events];
		}
		
		if (listener.functions[name] !== undefined) {
			console.error(`Listener already defined with the name "${name}"`);
			return false;
		}
		
		if (name === false) {
			do {
				id = random.id(16, true);
			} while (listener.functions[id] !== undefined);
			
			name = id;
		}
		
		listener.functions[name] = {
			elements: elements,
			function: callback,
			events: events
		};
		
		if ((elements.tagName !== undefined) && (elements.tagName === 'SELECT')) {
			for (let eventChild of events) {
				elements.addEventListener(eventChild, listener.functions[name].function);
			}
		} else {
			for (let element of elements) {
				for (let eventChild of events) {
					element.addEventListener(eventChild, listener.functions[name].function);
				}
			}
		}
	},
	
	remove(name) {
		if (listener.functions[name] === undefined) {
			console.error('Listener with this name does not exist');
			return false;
		}
		
		for (let i = 0; i < listener.functions[name].elements.length; i++) {
			for (let eventChild of listener.functions[name].events) {
				listener.functions[name].elements[i].removeEventListener(eventChild, listener.functions[name].function);
			}
		}
		
		delete listener.functions[name];
	}
};

// autoTextArea ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Adjust height of textarea to fit content.
* 
* @param {HTMLTextAreaElement} textarea - Textarea to resize.
*/
function autoTextarea(textarea) {
	textarea.style.height = 'auto';
	const style = window.getComputedStyle(textarea);
	let height = str.height(textarea.value, {
		width: style.width,
		lineHeight: style.lineHeight,
		fontSize: style.fontSize,
		letterSpacing: style.letterSpacing,
		fontFamily: style.fontFamily,
		fontStyle: style.fontStyle,
		fontWeight: style.fontWeight,
		paddingLeft: style.paddingLeft,
		paddingRight: style.paddingRight,
		border: style.border,
		boxSizing: style.boxSizing,
		borderRadius: style.borderRadius,
		minWidth: style.minWidth,
		maxWidth: style.maxWidth,
		minHeight: style.minHeight,
		maxHeight: style.maxHeight
	});
	
	textarea.style.height = `${height}px`;
}

// rgbToHex ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Convert RGB string to hex string.
* 
* @param {string} rgb - RGB string like "rgb(255, 0, 0)".
* @returns {string|null} Hex color string (e.g. "#ff0000") or null.
*/
function rgbToHex(rgb) {
	const match = rgb.match(/rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
	if (!match) return null;
	
	return '#' + match.slice(1, 4).map(x => {
		const hex = parseInt(x).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	}).join('');
}

// hexToLightness ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Calculate lightness (0–100%) of hex color.
* 
* @param {string} value - Hex color string (e.g. "#aabbcc").
* @returns {number|null} Lightness value as percentage (0 to 100) or null.
*/
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

// getRotation ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Return current rotation in degrees of element.
* 
* @param {HTMLElement} element - The element.
* @returns {number} Rotation in degrees (0 to 360).
*/
function getRotation(element) {
	const style = window.getComputedStyle(element);
	const transform = style.getPropertyValue('transform') || style.getPropertyValue('-webkit-transform') || style.getPropertyValue('-moz-transform') || style.getPropertyValue('-ms-transform') || style.getPropertyValue('-o-transform');
	
	if (!transform || (transform === 'none')) return 0;
	
	const match = transform.match(/matrix\(([^)]+)\)/);
	
	if (!match) return 0;
	
	const values = match[1].split(',').map(parseFloat);
	
	if (values.length < 2) return 0;
	
	const [a, b] = values;
	let radians = Math.atan2(b, a);
	
	if (radians < 0) {
		radians += 2 * Math.PI;
	}
	
	return Math.round(radians * (180 / Math.PI));
}

// str ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const str = {
	/**
	* Remove character at specific index from string.
	* 
	* @param {string} str - The string.
	* @param {number} pos - Index of character to remove.
	* @returns {string} String with character removed.
	*/
	removePos(str, pos) {
		return str.slice(0, pos) + str.slice(pos + 1);
	},
	
	/**
	* Remove first x amount of characters from string.
	* 
	* @param {string} str - The string.
	* @param {number} [amount=1] - Number of characters to remove from start.
	* @returns {string} String after removal.
	*/
	removeFirst(str, amount) {
		if (amount === undefined) {
			amount = 1;
		}
		
		return str.slice(amount);
	},
	
	/**
	* Remove last x amount of characters from string.
	* 
	* @param {string} str - The string.
	* @param {number} [amount=1] - Number of characters to remove from end.
	* @returns {string} String after removal.
	*/
	removeLast(str, amount) {
		if (amount === undefined) {
			amount = 1;
		}
		
		return str.slice(0, -amount);
	},
	
	/**
	* Copy string to clipboard.
	* 
	* @param {string} str - String to copy to clipboard.
	*/
	copy(str) {
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(str).catch(err => {
				console.error('Clipboard copy failed:', err);
			});
		} else {
			const textarea = document.createElement('textarea');
			textarea.value = str;
			
			Object.assign(textarea.style, {
				opacity: '0',
				position: 'fixed',
				top: '-9999px',
				left: '-9999px',
				height: '1px',
				width: '1px',
				zIndex: '-1'
			});
			
			textarea.setAttribute('readonly', '');
			document.body.appendChild(textarea);
			textarea.select();
			
			try {
				document.execCommand('copy');
			} catch (err) {
				console.error('Fallback copy failed:', err);
			}
			
			document.body.removeChild(textarea);
		}
	},
	
	/**
	* Get rendered height of text.
	* 
	* @param {string} text - HTML or string to measure.
	* @param {Object} style - Extra styling of text.
	* @returns {number} Height in pixels.
	*/
	height(text, style) {
		let div = document.createElement('div');
		div.innerHTML = text;
		
		const hiddenStyle = {
			opacity: '0',
			height: 'auto',
			position: 'fixed',
			top: '-999999px',
			left: '-999999px',
			zIndex: '-999999',
			wordWrap: 'break-word',
			visibility: 'hidden',
		};
		
		setStyle(div, {...style, ...hiddenStyle});
		document.body.appendChild(div);
		const height = div.clientHeight;
		document.body.removeChild(div);
		return height;
	},
	
	/**
	* Convert object into URL query string.
	* 
	* Optionally encode each key and value.
	* 
	* @param {Object} obj - Object with query parameters.
	* @param {boolean} [encode=false] - Encode keys and values too?
	* @returns {string} Query string starting with "?".
	*/
	objToQuery(obj, encode = false) {
		const params = Object.entries(obj).map(([key, value]) => {
			if (encode) {
				return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
			}
			
			return `${key}=${value}`;
		});
		
		return params.length ? `?${params.join('&')}` : '';
	},
	
	/**
	* Convert URL query string to object.
	* 
	* Optionally decode each key and value.
	* 
	* @param {string} query - Query string (with or without '?').
	* @param {boolean} [decode=false] - Decode keys and values too?.
	* @returns {Object} Object with query parameters.
	*/
	queryToObj(query, decode = false) {
		const obj = {};
		
		if (query.startsWith('?')) {
			query = query.slice(1);
		}
		
		if (!query) {
			return obj;
		}
		
		for (const pair of query.split('&')) {
			const [rawKey, rawValue = ''] = pair.split('=');
			const key = decode ? decodeURIComponent(rawKey) : rawKey;
			const value = decode ? decodeURIComponent(rawValue) : rawValue;
			obj[key] = value;
		}
		
		return obj;
	}
};

// calc ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Collection of percentage-based calculation tools.
*/
const calc = {
	/**
   * Calculates given percentage of number.
   * 
   * @param {number} percent - Percentage value (e.g. 25 for 25%).
   * @param {number} number - Number to apply percentage to.
   * @returns {number} Result of (number * percent / 100).
   */
	percent(percent, number) {
		return (number / 100) * percent;
	},
	
	/**
   * Calculates what percentage a part is of complete value.
   * 
   * @param {number} complete - Total value.
   * @param {number} part - Part of total.
   * @returns {number} Percentage that the part is of total.
   */
	whatPercent(complete, part) {
		return (part / complete) * 100;
	}
};

// cloneVar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Create deep clone of variable.
* 
* Supports complex types like Date, Map, Set, ArrayBuffer, BigInt, and handles circular references.
* 
* @param {*} variable - Variable to clone.
* @returns {*} Deep clone of variable.
* @throws {DOMException} If variable contains unsupported types.
*/
function cloneVar(variable) {
	if (typeof structuredClone === 'function') {
		return structuredClone(variable);
	}
	
	return JSON.parse(JSON.stringify(variable));
}

// formatNumber ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Format number by inserting dots every 3 digits from RTL.
 * 
 * Example: 1000000 → "1.000.000"
 * 
 * @param {number|string} number - Number to format.
 * @returns {string} Formatted number as string.
 */
function formatNumber(number) {
	number = number.toString().replace(/,/g, '');
	
	if (number.length <= 3) {
		return number;
	}
	
	let reversed = number.split('').reverse();
	let formatted = [];
	
	for (let i = 0; i < reversed.length; i++) {
		formatted.push(reversed[i]);
		
		if ((i + 1) % 3 === 0 && i + 1 !== reversed.length) {
			formatted.push('.');
		}
	}
	
	return formatted.reverse().join('');
}

// capitalize ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Capitalize first letter of string, or each string in array.
 *
 * @param {string | string[]} input - Single or array of strings.
 * @returns {string | string[] | null} Capitalized result, or null.
 */
function capitalize(input) {
	let result = null;
	
	if (typeof input === 'string') {
		result = `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
	} else if (typeof input === 'object') {
		result = [];
		
		for (let value of input) {
			if (typeof value === 'string') {
				result.push(`${value.charAt(0).toUpperCase()}${value.slice(1)}`);
			} else {
				result.push(value);
			}
		}
	}
	
	return result;
}

// getStyle ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Get computed CSS value of element.
 *
 * @param {HTMLElement} element - The element.
 * @param {string} propertyValue - CSS property in kebab-case.
 * @returns {string} Computed CSS style value.
 */
function getStyle(element, propertyValue) {
	return window.getComputedStyle(element).getPropertyValue(propertyValue).trim();
}

// setStyle ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
 * Apply CSS styles to element.
 *
 * @param {HTMLElement} element - The element to style.
 * @param {Object<string, string | number>} styles - Object with camelCase keys and their values.
 */
function setStyle(element, styles) {
	for (let property in styles) {
		if (Object.hasOwn(styles, property)) {
			element.style[property] = styles[property];
		}
	}
}

// elParent ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Gets closest parentElement by selector.
*
* - If `selector` is an element, it checks for reference equality with each parent.
* - If `selector` is a string starting with `.`, it matches by class name.
* - If `selector` starts with `#`, it matches by `id`.
* - Otherwise, it matches by tag name (case-insensitive).
*
* @param {HTMLElement} el - The element.
* @param {string | HTMLElement} selector - Selector string (class, ID, tag name) or element.
* @returns {HTMLElement|null} Matching parentElement, or null.
*/
function elParent(element, selector) {
	if (typeof selector === 'object') {
      while ((element = element.parentElement) && !(element === selector));
      return element || null;
	} else if (typeof selector === 'string') {
		const firstChar = selector.charAt(0);
		
		if (firstChar === '.') {
			selector = selector.slice(1);
			while ((element = element.parentElement) && (!element.classList.contains(selector)));
			return element || null;
		} else if (firstChar === '#') {
			selector = selector.slice(1);
			while ((element = element.parentElement) && (element.getAttribute('id') !== selector));
			return element || null;
		}
	}
	
	while ((element = element.parentElement) && (element.tagName.toLowerCase() !== selector.toLowerCase()));
	return element || null;
}

// isNumeric ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Determines if value is valid finite number or numeric string.
* 
* @param {*} input - Value.
* @returns {boolean} True if value is numeric, false otherwise.
*/
function isNumeric(input) {
	return (typeof input !== 'object') && !isNaN(parseFloat(input)) && isFinite(input);
}

// strToEl ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* HTML string to element.
* 
* @param {string} str - String with HTML.
* @returns {Element|null} First element from string, null if none found.
*/
function strToEl(str) {
   let template = document.createElement('template');
   template.innerHTML = str.trim();
   return template.content.firstElementChild || null;
}

// elToStr ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* HTML element to HTML string.
* 
* @param {Element} el - HTML element.
* @returns {string} String with element's HTML.
*/
function elToStr(el) {
	if (!(el instanceof Element)) {
		throw new TypeError('Expected a DOM Element');
	}
	
	const div = document.createElement('div');
	div.appendChild(el.cloneNode(true));
	return div.innerHTML;
}

// random ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const random = {
	/**
	* Generate random int between min and max value, inclusive.
	* 
	* @param {number} min - Lowest int.
	* @param {number} max - Highest int.
	* @param {boolean} [inclusive=true] - Include min & max values as possible result?
	* @returns {number} Random int between min and max value, null if min > max.
	*/
	int(min, max, inclusive = true) {
		if ((typeof min !== 'number') || (typeof max !== 'number')) {
			throw new TypeError('random.int(): Both min and max values must be numbers.');
		}
		
		if (min > max) return null;
		
		const range = inclusive ? ((max - min) + 1) : (max - min);
		return Math.floor(Math.random() * range) + min;
	},
	
	/**
	* Generate random float between min and max value.
	* 
	* Rounded to specified number of decimals.
	* Optionally ensures the result does not exceed "keepBelow".
	* 
	* @param {number} min - Min value (inclusive).
	* @param {number} max - Max value (exclusive).
	* @param {number} [decimals=2] - Number of decimal places.
	* @param {number} [keepBelow=max] - Optional ceiling; result must be ≤ max value.
	* @returns {number|null} Random float, null if min > max.
	*/
	float(min, max, decimals = 2, keepBelow = max) {
		if ((typeof min !== 'number') || (typeof max !== 'number')) {
			throw new TypeError('random.float(): Min and max values must be numbers.');
		}
		
		if (min > max) return null;
		
		if (keepBelow > max) {
			keepBelow = max;
		}
		
		let randomFloat;
		let attempts = 0;
		
		do {
			randomFloat = Math.random() * (max - min) + min;
			
			if (++attempts > 1000) {
				throw new Error('random.float(): Too many retries. Check your range and keepBelow.');
			}
		} while (randomFloat > keepBelow);
		
		return parseFloat(randomFloat.toFixed(decimals));
	},
	
	/**
	* Generate random ID string of given length.
	* 
	* Optionally using custom character set.
	* Character set is shuffled before sampling.
	* 
	* @param {number} length - Length of the result string.
	* @param {string|boolean} [characters] - Custom character set string, `true` for alphanumerics, leave empty for full charset, or use custom string.
	* @returns {string} Random ID string.
	*/
	id(length, characters) {
		const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const fullCharset = alphanumeric + '_-?+$#@!%&';
		let charset = '';
		
		if (characters === true) {
			charset = alphanumeric;
		} else if (!characters) {
			charset = fullCharset;
		} else {
			charset = characters;
		}
		
		const arr = charset.split('');
		const shuffleTimes = random.int(arr.length, arr.length * 2);
		
		for (let i = 0; i < shuffleTimes; i++) {
			const i1 = random.int(0, arr.length - 1);
			const i2 = random.int(0, arr.length - 1);
			[arr[i1], arr[i2]] = [arr[i2], arr[i1]];
		}
		
		let output = '';
		
		for (let i = 0; i < length; i++) {
			output += arr[random.int(0, arr.length - 1)];
		}
		
		return output;
	}
};

// improved new fetchnode

const fetchRequest = {
	async readError(response) {
		let error;
		
		try {
			error = await response.json();
		} catch {
			return {
				errorTitle: 'Unexpected error',
				errorMessage: 'An unknown error has occurred. Please try again later. If the issue persists, contact support for further assistance. Error code: 1111.'
			};
		}
		
		if (error.errorMessage === 'Unexpected error') {
			return {
				errorTitle: 'Unexpected error',
				errorMessage: 'An unexpected error occurred. Please try again later or contact support if the issue persists. Error code: 1112.'
			};
		} else if (error.errorMessage === 'Incorrect sign-in credentials') {
			return {
				errorTitle: 'Incorrect credentials',
				errorMessage: 'We could not verify your credentials. Please ensure your username and password are correct and try again. Error code: 1113.'
			};
		}
	},
	
	async send(method, endpoint, body = null) {
		try {
			const response = await fetch(`${global.serverUrl}/api/${endpoint}`, {
				method,
				headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${global.token}`
				},
				body: body ? JSON.stringify(body) : null
			});
			
			if (!response.ok) {
				return fetchRequest.readError(response);
			}
			
			return await response.json();
		} catch (error) {
			return {
				errorTitle: 'Unexpected error',
				errorMessage: 'Unable to connect to the server. Please try again. If the problem persists, contact support. Error code: 1114.'
			};
		}
	}
};

// fetchNode ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Send request to server API using GET or POST.
* 
* Automatically includes JWT token if provided.
* 
* @param {string|false|undefined} JWToken - Optional JWT token for authentication.
* @param {string} endpoint - Endpoint path, comes after "serverUrl/api/".
* @param {Object} [data] - Optional data payload; if present, a POST request is made.
* @returns {Promise<Object>} Resolves with the server's JSON response.
*/
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

// ajaxNode ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Send request and resolve when response received from node.js > socket.io.
* 
* Prevents duplicate requests to the same target while one is active.
* 
* @param {Object} data - Config object for request.
* @param {string} data.target - Unique socket event name.
* @param {Object} [data.data] - Data payload to send, defaults to null if not provided.
* @returns {Promise<Object>} Resolves with the response received on target event.
*/
function ajaxNode(data) {
	return new Promise((resolve, reject) => {
		if ((typeof data !== 'object') || (typeof data.target !== 'string')) {
			reject(new Error('ajaxNode(): Invalid data provided'));
			return;
		}
		
		if (typeof data.data !== 'object') {
			data.data = null;
		}
		
		if (global.activeAjaxSockets.includes(data.target)) {
			note.add(note.warning, 'Please wait while previous process is finished');
			return;
		}
		
		global.activeAjaxSockets.push(data.target);
		const handleResponse = (response) => {
			socket.off(data.target, handleResponse);
			global.activeAjaxSockets = global.activeAjaxSockets.filter(t => t !== data.target);
			resolve(response);
		};
		
		socket.on(data.target, handleResponse);
		socket.emit('databaseRequest', data);
	});
}

// ajax ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Perform AJAX request with XMLHttpRequest.
* 
* @param {Object} data - Configuration object.
* @param {string} data.target - URL to which request is sent.
* @param {boolean} [data.get=false] - True: GET, otherwise: POST.
* @param {Object.<string, any>|FormData} [data.data] - Data to send with POST. Nested objects or FormData.
* @param {Function} [data.complete] - Callback function executed on success.
* @returns {boolean|undefined} - False on error, otherwise undefined.
*/
function ajax(data) {
	const formData = new FormData();
	let loopCount = 0;
	
	formData.append('XMLHTTP', true);
	
	if (!data.target) {
		console.error('ajax(): No target URL specified.');
		return false;
	}
	
	if (!data.get) {
		if (!data.data || typeof data.data !== 'object') {
			console.error('ajax(): Data is undefined or not an object.');
			return false;
		}
		
		for (const key in data.data) {
			if (!Object.prototype.hasOwnProperty.call(data.data, key)) continue;

			const value = data.data[key];

			if (value instanceof FormData) {
				for (const [formKey, formValue] of value.entries()) {
					formData.append(formKey, formValue);
				}
			} else if (typeof value === 'object') {
				formData.append(key, JSON.stringify(value));
			} else {
				formData.append(key, value);
			}

			loopCount++;
		}

		if (loopCount === 0) {
			console.error('ajax(): No valid data provided.');
			return false;
		}
	}
	
	const xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState === 4 && xhttp.status === 200 && typeof data.complete === 'function') {
			try {
				const isHTML = data.target.includes('.html');
				const response = isHTML ? xhttp.responseText : JSON.parse(xhttp.responseText);
				data.complete(response);
			} catch (e) {
				console.error('ajax(): Failed to parse response', e);
			}
		}
	};
	
	if (data.get) {
		xhttp.open('GET', data.target, true);
		xhttp.send();
	} else {
		xhttp.open('POST', data.target, true);
		xhttp.send(formData);
	}
}

// removeFromArray ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Remove specified values from array.
* 
* @param {Array} array - The array to remove from.
* @param {*|Array<*>} values - Single value or an array of values to remove.
* @param {boolean} [all=true] - Whether to remove all occurrences (true) or only the first occurrence (false).
* @returns {Array} A new array with values removed.
*/
function removeFromArray(array, values, all = true) {
	const toRemove = Array.isArray(values) ? [...values] : [values];
	
	return array.filter(item => {
		const index = toRemove.indexOf(item);
		
		if (index !== -1) {
			if (!all) {
				toRemove.splice(index, 1);
			}
			
			return false;
		}
		
		return true;
	});
}

// calcAge ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Calculate age in years from date.
* 
* @param {Date|string} birthDate - The birth date, Date object or date string.
* @returns {number} Age in years, or NaN if invalid.
*/
function calcAge(birthDate) {
	const date = (typeof birthDate === 'string') ? new Date(birthDate) : birthDate;
	
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		console.error('calcAge: Invalid date input');
		return NaN;
	}
	
	const now = new Date();
	let age = now.getFullYear() - date.getFullYear();
	const hasHadBirthdayThisYear = now.getMonth() > date.getMonth() || (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate());
	
	if (!hasHadBirthdayThisYear) {
		age--;
	}
	
	return age;
}

// date ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const date = {
	/**
	* Get current date and time as formatted string.
	* 
	* Format specifiers (used in "format" string):
	* - "d": Days (2 digits)
	* - "m": Months (2 digits)
	* - "y": Full years (4 digits)
	* - "h": Hours (2 digits, 24h format)
	* - "i": Minutes (2 digits)
	* - "s": Seconds (2 digits)
	* - "v": Milliseconds (up to 3 digits)
	* 
	* Any other characters in the format string are returned as-is.
	* If no format is provided, the default format is "dd-mm-yyyy hh:ii:ss".
	* 
	* @param {string} [format] - Optional format string using specifiers above.
	* @returns {string} Formatted date string.
	*/
	getString(format) {
		const now = new Date();
		const pad = (val, length = 2) => val.toString().padStart(length, '0');
		const parts = {
			d: pad(now.getDate()),
			m: pad(now.getMonth() + 1),
			y: now.getFullYear().toString(),
			h: pad(now.getHours()),
			i: pad(now.getMinutes()),
			s: pad(now.getSeconds()),
			v: pad(now.getMilliseconds(), 3)
		};
		
		if (format) {
			return Array.from(format).map(char => parts[char] ?? char).join('');
		}
		
		return `${parts.d}-${parts.m}-${parts.y} ${parts.h}:${parts.i}:${parts.s}`;
	},
	
	/**
	* Calculate new Date based on "current" input.
	* 
	* - If "current" is undefined/null, returns current date.
	* - If "current.date" is missing, it's initialized using date.getChunk().
	* - If "current.date" exists, it's parsed via date.parse().
	* - All other keys in "current" are treated as offsets and added to respective date parts.
	* 
	* @param {Object} [current] - Object describing date modifications.
	* @param {Object} [current.date] - Partial date object or date string to parse.
	* @param {number} [current.year] - Years to add.
	* @param {number} [current.month] - Months to add.
	* @param {number} [current.day] - Days to add.
	* @param {number} [current.hour] - Hours to add.
	* @param {number} [current.minute] - Minutes to add.
	* @param {number} [current.second] - Seconds to add.
	* @param {number} [current.millisecond] - Milliseconds to add.
	* @returns {Date} New Date object adjusted by the given values.
	*/
	calc(current) {
		if (!current) {
			return new Date();
		}
		
		if (!current.date) {
			current.date = {
				millisecond: date.getChunk('millisecond'),
				second: date.getChunk('second'),
				minute: date.getChunk('minute'),
				hour: date.getChunk('hour'),
				day: date.getChunk('day'),
				month: date.getChunk('month'),
				year: date.getChunk('year'),
			};
		} else {
			current.date = date.parse(current.date, true);
		}
		
		for (const key in current) {
			if (key === 'date') continue;

			if (typeof current[key] === 'number' && typeof current.date[key] === 'number') {
				current.date[key] += current[key];
			}
		}
		
		const d = current.date;
		return new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second, d.millisecond);
	},
	
	/**
	* Get a formatted string by replacing tokens in the result string with parts of given date.
	* 
	* Supported tokens (in "resultString"):
	* - Short: "v" (ms), "s" (sec), "i" (min), "h" (hour), "d" (day), "m" (month), "y" (year)
	* - Full: "millisecond", "second", "minute", "hour", "day", "month", "year"
	* Each will be zero-padded except for year(s).
	* 
	* @param {Date|Object|string} newDate - Date object, plain object with date parts, or a string to interpret.
	* @param {string} resultString - String containing date tokens to be replaced.
	* @returns {string|Date} Formatted string with tokens replaced by actual date parts.
	*/
	get(newDate, resultString) {
		let selector;
		
		if (!(newDate instanceof Date) && typeof newDate === 'object' && newDate !== null) {
			return new Date(
				newDate.year || 0,
				(newDate.month || 1) - 1,
				newDate.day || 1,
				newDate.hour || 0,
				newDate.minute || 0,
				newDate.second || 0,
				newDate.millisecond || 0
			);
		} else if (newDate === undefined) {
			newDate = new Date();
		} else if (!(newDate instanceof Date)) {
			if (newDate) {
				selector = newDate;
			}
			newDate = new Date();
		}
		
		const tokens = ['v', 's', 'i', 'h', 'd', 'm', 'y', 'millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];
		
		for (const token of tokens) {
			const regex = new RegExp(token, 'g');
			let chunk = date.getChunk(newDate, token);
			
			if (!['y', 'year'].includes(token)) {
				chunk = chunk.toString().padStart(2, '0');
			}
			
			resultString = resultString.replace(regex, chunk);
		}
		
		return resultString;
	},
	
	/**
	* Calculates the time difference between two dates and returns it in various units.
	* 
	* - millisecond
	* - second
	* - minute
	* - hour
	* - day
	* - month (approximate, assumes 30 days per month)
	* - year (approximate, assumes 12 months per year)
	* 
	* @param {Date|string} date1 - The first date (can be a Date object or a date string).
	* @param {Date|string} date2 - The second date (can be a Date object or a date string).
	* @returns {Object} An object containing the difference in:
	*/
	diff(date1, date2) {
		if (!(date1 instanceof Date)) {
			const parsed = date.parse(date1);
			
			if (!(parsed instanceof Date)) {
				console.error('date.diff(): Invalid date1 input');
				return null;
			}
			
			date1 = parsed;
		}
		
		if (!(date2 instanceof Date)) {
			const parsed = date.parse(date2);
			
			if (!(parsed instanceof Date)) {
				console.error('date.diff(): Invalid date2 input');
				return null;
			}
			
			date2 = parsed;
		}
		
		const recent = date1 > date2 ? date1 : date2;
		const old = date1 < date2 ? date1 : date2;
		const ms = recent.getTime() - old.getTime();
		
		return {
			millisecond: ms,
			second: Math.floor(ms / 1000),
			minute: Math.floor(ms / (1000 * 60)),
			hour: Math.floor(ms / (1000 * 60 * 60)),
			day: Math.floor(ms / (1000 * 60 * 60 * 24)),
			month: Math.floor(ms / (1000 * 60 * 60 * 24 * 30)),
			year: Math.floor(ms / (1000 * 60 * 60 * 24 * 30 * 12))
		};
	},
	
	/**
	* Parse partial date object and return complete date object or Date.
	* 
	* @param {Object} dateObject - Object that may contain partial date parts: year, month, day, hour, minute, second, millisecond.
	* @param {boolean} [object=false] - If true, returns normalized object, if false, returns a Date.
	* @returns {Object|Date} Either the normalized object with missing fields set to false, or a constructed Date.
	*/
	parse(dateObject, object) {
		if (!dateObject) {
			return new Date();
		}
		
		const properties = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];
		
		for (let prop of properties) {
			if (!Object.prototype.hasOwnProperty.call(dateObject, prop)) {
				dateObject[prop] = false;
			}
		}
		
		if (object) {
			return dateObject;
		}
		
		return new Date(
			dateObject.year,
			(dateObject.month || 1) - 1,
			dateObject.day || 1,
			dateObject.hour || 0,
			dateObject.minute || 0,
			dateObject.second || 0,
			dateObject.millisecond || 0
		);
	},
	
	/**
	* Extract specific time chunk from Date.
	* 
	* Supports short and long format keys:
	* - "v" / "millisecond"
	* - "s" / "second"
	* - "i" / "minute"
	* - "h" / "hour"
	* - "d" / "day"
	* - "m" / "month"
	* - "y" / "year"
	* 
	* If first parameter is not Date, it's treated as the input string, and "new Date()" is used as the date.
	* 
	* @param {Date|string} newDate - Date object or the input string (if the date is omitted).
	* @param {string} [input] - Key indicating which part of the date to return.
	* @returns {number|false} Requested date part, or false if the input is invalid.
	*/
	getChunk(newDate, input) {
		if (!(newDate instanceof Date)) {
			input = newDate;
			newDate = new Date();
		}
		
		switch (input) {
			case 'v':
			case 'millisecond':
				return newDate.getMilliseconds();
			case 's':
			case 'second':
				return newDate.getSeconds();
			case 'i':
			case 'minute':
				return newDate.getMinutes();
			case 'h':
			case 'hour':
				return newDate.getHours();
			case 'd':
			case 'day':
				return newDate.getDate();
			case 'm':
			case 'month':
				return newDate.getMonth() + 1;
			case 'y':
			case 'year':
				return newDate.getFullYear();
			default:
				console.error('date.getChunk(): Invalid input string.', input);
				return false;
		}
	}
};

// getDominantColor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Calculate approximate dominant color of image.
* 
* This uses a sampling method to average pixel colors at intervals of "blockSize".
* 
* @param {HTMLImageElement} imgEl - Image element to analyze.
* @param {number} [blockSize=5] - Sampling step (every Nth pixel will be used). Smaller means more accurate, but slower.
* @returns {string} CSS RGB color string (e.g., 'rgb(123, 234, 45)').
*/
function getDominantColor(imgEl, blockSize = 5) {
	if (!(imgEl instanceof HTMLImageElement)) {
		console.error('getDominantColor(): First argument must be an HTMLImageElement.');
		return 'rgb(0, 0, 0)';
	}
	
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const rgb = { r: 0, g: 0, b: 0 };
	let count = 0;
	const width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
	const height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
	context.drawImage(imgEl, 0, 0, width, height);
	const imageData = context.getImageData(0, 0, width, height);
	const data = imageData.data;
	const length = data.length;
	
	for (let i = 0; i < length; i += blockSize * 4) {
		rgb.r += data[i];
		rgb.g += data[i + 1];
		rgb.b += data[i + 2];
		count++;
	}
	
	if (count === 0) {
		return 'rgb(0, 0, 0)';
	}
	
	rgb.r = Math.floor(rgb.r / count);
	rgb.g = Math.floor(rgb.g / count);
	rgb.b = Math.floor(rgb.b / count);

	return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

// ratio ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ratio = {
	/**
	* Calculate new width to maintain aspect ratio based on new height.
	* 
	* @param {number} width - Original width.
	* @param {number} height - Original height.
	* @param {number} newHeight - New height.
	* @returns {number} Calculated width that maintains original aspect ratio.
	*/
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
   },
   
	/**
	* Calculate new height to maintain aspect ratio based on new width.
	* 
	* @param {number} width - Original width.
	* @param {number} height - Original height.
	* @param {number} newWidth - New width.
	* @returns {number} Calculated height that maintains original aspect ratio.
	*/
   getHeight(width, height, newWidth) {
		if ((typeof width !== 'number') || (typeof height !== 'number') || (typeof newWidth !== 'number')) {
			console.error('ratio.getHeight(): All parameters must be numbers.');
			return 0;
		}
		
		if (width === 0) {
			console.error('ratio.getHeight(): Width must not be zero.');
			return 0;
		}
		
      return (height / width) * newWidth;
   },
   
	/**
	* Calculate width from given aspect ratio and height.
	* 
	* @param {string} aspectRatio - Aspect ratio in the format width:height, example: 16:9.
	* @param {number} height - Current height.
	* @returns {number} Calculated width maintaining the aspect ratio.
	*/
   getWidthByRatio(aspectRatio, height) {
      const [w, h] = aspectRatio.split(':').map(Number);
		
		if (!w || !h || isNaN(w) || isNaN(h)) {
			console.error('ratio.getWidthByRatio(): Invalid aspect ratio format. Use width:height, example: 16:9.');
			return 0;
		}
		
		return (height / h) * w;
   },
   
	/**
	* Calculate height from given aspect ratio and width.
	* 
	* @param {string} aspectRatio - Aspect ratio in format width:height, example: 16:9.
	* @param {number} width - Current width.
	* @returns {number} Calculated height maintaining the aspect ratio.
	*/
   getHeightByRatio(aspectRatio, width) {
      const [w, h] = aspectRatio.split(':').map(Number);
		
		if (!w || !h || isNaN(w) || isNaN(h)) {
			console.error('ratio.getHeightByRatio(): Invalid aspect ratio format. Use width:height, example: 16:9.');
			return 0;
		}
		
		return (width / w) * h;
   },
   
	/**
	* Calculate simplified aspect ratio for given width and height.
	* 
	* @param {number} width - Width value.
	* @param {number} height - Height value.
	* @returns {string} Aspect ratio in format width:height, example: 16:9.
	*/
   get(width, height) {
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
		const ratio = gcd(width, height);
		return `${width / ratio}:${height / ratio}`;
   }
};

// imgToThumbnail ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/**
* Create thumbnail version of image by scaling it down.
* 
* If scaleFactor >= 1, original source is returned without modification.
* 
* @param {string} src - Image source URL or data URI.
* @param {number} scaleFactor - Factor to scale image by, example: 0.5 for 50% size.
* @returns {Promise<string>} Promise that resolves to base64-encoded WebP thumbnail image.
*/
async function imgToThumbnail(src, scaleFactor) {
	if (scaleFactor >= 1) {
		return src;
	}
	
	const loadImage = (src) =>
		new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = reject;
			image.src = src;
		});
	
	const image = await loadImage(src);
	const { width, height } = image;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = width * scaleFactor;
	canvas.height = height * scaleFactor;
	
	ctx.drawImage(
		image,
		0, 0, width, height,
		0, 0, canvas.width, canvas.height
	);
	
	return canvas.toDataURL('image/webp');
}
