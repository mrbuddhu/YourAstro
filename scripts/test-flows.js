#!/usr/bin/env node

/**
 * YourAstro Flow Test Script
 * 
 * This script tests the main user flows to ensure everything is working correctly.
 * Run with: node scripts/test-flows.js
 */

import { createClient } from '@supabase/supabase-js';

// Configuration - update these with your actual values
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔮 YourAstro Flow Test Script');
console.log('=============================\n');

// Test data
const testUser = {
  email: `test-user-${Date.now()}@example.com`,
  password: 'testpassword123',
  full_name: 'Test User',
  user_type: 'user'
};

const testAstrologer = {
  email: `test-astrologer-${Date.now()}@example.com`,
  password: 'testpassword123',
  full_name: 'Test Astrologer',
  user_type: 'astrologer',
  bio: 'Experienced astrologer with 10+ years of practice',
  specialties: ['Vedic Astrology', 'Palmistry'],
  languages: ['English', 'Hindi'],
  experience: 10,
  price_per_min: 50,
  is_online: true
};

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...');
  
  try {
    // Test signup
    console.log('  📝 Testing user signup...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.full_name,
          user_type: testUser.user_type
        }
      }
    });
    
    if (signupError) {
      console.log(`  ❌ Signup failed: ${signupError.message}`);
      return false;
    }
    
    console.log('  ✅ User signup successful');
    
    // Test login
    console.log('  🔐 Testing login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });
    
    if (loginError) {
      console.log(`  ❌ Login failed: ${loginError.message}`);
      return false;
    }
    
    console.log('  ✅ Login successful');
    
    // Test logout
    console.log('  🚪 Testing logout...');
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.log(`  ❌ Logout failed: ${logoutError.message}`);
      return false;
    }
    
    console.log('  ✅ Logout successful');
    return true;
    
  } catch (error) {
    console.log(`  ❌ Auth flow test failed: ${error.message}`);
    return false;
  }
}

async function testProfileFlow() {
  console.log('\n👤 Testing Profile Flow...');
  
  try {
    // Login as test user
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });
    
    if (loginError) {
      console.log(`  ❌ Login failed: ${loginError.message}`);
      return false;
    }
    
    const userId = loginData.user.id;
    
    // Test profile update
    console.log('  ✏️ Testing profile update...');
    const { data: updateData, error: updateError } = await supabase
      .from('profiles')
      .update({
        bio: 'Updated bio for testing',
        phone: '+1234567890'
      })
      .eq('id', userId)
      .select();
    
    if (updateError) {
      console.log(`  ❌ Profile update failed: ${updateError.message}`);
      return false;
    }
    
    console.log('  ✅ Profile update successful');
    
    // Test profile fetch
    console.log('  📖 Testing profile fetch...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.log(`  ❌ Profile fetch failed: ${profileError.message}`);
      return false;
    }
    
    console.log('  ✅ Profile fetch successful');
    console.log(`  📋 Profile data: ${profileData.full_name} (${profileData.user_type})`);
    
    // Logout
    await supabase.auth.signOut();
    return true;
    
  } catch (error) {
    console.log(`  ❌ Profile flow test failed: ${error.message}`);
    return false;
  }
}

async function testAstrologerFlow() {
  console.log('\n🔮 Testing Astrologer Flow...');
  
  try {
    // Create test astrologer
    console.log('  📝 Creating test astrologer...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testAstrologer.email,
      password: testAstrologer.password,
      options: {
        data: {
          full_name: testAstrologer.full_name,
          user_type: testAstrologer.user_type
        }
      }
    });
    
    if (signupError) {
      console.log(`  ❌ Astrologer signup failed: ${signupError.message}`);
      return false;
    }
    
    const astrologerId = signupData.user.id;
    
    // Update astrologer profile
    console.log('  ✏️ Updating astrologer profile...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        bio: testAstrologer.bio,
        specialties: testAstrologer.specialties,
        languages: testAstrologer.languages,
        experience: testAstrologer.experience,
        price_per_min: testAstrologer.price_per_min,
        is_online: testAstrologer.is_online
      })
      .eq('id', astrologerId);
    
    if (updateError) {
      console.log(`  ❌ Astrologer profile update failed: ${updateError.message}`);
      return false;
    }
    
    console.log('  ✅ Astrologer profile updated');
    
    // Test astrologer listing
    console.log('  📋 Testing astrologer listing...');
    const { data: astrologers, error: listError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'astrologer');
    
    if (listError) {
      console.log(`  ❌ Astrologer listing failed: ${listError.message}`);
      return false;
    }
    
    console.log(`  ✅ Found ${astrologers.length} astrologers`);
    
    // Logout
    await supabase.auth.signOut();
    return true;
    
  } catch (error) {
    console.log(`  ❌ Astrologer flow test failed: ${error.message}`);
    return false;
  }
}

async function testWalletFlow() {
  console.log('\n💰 Testing Wallet Flow...');
  
  try {
    // Login as test user
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });
    
    if (loginError) {
      console.log(`  ❌ Login failed: ${loginError.message}`);
      return false;
    }
    
    const userId = loginData.user.id;
    
    // Test wallet balance update
    console.log('  💳 Testing wallet balance update...');
    const { data: balanceData, error: balanceError } = await supabase
      .from('profiles')
      .update({ wallet_balance: 1000 })
      .eq('id', userId)
      .select('wallet_balance')
      .single();
    
    if (balanceError) {
      console.log(`  ❌ Wallet balance update failed: ${balanceError.message}`);
      return false;
    }
    
    console.log(`  ✅ Wallet balance updated to ₹${balanceData.wallet_balance}`);
    
    // Test transaction recording
    console.log('  📝 Testing transaction recording...');
    const { error: txnError } = await supabase
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        amount: 500,
        type: 'credit',
        description: 'Test transaction',
        status: 'completed'
      });
    
    if (txnError) {
      console.log(`  ❌ Transaction recording failed: ${txnError.message}`);
      return false;
    }
    
    console.log('  ✅ Transaction recorded successfully');
    
    // Logout
    await supabase.auth.signOut();
    return true;
    
  } catch (error) {
    console.log(`  ❌ Wallet flow test failed: ${error.message}`);
    return false;
  }
}

async function testChatFlow() {
  console.log('\n💬 Testing Chat Flow...');
  
  try {
    // Login as test user
    const { data: userLogin, error: userLoginError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });
    
    if (userLoginError) {
      console.log(`  ❌ User login failed: ${userLoginError.message}`);
      return false;
    }
    
    // Get astrologer ID
    const { data: astrologers, error: astrologerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_type', 'astrologer')
      .limit(1);
    
    if (astrologerError || !astrologers.length) {
      console.log(`  ❌ No astrologers found: ${astrologerError?.message || 'No astrologers'}`);
      return false;
    }
    
    const astrologerId = astrologers[0].id;
    
    // Test chat session creation
    console.log('  🎯 Testing chat session creation...');
    const { data: sessionData, error: sessionError } = await supabase
      .from('chat_sessions')
      .insert({
        astrologer_id: astrologerId,
        user_id: userLogin.user.id,
        status: 'active',
        start_time: new Date().toISOString()
      })
      .select()
      .single();
    
    if (sessionError) {
      console.log(`  ❌ Chat session creation failed: ${sessionError.message}`);
      return false;
    }
    
    console.log('  ✅ Chat session created');
    
    // Test message sending
    console.log('  💭 Testing message sending...');
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        chat_session_id: sessionData.id,
        sender_id: userLogin.user.id,
        content: 'Test message from user'
      });
    
    if (messageError) {
      console.log(`  ❌ Message sending failed: ${messageError.message}`);
      return false;
    }
    
    console.log('  ✅ Message sent successfully');
    
    // Test message retrieval
    console.log('  📥 Testing message retrieval...');
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_session_id', sessionData.id)
      .order('created_at', { ascending: true });
    
    if (messagesError) {
      console.log(`  ❌ Message retrieval failed: ${messagesError.message}`);
      return false;
    }
    
    console.log(`  ✅ Retrieved ${messages.length} messages`);
    
    // End chat session
    console.log('  🏁 Ending chat session...');
    const { error: endError } = await supabase
      .from('chat_sessions')
      .update({
        status: 'ended',
        end_time: new Date().toISOString(),
        duration_seconds: 60
      })
      .eq('id', sessionData.id);
    
    if (endError) {
      console.log(`  ❌ Chat session ending failed: ${endError.message}`);
      return false;
    }
    
    console.log('  ✅ Chat session ended');
    
    // Logout
    await supabase.auth.signOut();
    return true;
    
  } catch (error) {
    console.log(`  ❌ Chat flow test failed: ${error.message}`);
    return false;
  }
}

async function cleanup() {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // Delete test users
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(testUser.email);
    if (userDeleteError) {
      console.log(`  ⚠️ Could not delete test user: ${userDeleteError.message}`);
    } else {
      console.log('  ✅ Test user deleted');
    }
    
    const { error: astrologerDeleteError } = await supabase.auth.admin.deleteUser(testAstrologer.email);
    if (astrologerDeleteError) {
      console.log(`  ⚠️ Could not delete test astrologer: ${astrologerDeleteError.message}`);
    } else {
      console.log('  ✅ Test astrologer deleted');
    }
    
  } catch (error) {
    console.log(`  ⚠️ Cleanup failed: ${error.message}`);
  }
}

async function runTests() {
  const results = {
    auth: false,
    profile: false,
    astrologer: false,
    wallet: false,
    chat: false
  };
  
  try {
    results.auth = await testAuthFlow();
    results.profile = await testProfileFlow();
    results.astrologer = await testAstrologerFlow();
    results.wallet = await testWalletFlow();
    results.chat = await testChatFlow();
    
  } catch (error) {
    console.log(`\n❌ Test execution failed: ${error.message}`);
  }
  
  // Print results
  console.log('\n📊 Test Results');
  console.log('===============');
  console.log(`Authentication Flow: ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Profile Flow: ${results.profile ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Astrologer Flow: ${results.astrologer ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Wallet Flow: ${results.wallet ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Chat Flow: ${results.chat ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! YourAstro is ready for launch!');
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }
  
  // Cleanup
  await cleanup();
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests }; 