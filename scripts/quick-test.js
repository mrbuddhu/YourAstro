#!/usr/bin/env node

/**
 * YourAstro Quick Test Script
 * 
 * This script performs basic validation without requiring Supabase credentials.
 * Run with: node scripts/quick-test.js
 */

import fs from 'fs';
import path from 'path';

console.log('🔮 YourAstro Quick Test Script');
console.log('==============================\n');

const tests = {
  packageJson: false,
  environmentFile: false,
  supabaseConfig: false,
  databaseMigrations: false,
  componentStructure: false,
  buildSuccess: false
};

// Test 1: Check package.json
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredFields = ['name', 'version', 'dependencies', 'scripts'];
  const hasAllFields = requiredFields.every(field => packageJson[field]);
  
  if (hasAllFields) {
    console.log('✅ package.json structure is valid');
    tests.packageJson = true;
  } else {
    console.log('❌ package.json missing required fields');
  }
} catch (error) {
  console.log('❌ Could not read package.json');
}

// Test 2: Check for environment file
try {
  const envExists = fs.existsSync('.env');
  if (envExists) {
    console.log('✅ .env file exists');
    tests.environmentFile = true;
  } else {
    console.log('⚠️ .env file not found (create one with your Supabase credentials)');
  }
} catch (error) {
  console.log('❌ Could not check .env file');
}

// Test 3: Check Supabase configuration
try {
  const supabaseConfig = fs.readFileSync('src/integrations/supabase/client.ts', 'utf8');
  if (supabaseConfig.includes('createClient') && supabaseConfig.includes('supabase')) {
    console.log('✅ Supabase client configuration found');
    tests.supabaseConfig = true;
  } else {
    console.log('❌ Supabase client configuration incomplete');
  }
} catch (error) {
  console.log('❌ Could not read Supabase configuration');
}

// Test 4: Check database migrations
try {
  const migrationsDir = 'supabase/migrations';
  const migrations = fs.readdirSync(migrationsDir);
  if (migrations.length > 0) {
    console.log(`✅ Found ${migrations.length} database migrations`);
    tests.databaseMigrations = true;
  } else {
    console.log('❌ No database migrations found');
  }
} catch (error) {
  console.log('❌ Could not check database migrations');
}

// Test 5: Check component structure
try {
  const componentsDir = 'src/components';
  const pagesDir = 'src/pages';
  
  const components = fs.readdirSync(componentsDir);
  const pages = fs.readdirSync(pagesDir);
  
  if (components.length > 0 && pages.length > 0) {
    console.log(`✅ Found ${components.length} components and ${pages.length} pages`);
    tests.componentStructure = true;
  } else {
    console.log('❌ Missing components or pages');
  }
} catch (error) {
  console.log('❌ Could not check component structure');
}

// Test 6: Check if build directory exists (indicating successful build)
try {
  const distExists = fs.existsSync('dist');
  if (distExists) {
    console.log('✅ Build directory exists (previous build successful)');
    tests.buildSuccess = true;
  } else {
    console.log('⚠️ Build directory not found (run npm run build)');
  }
} catch (error) {
  console.log('❌ Could not check build directory');
}

// Print results
console.log('\n📊 Quick Test Results');
console.log('=====================');
console.log(`Package.json: ${tests.packageJson ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Environment: ${tests.environmentFile ? '✅ PASS' : '⚠️ WARN'}`);
console.log(`Supabase Config: ${tests.supabaseConfig ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Database Migrations: ${tests.databaseMigrations ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Component Structure: ${tests.componentStructure ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Build Status: ${tests.buildSuccess ? '✅ PASS' : '⚠️ WARN'}`);

const passedTests = Object.values(tests).filter(Boolean).length;
const totalTests = Object.keys(tests).length;

console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);

if (passedTests >= 4) {
  console.log('🎉 YourAstro structure looks good! Ready for development.');
  console.log('\n📝 Next steps:');
  console.log('1. Set up your Supabase project');
  console.log('2. Create a .env file with your credentials');
  console.log('3. Run: npm run dev');
  console.log('4. Run: node scripts/test-flows.js (with credentials)');
} else {
  console.log('⚠️ Some issues found. Please check the setup.');
}

export { tests }; 