import { fireEvent, screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

/**
 * @jest-environment jsdom
 */


jest.mock("firebase/app", () => ({
   initializeApp: jest.fn(),
   getApps: jest.fn(() => []),
}));

jest.mock("firebase/firestore", () => ({
   getFirestore: jest.fn(),
   doc: jest.fn(),
   getDoc: jest.fn(),
}));

describe('Login Page Tests', () => {
   beforeEach(() => {
      document.body.innerHTML = `
         <input id="username-in" />
         <input id="password-in" />
         <button id="loginsubmit">Login</button>
      `;
      jest.clearAllMocks();
   });

   it('should alert if username or password is missing', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const button = screen.getByRole('button', { name: 'Login' });

      fireEvent.click(button);

      expect(alertMock).toHaveBeenCalledWith('Please provide both username and password');
      alertMock.mockRestore();
   });

   it('should alert if username does not exist in Firebase', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const usernameInput = screen.getByPlaceholderText('username-in');
      const passwordInput = screen.getByPlaceholderText('password-in');
      const button = screen.getByText('Login');

      usernameInput.value = 'nonexistentUser';
      passwordInput.value = 'password123';

      getDoc.mockResolvedValue({ exists: () => false });

      fireEvent.click(button);

      await Promise.resolve(); // Wait for async operations

      expect(alertMock).toHaveBeenCalledWith('Username or Password doesn\'t exist');
      alertMock.mockRestore();
   });

   it('should alert if password does not match', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const usernameInput = screen.getByPlaceholderText('username-in');
      const passwordInput = screen.getByPlaceholderText('password-in');
      const button = screen.getByText('Login');

      usernameInput.value = 'testUser';
      passwordInput.value = 'wrongPassword';

      getDoc.mockResolvedValue({
         exists: () => true,
         data: () => ({ password: 'correctPassword' }),
      });

      fireEvent.click(button);

      await Promise.resolve(); // Wait for async operations

      expect(alertMock).toHaveBeenCalledWith('Username or Password doesn\'t exist');
      alertMock.mockRestore();
   });

   it('should redirect to home page on successful login', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      const usernameInput = screen.getByLabelText('username-in');
      const passwordInput = screen.getByLabelText('password-in');
      const button = screen.getByText('Login');

      usernameInput.value = 'testUser';
      passwordInput.value = 'correctPassword';

      getDoc.mockResolvedValue({
         exists: () => true,
         data: () => ({ password: 'correctPassword' }),
      });

      Object.defineProperty(window, 'location', {
         value: { href: '' },
         writable: true,
      });

      fireEvent.click(button);

      await Promise.resolve(); // Wait for async operations

      expect(alertMock).toHaveBeenCalledWith('Login successful, being redirected to home page!');
      expect(document.cookie).toContain('username=testUser');
      expect(window.location.href).toBe('/home.html');
      alertMock.mockRestore();
   });
});