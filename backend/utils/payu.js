import crypto from 'crypto';

// Generate PayU hash for payment request
export function generatePayUHash(params, salt) {
  // Hash sequence as per PayU docs
  const hashString = [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || '',
    params.udf2 || '',
    params.udf3 || '',
    params.udf4 || '',
    params.udf5 || '',
    '', '', '', '', '', // udf6-udf10
    salt
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex');
}
