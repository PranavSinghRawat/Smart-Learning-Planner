const API = 'http://localhost:5001/api';

async function testFetch() {
  try {
    const res = await fetch(`${API}/resources/coding-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'Arrays', level: 'Beginner', language: 'java' })
    });
    const data = await res.json();
    console.log(data.driverCode);
  } catch (error) {
    console.error(error);
  }
}

testFetch();
