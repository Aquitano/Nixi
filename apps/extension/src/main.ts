import { setupButton } from './button';
import './style.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
setupButton(document.querySelector<HTMLButtonElement>('#article')!);
