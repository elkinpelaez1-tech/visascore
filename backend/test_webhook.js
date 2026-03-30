async function testWebhook() {
  try {
    const res = await fetch('http://localhost:10000/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          transaction: {
            id: 'webhook-sim-001',
            reference: 'test_final_ok',
            status: 'APPROVED',
            amount_in_cents: 5000000,
            payment_method_type: 'CARD'
          }
        }
      })
    });
    console.log('Webhook Send Response:', res.status, await res.text());
  } catch (err) {
    console.error('Error:', err.message);
  }
}
testWebhook();
