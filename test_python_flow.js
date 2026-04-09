const API = 'http://localhost:5001/api';

async function testPythonFlow() {
  console.log("1. Generating Python challenge...");
  let res = await fetch(`${API}/resources/coding-challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'Arrays', level: 'Beginner', language: 'python' })
  });
  const challenge = await res.json();
  
  if (!challenge.driverCode) {
    console.error("Failed to generate challenge", challenge);
    return;
  }
  
  const name = challenge.function_signature.name;
  
  // Real logical implementation to find max element in an array
  let code = `
def ${name}(arr):
    return max(arr)
`;
  
  console.log("2. Running code...");
  
  try {
    res = await fetch(`${API}/resources/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'python',
        code: code,
        driverCode: challenge.driverCode,
        testCases: challenge.testCases
      })
    });
    
    const result = await res.json();
    console.log("3. Result (Passed = " + result.passed + "):");
    console.log(JSON.stringify(result, null, 2));
  } catch(e) {
    console.error("Execution failed", e);
  }
}

testPythonFlow();
