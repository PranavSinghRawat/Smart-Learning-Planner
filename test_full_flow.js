const API = 'http://localhost:5001/api';

async function testFullFlow() {
  console.log("1. Generating challenge...");
  let res = await fetch(`${API}/resources/coding-challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'Arrays', level: 'Beginner', language: 'java' })
  });
  const challenge = await res.json();
  
  if (!challenge.driverCode) {
    console.error("Failed to generate challenge", challenge);
    return;
  }
  
  console.log("Challenge Signature:", challenge.function_signature);
  const name = challenge.function_signature.name;
  
  // Real logical implementation to find max element in an array
  let code = `
public class Solution {
    public int ${name}(int[] arr) {
        int max = Integer.MIN_VALUE;
        for (int i = 0; i < arr.length; i++) {
            max = Math.max(max, arr[i]);
        }
        return max;
    }
}
`;
  
  console.log("2. Running code...");
  console.log("CODE:\n", code);
  
  try {
    res = await fetch(`${API}/resources/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'java',
        code: code,
        driverCode: challenge.driverCode,
        testCases: challenge.testCases
      })
    });
    
    const result = await res.json();
    console.log("3. Result:");
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.passed) {
       console.log("DRIVER CODE THAT WAS USED:\n", challenge.driverCode);
    }
  } catch(e) {
    console.error("Execution failed", e);
  }
}

testFullFlow();
