const crypto = require('crypto');
const fs = require('fs');

const getSignedCookies = () => {
  try {
    const domain = process.env.CLOUDFRONT_DOMAIN;
    const key = process.env.CLOUDFRONT_PRIVATE_KEY;
    const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
    const privateKeyPath = process.env.CLOUDFRONT_PRIVATE_KEY_PATH;

    const privateKey = key || fs.readFileSync(privateKeyPath, 'utf8');

    const expireTime = Math.floor((Date.now() + 60 * 60 * 1000) / 1000);

    const policy = {
      Statement: [
        {
          Resource: `https://${domain}/*`,
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
      'CloudFront-Key-Pair-Id': keyPairId,
    };

    console.log('Successfully signed cookies...');

    return cookies;
  } catch (error) {
    console.log('Signing cookies failed: ', error);
  }
};

module.exports = { getSignedCookies };
