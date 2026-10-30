import { useRef, useState } from "react";
import { uploadService } from "../../services/upload";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadService.image(file);
        uploaded.push(res.data.url);
      }
      onChange([...images, ...uploaded]);
    } catch {
      setError("Some images failed to upload. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => onChange(images.filter((i) => i !== url));

  return (
    <div>
      <span className="block font-sans text-xs tracking-wider uppercase text-charcoal/50 mb-2">Product images</span>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-hairline overflow-hidden group">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(src)} className="absolute top-1 right-1 bg-ink text-bone text-xs w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-block border border-hairline px-4 py-2 text-xs tracking-wider uppercase cursor-pointer hover:border-champagne transition-colors">
        {uploading ? "Uploading…" : "+ Upload images"}
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} disabled={uploading} className="hidden" />
      </label>

      {error && <p className="text-red-700 text-xs mt-2 font-sans">{error}</p>}
    </div>
  );
}