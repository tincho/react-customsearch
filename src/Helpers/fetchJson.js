import 'whatwg-fetch'
/**
 * convenience wrapper for using fetch with application/json Content-Type
 * @returns Promise
 */
export default function fetchJSON(url, options = {}) {
    if (typeof options.body === "object") {
        options.body = JSON.stringify(options.body);
    }
    if (!(options.headers instanceof Headers)) {
        options.headers = new Headers();
    }
    options.headers.append("Content-Type", "application/json");
    return fetch(url, options).then(response => response.json());
};
