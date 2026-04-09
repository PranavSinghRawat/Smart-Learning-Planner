const API = 'http://localhost:5001/api';

async function testBinaryTrees(language) {
  console.log(`\n=== Testing [Binary Trees] in [${language}] ===`);
  try {
    let res = await fetch(`${API}/resources/coding-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'Binary Trees', level: 'Beginner', language })
    });
    const challenge = await res.json();
    
    if (!challenge.driverCode) {
      console.error("Failed to generate challenge", challenge);
      return false;
    }
    
    const sig = challenge.function_signature;
    console.log("Challenge Signature:", sig);
    
    // We inject the original returned code logic to simply compile
    let code = challenge.starterCode;
    
    res = await fetch(`${API}/resources/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language,
        code,
        driverCode: challenge.driverCode,
        testCases: challenge.testCases
      })
    });
    
    const result = await res.json();
    
    if (result.message === "Compilation Error") {
      console.error(`💥 [${language}] COMPILATION FAILED:`, result.error);
      return false;
    } else if (result.testResults && result.testResults.some(t => t.error)) {
      console.error(`💥 [${language}] RUNTIME ERROR:`, result.testResults.find(t => t.error).error);
      return false;
    } else {
      console.log(`✅ [${language}] Compiled and executed safely! Binary Tree Parsing Success.`);
      return true;
    }
  } catch(e) {
    console.error(`💥 Request failed`, e);
    return false;
  }
}

async function runTreeTests() {
  await testBinaryTrees('java');
  await testBinaryTrees('python');
}

runTreeTests();
