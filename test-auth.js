#!/usr/bin/env node

// Simple test script to verify Google OAuth environment variables
console.log('🔍 Testing DreamForge Authentication Setup...\n')

// Check environment variables
const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL',
  'OPENAI_API_KEY'
]

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_ID',
  'GITHUB_SECRET'
]

console.log('📋 Required Environment Variables:')
let missingRequired = []

requiredEnvVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '❌'
  const displayValue = value ? (varName.includes('SECRET') || varName.includes('KEY') ? '[HIDDEN]' : value) : 'NOT SET'
  console.log(`${status} ${varName}: ${displayValue}`)
  
  if (!value) {
    missingRequired.push(varName)
  }
})

console.log('\n🔧 Optional OAuth Variables:')
optionalEnvVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '⚠️'
  const displayValue = value ? (varName.includes('SECRET') ? '[HIDDEN]' : '[SET]') : 'NOT SET'
  console.log(`${status} ${varName}: ${displayValue}`)
})

// Provide setup guidance
console.log('\n' + '='.repeat(50))

if (missingRequired.length > 0) {
  console.log('❌ Missing Required Variables:')
  missingRequired.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  console.log('\n💡 Please set these in your .env.local file')
} else {
  console.log('✅ All required environment variables are set!')
}

const hasGoogleOAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
const hasGitHubOAuth = process.env.GITHUB_ID && process.env.GITHUB_SECRET

if (!hasGoogleOAuth && !hasGitHubOAuth) {
  console.log('\n📝 To enable social login:')
  console.log('   • For Google OAuth: See GOOGLE_OAUTH_SETUP.md')
  console.log('   • For GitHub OAuth: Set GITHUB_ID and GITHUB_SECRET')
} else {
  console.log('\n🎉 OAuth providers configured:')
  if (hasGoogleOAuth) console.log('   ✅ Google OAuth')
  if (hasGitHubOAuth) console.log('   ✅ GitHub OAuth')
}

console.log('\n🚀 Next steps:')
console.log('   1. Set up your database: npx prisma generate && npx prisma db push')
console.log('   2. Start development server: npm run dev')
console.log('   3. Visit http://localhost:3000/auth/signin to test')

console.log('\n' + '='.repeat(50))
