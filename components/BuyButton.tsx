"use client";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
};

const paymentMethods = [
  { id: "payoneer", label: "Payoneer", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "skrill", label: "Skrill", detail: "fozlulhoqueinfo@gmail.com" },
  { id: "binance", label: "Binance Pay", detail: "Binance ID: 123456789" },
];

export default function BuyButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [name, setName] = useState("");
  const [txnId, setTxnId] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setTxnId("");
    setEmail("");
    setName("");
  };

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submitOrder = async () => {
    if (!name || !email || !txnId) return;
    setLoading(true);
    setErrorMsg("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        name,
        email,
        transactionId: txnId,
        paymentMethod,
        amount: product.price,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="buy-now-btn">
        Buy Now — ${product.price}
      </button>

      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={close}>✕</button>

            {!submitted ? (
              <>
                <span className="modal-eyebrow">CHECKOUT</span>
                <h3 className="modal-title">{product.name}</h3>
                <p className="modal-price">${product.price}</p>

                <div className="method-list">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      className={`method-item ${paymentMethod === m.id ? "method-active" : ""}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      <span>{m.label}</span>
                      {paymentMethod === m.id && <span className="dot" />}
                    </button>
                  ))}
                </div>

                <div className="pay-instructions">
                  Send <strong>${product.price}</strong> to:
                  <div className="pay-detail">
                    {paymentMethods.find((m) => m.id === paymentMethod)?.detail}
                  </div>
                </div>

                <input
                  className="input"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="input"
                  type="email"
                  placeholder="Your email (for download link)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Transaction ID"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                />

                <button className="submit-btn" onClick={submitOrder} disabled={loading}>
                  {loading ? "Submitting..." : "Submit Order"}
                </button>
                {errorMsg && <p className="modal-note" style={{ color: "#e0303f" }}>{errorMsg}</p>}
                <p className="modal-note">
                  Payment verify হওয়ার পর download link email এ পাঠানো হবে।
                </p>
              </>
            ) : (
              <div className="success-box">
                <div className="success-icon">✓</div>
                <h3 className="modal-title">Order Received</h3>
                <p className="modal-note">
                  আপনার order verify হচ্ছে। Confirm হলে download link{" "}
                  <strong>{email}</strong> এ পাঠানো হবে।
                </p>
                <button className="submit-btn" onClick={close}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .buy-now-btn {
          background: #e0303f;
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .buy-now-btn:hover { background: #c22530; }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(20,20,20,0.45);
          backdrop-filter: blur(4px); display: flex; align-items: center;
          justify-content: center; z-index: 200; padding: 20px;
        }
        .modal {
          background: #fff; border: 1px solid #ececec; border-radius: 18px;
          padding: 32px; width: 100%; max-width: 420px; position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .modal-close {
          position: absolute; top: 18px; right: 18px; background: none;
          border: none; color: #aaa; font-size: 16px; cursor: pointer;
        }
        .modal-eyebrow { color: #e0303f; font-size: 11.5px; font-weight: 700; letter-spacing: 0.1em; }
        .modal-title { color: #111; font-size: 22px; font-weight: 800; margin: 8px 0 4px 0; }
        .modal-price { color: #e0303f; font-size: 26px; font-weight: 800; margin: 0 0 20px 0; }
        .method-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .method-item {
          display: flex; align-items: center; justify-content: space-between;
          background: #f7f7f7; border: 1px solid #e8e8e8; color: #444;
          padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
        }
        .method-active { border-color: #e0303f; color: #111; background: #fff5f5; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #e0303f; }
        .pay-instructions {
          background: #f7f7f7; border: 1px dashed #ddd; border-radius: 10px;
          padding: 14px 16px; color: #777; font-size: 13px; margin-bottom: 18px;
        }
        .pay-detail { color: #111; font-weight: 700; margin-top: 4px; word-break: break-all; }
        .input {
          width: 100%; background: #fff; border: 1px solid #ddd; color: #111;
          padding: 12px 14px; border-radius: 10px; font-size: 14px; margin-bottom: 10px;
          outline: none; box-sizing: border-box;
        }
        .input:focus { border-color: #e0303f; }
        .submit-btn {
          width: 100%; background: #e0303f; color: #fff; border: none; padding: 13px;
          border-radius: 10px; font-size: 14.5px; font-weight: 700; cursor: pointer; margin-top: 6px;
        }
        .submit-btn:hover { background: #c22530; }
        .modal-note { color: #999; font-size: 12px; margin-top: 12px; line-height: 1.5; }
        .success-box { text-align: center; padding: 10px 0; }
        .success-icon {
          width: 56px; height: 56px; border-radius: 50%; background: rgba(224,48,63,0.1);
          color: #e0303f; font-size: 26px; display: flex; align-items: center;
          justify-content: center; margin: 0 auto 16px auto;
        }
      `}</style>
    </>
  );
}