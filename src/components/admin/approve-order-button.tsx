"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentInfo } from "@payloadcms/ui";
import { approveOrderAction } from "@/actions/admin-orders";

export function ApproveOrderButton() {
  const { id, initialData } = useDocumentInfo();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const order = initialData as { type?: string; status?: string } | undefined;
  const visible = order?.type === "pre_order" && order?.status === "pending_approval";
  if (!visible || id == null) return null;

  const handleApprove = async () => {
    if (loading) return;
    if (!reason.trim()) {
      setError("Alasan wajib diisi.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await approveOrderAction(Number(id), reason);
      if (!result.ok) {
        setError(result.error ?? "Gagal menyetujui.");
        return;
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyetujui.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem 0" }}>
      <label htmlFor="approve-reason" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
        Alasan persetujuan (wajib)
      </label>
      <textarea
        id="approve-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Contoh: dikonfirmasi via WhatsApp dengan pelanggan"
        rows={2}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      />
      <button
        type="button"
        onClick={handleApprove}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          border: 0,
          background: loading ? "#ccc" : "#1e7e34",
          color: "#fff",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer",
        }}
      >
        {loading ? "Memproses..." : "Setujui Pre-Order"}
      </button>
      {error ? <p style={{ color: "#c62828", marginTop: "0.5rem" }}>{error}</p> : null}
    </div>
  );
}