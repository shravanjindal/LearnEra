export const buyTokens = async (amount: number, tokens: number, email: string) => {
    const res = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    console.log("Response from create-order API:", res);
    const data = await res.json();
  
    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      order_id: data.id,
      name: "Buy Tokens",
      handler: async (response: any) => {
        await fetch("/api/verify-payment", {
          method: "POST",
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            email,
            tokens,
          }),
        });
  
        alert("Payment Successful!");
      },
      theme: { color: "#6366f1" },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  