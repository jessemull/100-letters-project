const mSession = {
  isValid: jest.fn(() => true),
  getAccessToken: () => ({ getJwtToken: () => 'fake-jwt-token' }),
};

const mUser = {
  getSession: jest.fn((cb) => cb(null, mSession)),
  signOut: jest.fn(),
  authenticateUser: jest.fn((_details, callbacks) =>
    callbacks.onSuccess(mSession),
  ),
};

const mUserPool = {
  getCurrentUser: jest.fn(() => mUser),
};

const CognitoUserPool = jest.fn(() => mUserPool);

const CognitoUser = jest.fn(() => mUser);

const AuthenticationDetails = jest.fn();

module.exports = {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession: jest.fn(() => mSession),
  __mocks__: {
    mSession,
    mUser,
    mUserPool,
  },
};
