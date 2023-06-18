import Session from 'supertokens-web-js/recipe/session';
import { setIsLoggedIn } from '../../App';
import { ColorClasses, addMessage } from '../../utils';

/**
 * Logout user by removing the session token from local storage and invoking the SuperTokens session logout function
 */
export async function logout() {
	// Sign out the user
	await Session.signOut();

	// Clear cookies and local storage
	localStorage.removeItem('st-cookie');
	localStorage.removeItem('supertokens');

	// Check if the user is still logged in
	if (await Session.doesSessionExist()) {
		const response = await fetch('http://localhost:8200/users/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const data = await response.json();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (data.message === 'unauthorised') {
			setIsLoggedIn(false);
			window.location.href = '/index.html';
			return;
		}

		addMessage('Logout failed - please reload page', ColorClasses.error);
	} else {
		setIsLoggedIn(false);

		// Redirect the user to the homepage
		window.location.href = '/index.html';
	}
}
