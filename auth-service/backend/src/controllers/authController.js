const { cognito, userPoolId, clientId } = require('../config/cognito');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const params = {
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email }
      ]
    };

    const result = await cognito.signUp(params).promise();

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification code.',
      userId: result.UserSub,
      codeDeliveryDetails: result.CodeDeliveryDetails
    });
  } catch (error) {
    if (error.code === 'UsernameExistsException') {
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.confirmSignup = async (req, res) => {
  try {
    const { email, code } = req.body;

    const params = {
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code
    };

    await cognito.confirmSignUp(params).promise();

    res.json({ message: 'Email confirmed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const params = {
      ClientId: clientId,
      Username: email
    };

    const result = await cognito.resendConfirmationCode(params).promise();

    res.json({ 
      message: 'Verification code resent',
      codeDeliveryDetails: result.CodeDeliveryDetails
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    };

    const result = await cognito.initiateAuth(params).promise();

    res.json({
      accessToken: result.AuthenticationResult.AccessToken,
      idToken: result.AuthenticationResult.IdToken,
      refreshToken: result.AuthenticationResult.RefreshToken
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    };

    const result = await cognito.initiateAuth(params).promise();

    res.json({
      accessToken: result.AuthenticationResult.AccessToken,
      idToken: result.AuthenticationResult.IdToken
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const params = {
      AccessToken: req.headers.authorization?.split(' ')[1]
    };

    const result = await cognito.getUser(params).promise();
    
    const user = {
      username: result.Username,
      email: result.UserAttributes.find(attr => attr.Name === 'email')?.Value,
      attributes: result.UserAttributes
    };

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
