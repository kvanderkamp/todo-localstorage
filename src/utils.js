/**
 * Utility functions for the Todo app
 */
/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
/**
 * Get an element by ID with type assertion
 */
export function getElement(id) {
    return document.getElementById(id);
}
/**
 * Query a single element with type assertion
 */
export function querySelector(selector) {
    return document.querySelector(selector);
}
/**
 * Query all elements with type assertion
 */
export function querySelectorAll(selector) {
    return Array.from(document.querySelectorAll(selector));
}
