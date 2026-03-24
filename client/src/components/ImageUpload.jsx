import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ImageUpload({ value, onChange, label = 'Image' }) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  async function uploadFile(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large (max 5 MB)');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Upload failed');
      }
      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    } else {
      setError('Only image files are allowed');
    }
  }

  function handleFileChange(e) {
    uploadFile(e.target.files?.[0]);
    e.target.value = '';
  }

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {/* Drop zone */}
      <div
        className={`image-upload-zone${dragOver ? ' image-upload-zone--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        {value ? (
          <div className="image-upload-preview">
            <img src={value} alt="Preview" onError={e => { e.target.style.display = 'none'; }} />
            <button
              type="button"
              className="image-upload-remove"
              onClick={e => { e.stopPropagation(); onChange(''); }}
              title="Remove image"
            >
              &times;
            </button>
          </div>
        ) : (
          <div className="image-upload-placeholder">
            {uploading ? (
              <span className="image-upload-spinner" />
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Drop an image here or click to browse</span>
                <span className="image-upload-hint">JPG, PNG, GIF, WebP, SVG — max 5 MB</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* URL fallback */}
      <div className="image-upload-url">
        <span className="image-upload-url-label">or paste URL:</span>
        <input
          type="text"
          className="form-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          style={{ fontSize: '0.825rem' }}
        />
      </div>

      {error && <div className="image-upload-error">{error}</div>}
    </div>
  );
}
