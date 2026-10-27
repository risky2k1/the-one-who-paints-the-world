import assert from 'assert';
import { PORTFOLIO_DATA } from '../src/data/portfolio';
import { fetchPortfolioData, sendContactMessage } from '../src/lib/api/portfolioApi';

export async function runPortfolioApiTestSuite() {
  console.log('Running Portfolio API & Fallback Test Suite...\n');

  // Test 1: fetchPortfolioData returns valid portfolio structure and graceful fallback
  const res = await fetchPortfolioData();
  assert.ok(res.data, 'Expected portfolio data to be returned');
  assert.ok(res.data.persona, 'Expected persona to be present');
  assert.strictEqual(typeof res.data.persona.name, 'string');
  assert.ok(res.data.destinations.length >= 6, 'Expected at least 6 destinations');
  assert.ok(res.data.projects.length >= 3, 'Expected at least 3 projects');
  assert.ok(res.data.skillGroups.length >= 4, 'Expected at least 4 skill groups');
  assert.ok(res.data.experiences.length >= 3, 'Expected at least 3 experiences');
  console.log('  ✔ PASS: fetchPortfolioData provides complete data bundle (live or graceful fallback)');

  // Test 2: Validation of Contact submission payload error handling
  const failedContact = await sendContactMessage({
    name: '',
    email: 'not-an-email',
    content: '',
  });
  assert.strictEqual(failedContact.success, false, 'Expected invalid contact to fail gracefully');
  console.log('  ✔ PASS: sendContactMessage gracefully handles rejection or validation failures');

  console.log('\nAll API & Fallback tests passed successfully.');
}

