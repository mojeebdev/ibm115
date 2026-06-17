"use client";

import { useState, useCallback } from "react";
import MemoryForm, { MemoryFormValues } from "@/components/MemoryForm";
import TypewriterCard from "@/components/TypewriterCard";
import SubmitIntro from "@/components/SubmitIntro";
import ShareButton from "@/components/ShareButton";
import { saveMemory, type Memory } from "@/lib/firestore";

export default function SubmitPage() {
  const [aiText, setAiText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMemory, setSavedMemory] = useState<Memory | null>(null);
  const [formValues, setFormValues] = useState<MemoryFormValues | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: MemoryFormValues) => {
    setIsSubmitting(true);
    setIsGenerating(true);
    setAiText("");
    setSavedMemory(null);
    setFormValues(values);
    setError("");

    try {
      const res = await fetch("/api/generate-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          product: values.product,
          year: parseInt(values.year, 10),
          price: values.price || undefined,
        }),
      });

      if (!res.ok) throw new Error("AI generation failed");
      const { text } = await res.json();
      setIsGenerating(false);
      setAiText(text);
    } catch {
      setIsSubmitting(false);
      setIsGenerating(false);
      setError("Something went wrong generating your memory. Please try again.");
    }
  };

  const handleTypewriterComplete = useCallback(async () => {
    if (!formValues || !aiText || savedMemory) return;

    try {
      const memory = await saveMemory({
        name: formValues.name,
        product: formValues.product,
        year: parseInt(formValues.year, 10),
        price: formValues.price || undefined,
        personalMemory: formValues.personalMemory || undefined,
        aiResponse: aiText,
        photo: formValues.photo || undefined,
        shareToX: formValues.shareToX,
      });
      setSavedMemory(memory);
    } catch {
      setError("Memory generated but failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, aiText, savedMemory]);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://ibm115.vercel.app";

  return (
    <main className="page-container">
      <div style={{ marginBottom: "48px" }}>
        <p className="page-eyebrow">Share Your Memory</p>
        <h1 className="page-title" style={{ fontSize: "var(--text-h2)" }}>
          Encode Your IBM Story
        </h1>
        <p className="page-subtitle">
          Tell us about your first IBM product. Our institutional memory will
          respond on the Selectric.
        </p>
      </div>

      {error && (
        <p style={{ color: "#e63b2e", marginBottom: "24px", fontSize: "14px" }}>
          {error}
        </p>
      )}

      <div className="submit-grid">
        <div className="submit-form-column">
          <SubmitIntro />
          <MemoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        <div className="submit-typewriter-column">
          <TypewriterCard
            text={aiText}
            isGenerating={isGenerating}
            year={formValues ? parseInt(formValues.year, 10) : undefined}
            name={formValues?.name}
            onComplete={handleTypewriterComplete}
          />

          {savedMemory && (
            <div className="submit-success-banner">
              <p>Your memory is now part of IBM history.</p>
              <p className="submit-success-url">
                {baseUrl}/m/{savedMemory.slug}
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {savedMemory.shareToX && <ShareButton memory={savedMemory} />}
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ padding: "8px 16px", fontSize: "10px" }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${baseUrl}/m/${savedMemory.slug}`
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}