"use client";
import { useState } from "react";

type OrderApproveButtonProps = {
  orderId: string;
  status: string;
  onApproved?: () => void;
};

export default function OrderApproveButton({
  orderId,
  status,
  onApproved,
}: OrderApproveButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const approve = async () => {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
      method: "POST",
    });
    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Approval failed");
      return;
    }

    onApproved?.();
  };

  if (status === "approved") {
    return <span className="oab-approved">✓ Approved & Sent</span>;
  }

  return (
    <div>
      <button className="oab-btn" onClick={approve} disabled={loading}>
        {loading ? "Approving..." : "Approve & Send Download"}
      </button>
      {error && <p className="oab-error">{error}</p>}

      <style jsx>{`
        .oab-btn {
          background: #e0303f;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
        }
        .oab-btn:hover {
          background: #c22530;
        }
        .oab-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .oab-approved {
          color: #7ee787;
          font-size: 12.5px;
          font-weight: 700;
        }
        .oab-error {
          color: #e0303f;
          font-size: 11.5px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
