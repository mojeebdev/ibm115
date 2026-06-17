"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

export interface MemoryFormValues {
  name: string;
  product: string;
  year: string;
  price: string;
  personalMemory: string;
  shareToX: boolean;
  photo: File | null;
}

interface MemoryFormProps {
  onSubmit: (values: MemoryFormValues) => void;
  isSubmitting: boolean;
}

export default function MemoryForm({ onSubmit, isSubmitting }: MemoryFormProps) {
  const [form, setForm] = useState({
    name: "",
    product: "",
    year: "",
    price: "",
    personalMemory: "",
    shareToX: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.product.trim()) newErrors.product = "Product is required";
    if (!form.year.trim()) {
      newErrors.year = "Year is required";
    } else {
      const y = parseInt(form.year, 10);
      if (isNaN(y) || y < 1911 || y > 2026) {
        newErrors.year = "Year must be between 1911 and 2026";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Photo must be under 5MB" }));
      return;
    }

    let processed = file;
    if (file.size > 2 * 1024 * 1024) {
      processed = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
      });
    }

    setPhoto(processed);
    setPhotoPreview(URL.createObjectURL(processed));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, photo });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Your Name *
          </label>
          <input
            id="name"
            className={`form-input${errors.name ? " error" : ""}`}
            placeholder="John Watson"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={isSubmitting}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="product">
            Your First IBM Product *
          </label>
          <input
            id="product"
            className={`form-input${errors.product ? " error" : ""}`}
            placeholder="IBM Personal Computer 5150"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            disabled={isSubmitting}
          />
          {errors.product && (
            <span className="form-error">{errors.product}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="year">
            Year You Got It *
          </label>
          <input
            id="year"
            type="number"
            min={1911}
            max={2026}
            className={`form-input${errors.year ? " error" : ""}`}
            placeholder="1984"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            disabled={isSubmitting}
          />
          {errors.year && <span className="form-error">{errors.year}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="price">
            Price You Paid (optional)
          </label>
          <input
            id="price"
            className="form-input"
            placeholder="$3,000 USD"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="memory">
            Your Memory (optional)
          </label>
          <textarea
            id="memory"
            className="form-textarea"
            rows={4}
            placeholder="It sat in the corner of our living room..."
            value={form.personalMemory}
            onChange={(e) =>
              setForm({ ...form, personalMemory: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="photo">
            Upload a Photo (optional)
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={isSubmitting}
            style={{ fontSize: "13px", color: "var(--ink-secondary)" }}
          />
          {errors.photo && (
            <span className="form-error">{errors.photo}</span>
          )}
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              style={{
                marginTop: "12px",
                maxHeight: "160px",
                borderRadius: "4px",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            className={`toggle${form.shareToX ? " active" : ""}`}
            onClick={() =>
              !isSubmitting && setForm({ ...form, shareToX: !form.shareToX })
            }
            role="switch"
            aria-checked={form.shareToX}
          >
            <div className="toggle-knob" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--ink-secondary)",
            }}
          >
            Share to X?
          </span>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
          style={{ width: "100%" }}
        >
          {isSubmitting ? "Encoding..." : "Encode My Memory →"}
        </button>
      </div>
    </form>
  );
}