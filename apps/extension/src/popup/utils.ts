import toast from 'solid-toast';

/**
 * Show a status message in the popup
 *
 * @param message - Message to display
 * @param colorClass - Tailwind CSS color class
 */
export function addMessage(message: string, type: 'ERROR' | 'SUCCESS'): void {
	if (type === 'ERROR')
		toast.error(message, {
			className: 'border-2 border-gray-600',
			style: {
				background: '#1f2937',
				color: '#f3f4f6',
			},
			iconTheme: {
				primary: '#ef4444',
				secondary: '#1f2937',
			},
		});
	else if (type === 'SUCCESS')
		toast.success(message, {
			className: 'border-2 border-gray-600',
			style: {
				background: '#1f2937',
				color: '#f3f4f6',
			},
			iconTheme: {
				primary: '#38bdf8',
				secondary: '#1f2937',
			},
		});
}

/**
 * Assert that a value is defined
 *
 * @param val - Value to check
 */
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
	if (val === undefined || val === null) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		throw new Error(`Expected 'val' to be defined, but received ${val}`);
	}
}
