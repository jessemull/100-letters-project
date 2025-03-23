const fs = require('fs');
const crypto = require('crypto');

const getSignedCookies = () => {
  const privateKeyPath = process.env.CLOUDFRONT_PRIVATE_KEY_PATH;

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  const expireTime = Math.floor((Date.now() + 60 * 60 * 1000) / 1000);

  const policy = {
    Statement: [
      {
        Resource: 'https://dev.onehundredletters.com/*',
        Condition: {
          DateLessThan: { 'AWS:EpochTime': expireTime },
        },
      },
    ],
  };

  const policyJson = JSON.stringify(policy);
  const policyBase64 = Buffer.from(policyJson).toString('base64');

  const signer = crypto.createSign('sha1');
  signer.update(policyJson);
  const signature = signer.sign(privateKey);
  const signatureBase64 = signature.toString('base64');

  const cookies = {
    'CloudFront-Policy': policyBase64,
    'CloudFront-Signature': signatureBase64,
    'CloudFront-Key-Pair-Id': 'K3M6YXSO1HS1DC',
  };

  return cookies;
};

module.exports = { getSignedCookies };
