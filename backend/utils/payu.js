import crypto from 'crypto';

// Generate PayU hash for payment request
export function generatePayUHash(params, salt) {
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

  console.log('Request Hash String:', hashString);
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

// Generate PayU hash for response verification
export function generatePayUResponseHash(responseData, salt) {
  // PayU response hash sequence (reverse order)
  const hashString = [
    salt,
    responseData.status || '',
    '', '', '', '', '', // udf10-udf6 (empty)
    responseData.udf5 || '',
    responseData.udf4 || '',
    responseData.udf3 || '',
    responseData.udf2 || '',
    responseData.udf1 || '',
    responseData.email || '',
    responseData.firstname || '',
    responseData.productinfo || '',
    responseData.amount || '',
    responseData.txnid || '',
    responseData.key || ''
  ].join('|');

  console.log('Response Hash String:', hashString);
  return crypto.createHash('sha512').update(hashString).digest('hex');
}
