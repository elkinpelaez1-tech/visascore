async function test() {
  try {
    const res = await fetch('http://localhost:10000/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testId: 'test_final_ok' })
    });
    const data = await res.json();
    console.log('Success:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
