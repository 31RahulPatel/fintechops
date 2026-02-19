import { CognitoUserPool, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);
const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
const redirectUri = process.env.REACT_APP_REDIRECT_URI || window.location.origin;

export const signUpWithPhone = (username, email, phone, password) => {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'phone_number', Value: phone })
    ];
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const signInWithPhone = (phone, code) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: phone, Pool: userPool });
    if (!code) {
      resolve();
    } else {
      cognitoUser.sendCustomChallengeAnswer(code, {
        onSuccess: (result) => resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken()
        }),
        onFailure: reject
      });
    }
  });
};

export const signInWithGoogle = () => {
  const googleAuthUrl = `https://${cognitoDomain}/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUri}&response_type=code&client_id=${poolData.ClientId}&scope=openid email profile`;
  window.location.href = googleAuthUrl;
};

export const confirmSignUp = (username, code) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const getCurrentUser = () => userPool.getCurrentUser();

export const signOut = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) cognitoUser.signOut();
};

export const getSession = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      reject(new Error('No user found'));
      return;
    }
    cognitoUser.getSession((err, session) => {
      if (err) reject(err);
      else resolve(session);
    });
  });
};
