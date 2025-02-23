import '@testing-library/jest-dom';

beforeAll(() => {
  // Check if the document already has an html element, otherwise create it
  if (!document.documentElement) {
    const html = document.createElement('html');
    document.appendChild(html);
  }

  // Check if the document already has a body element, otherwise create it
  if (!document.body) {
    const body = document.createElement('body');
    document.documentElement?.appendChild(body);
  }
});
