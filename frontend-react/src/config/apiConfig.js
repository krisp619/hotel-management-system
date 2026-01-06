/**
 * API Configuration
 * Centralized API base URL for all backend requests
 * Production: http://18.215.168.203:5000/api
 */

export const API_BASE_URL = "http://18.215.168.203:5000/api";

console.log("✅ API Config Loaded:");
console.log(`   Base URL: ${API_BASE_URL}`);
console.log(`   Timeout: 30 seconds`);
console.log(`   Methods: POST (auth), GET (data), PUT (update), DELETE (remove)`);
