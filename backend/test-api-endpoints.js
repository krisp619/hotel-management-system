#!/usr/bin/env node

/**
 * API Testing Script for Hotel Management Backend
 * Tests all auth endpoints for proper response handling
 */

const http = require('http');

const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const tests = [];
let passCount = 0;
let failCount = 0;

// Color output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
            raw: data,
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: null,
            raw: data,
          });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout (5s)'));
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function test(name, method, path, body, expectedStatus, checker) {
  try {
    log(colors.blue, `\n▶ ${name}`);
    const response = await makeRequest(method, path, body);
    
    const statusOk = response.status === expectedStatus;
    const checksPass = !checker || checker(response);

    if (statusOk && checksPass) {
      log(colors.green, `  ✓ PASS (${response.status})`);
      if (response.body?.token) {
        log(colors.green, `  Token: ${response.body.token.substring(0, 20)}...`);
      }
      passCount++;
      return response.body;
    } else {
      log(colors.red, `  ✗ FAIL`);
      if (!statusOk) {
        log(colors.red, `    Expected: ${expectedStatus}, Got: ${response.status}`);
      }
      if (!checksPass) {
        log(colors.red, `    Custom check failed`);
      }
      log(colors.red, `    Response: ${JSON.stringify(response.body || response.raw).substring(0, 100)}`);
      failCount++;
      return null;
    }
  } catch (error) {
    log(colors.red, `  ✗ ERROR: ${error.message}`);
    failCount++;
    return null;
  }
}

async function runTests() {
  log(colors.yellow, '\n========================================');
  log(colors.yellow, '  HOTEL MANAGEMENT API TEST SUITE');
  log(colors.yellow, `  Base URL: ${API_BASE}`);
  log(colors.yellow, `  Timestamp: ${new Date().toISOString()}`);
  log(colors.yellow, '========================================');

  // Test 1: Health Check
  await test(
    'Health Check',
    'GET',
    '/api/health',
    null,
    200,
    (res) => res.body?.status === 'healthy'
  );

  // Test 2: Register - Valid
  const validRegister = {
    name: `TestUser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'Password123',
    confirmPassword: 'Password123',
  };
  const registerRes = await test(
    'Register - Valid Data',
    'POST',
    '/api/auth/register',
    validRegister,
    201,
    (res) => res.body?.success && res.body?.token && res.body?.user?.id
  );

  // Store email for later login tests
  const testEmail = validRegister.email;
  const testPassword = validRegister.password;

  // Test 3: Register - Duplicate Email
  await test(
    'Register - Duplicate Email (should fail with 409)',
    'POST',
    '/api/auth/register',
    validRegister,
    409,
    (res) => res.body?.success === false
  );

  // Test 4: Register - Missing Email
  await test(
    'Register - Missing Email (should fail with 400)',
    'POST',
    '/api/auth/register',
    {
      name: 'Test User',
      password: 'Password123',
      confirmPassword: 'Password123',
    },
    400,
    (res) => res.body?.success === false
  );

  // Test 5: Register - Password Too Short
  await test(
    'Register - Password Too Short (should fail with 400)',
    'POST',
    '/api/auth/register',
    {
      name: 'Test User',
      email: `short${Date.now()}@example.com`,
      password: 'Pass1',
      confirmPassword: 'Pass1',
    },
    400,
    (res) => res.body?.success === false
  );

  // Test 6: Register - Password Mismatch
  await test(
    'Register - Password Mismatch (should fail with 400)',
    'POST',
    '/api/auth/register',
    {
      name: 'Test User',
      email: `mismatch${Date.now()}@example.com`,
      password: 'Password123',
      confirmPassword: 'Different456',
    },
    400,
    (res) => res.body?.success === false
  );

  // Test 7: Login - Valid Credentials
  await test(
    'Login - Valid Credentials',
    'POST',
    '/api/auth/login',
    {
      email: testEmail,
      password: testPassword,
    },
    200,
    (res) => res.body?.success && res.body?.token && res.body?.user?.id
  );

  // Test 8: Login - Invalid Email
  await test(
    'Login - Invalid Email (should fail with 401)',
    'POST',
    '/api/auth/login',
    {
      email: 'nonexistent@example.com',
      password: 'Password123',
    },
    401,
    (res) => res.body?.success === false
  );

  // Test 9: Login - Wrong Password
  await test(
    'Login - Wrong Password (should fail with 401)',
    'POST',
    '/api/auth/login',
    {
      email: testEmail,
      password: 'WrongPassword123',
    },
    401,
    (res) => res.body?.success === false
  );

  // Test 10: Login - Missing Email
  await test(
    'Login - Missing Email (should fail with 400)',
    'POST',
    '/api/auth/login',
    {
      password: 'Password123',
    },
    400,
    (res) => res.body?.success === false
  );

  // Summary
  log(colors.yellow, '\n========================================');
  log(colors.yellow, '  TEST SUMMARY');
  log(colors.yellow, '========================================');
  log(colors.green, `  ✓ Passed: ${passCount}`);
  log(colors.red, `  ✗ Failed: ${failCount}`);
  log(colors.yellow, `  Total:   ${passCount + failCount}`);

  if (failCount === 0) {
    log(colors.green, '\n  ✓ ALL TESTS PASSED!');
  } else {
    log(colors.red, '\n  ✗ SOME TESTS FAILED');
  }
  log(colors.yellow, '========================================\n');

  process.exit(failCount > 0 ? 1 : 0);
}

runTests().catch((error) => {
  log(colors.red, `\nFatal error: ${error.message}`);
  process.exit(1);
});
