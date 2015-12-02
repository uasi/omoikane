module.exports = {
  accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
  secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
  region: process.env['AWS_REGION'],
  handler: 'index.handler',
  role: process.env['AWS_IAM_ROLE'],
  functionName: process.env['AWS_LAMBDA_FUNCTION_NAME'],
  timeout: 10,
  memorySize: 128,
  runtime: 'nodejs',
}
