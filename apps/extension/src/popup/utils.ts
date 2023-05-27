import { setShowPopup } from './App';

/**
 * Enum for color classes used in status messages
 *
 * @enum {string} ColorClasses - Tailwind CSS color classes
 */
export enum ColorClasses {
  success = 'bg-green-400',
  error = 'bg-red-400',
}

/**
 * Show a status message in the popup
 *
 * @param message - Message to display
 * @param colorClass - Tailwind CSS color class
 */
export function addMessage(message: string, colorClass: ColorClasses) {
  setShowPopup({ show: true, content: { message, colorClass } });
}
