require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION });
const cognito = new AWS.CognitoIdentityServiceProvider();

const testEmail = async () => {
  const testEmail = `test${Date.now()}@gmail.com`;
  
  try {
    console.log('Testing signup with email:', testEmail);
    console.log('\n⚠️  IMPORTANT: Replace with YOUR REAL EMAIL to receive OTP!\n');
    
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: testEmail,
      Password: 'Test@1234',
      UserAttributes: [
        { Name: 'email', Value: testEmail }
      ]
    };

    const result = await cognito.signUp(params).promise();
    
    console.log('\n✅ Signup successful!');
    console.log('UserSub:', result.UserSub);
    console.log('UserConfirmed:', result.UserConfirmed);
    console.log('Code Delivery Details:', JSON.stringify(result.CodeDeliveryDetails, null, 2));
    
    if (result.CodeDeliveryDetails) {
      console.log('\n📧 Email sent to:', result.CodeDeliveryDetails.Destination);
      console.log('Delivery Medium:', result.CodeDeliveryDetails.DeliveryMedium);
      console.log('Attribute:', result.CodeDeliveryDetails.AttributeName);
      console.log('\n✅ Check your email inbox (and spam folder) for the verification code!');
    } else {
      console.log('\n⚠️  No CodeDeliveryDetails returned');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Code:', error.code);
  }  
};

testEmail();
