const API = 'http://localhost:5001/api';

async function testTopic(topic, language) {
  console.log(`\n=== Testing [${topic}] in [${language}] ===`);
  try {
    let res = await fetch(`${API}/resources/coding-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level: 'Beginner', language })
    });
    const challenge = await res.json();
    
    if (!challenge.driverCode) {
      console.error("Failed to generate challenge", challenge);
      return false;
    }
    
    const sig = challenge.function_signature;
    console.log("Challenge Signature:", sig);
    
    // We will just execute the starter code as our "solution". 
    // It might return default values (like null or 0) which will fail the test cases logic-wise, 
    // BUT our goal is to check if it COMPILES and RUNS without crashing the executor.
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
      console.log(`✅ [${language}] Compiled and executed safely! (Tests naturally failed due to empty logic, but system is stable)`);
      return true;
    }
  } catch(e) {
    console.error(`💥 Request failed for ${topic}`, e);
    return false;
  }
}

async function runTests() {
  await testTopic('Linked Lists', 'java');
  await testTopic('Strings', 'python');
  await testTopic('Dynamic Programming', 'javascript');
}

runTests();
