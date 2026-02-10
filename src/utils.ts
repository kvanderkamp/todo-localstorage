/**
 * Utility functions for the Todo app
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get an element by ID with type assertion
 */
export function getElement<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/**
 * Query a single element with type assertion
 */
export function querySelector<T extends HTMLElement>(
  selector: string,
): T | null {
  return document.querySelector(selector) as T | null;
}

/**
 * Query all elements with type assertion
 */
export function querySelectorAll<T extends HTMLElement>(selector: string): T[] {
  return Array.from(document.querySelectorAll(selector)) as T[];
}
