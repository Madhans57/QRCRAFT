import React, { useState, useEffect } from 'react';
import QRious from 'qrious';
import { Download, QrCode, Copy, Check, Link, FileText, Mail, Phone } from 'lucide-react';
import './QRcode.css';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [type, setType] = useState('text');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate QR code whenever text changes
  useEffect(() => {
    if (text.trim() === '') {
      setQrDataUrl('');
      return;
    }

    const qr = new QRious({
      value: text,
      size: 200,
      foreground: '#000',
      background: '#fff'
    });
    setQrDataUrl(qr.toDataURL());
  }, [text]);

  const presets = [
    { id: 'text', label: 'Text', icon: FileText, prefix: '', placeholder: 'Enter text' },
    { id: 'url', label: 'URL', icon: Link, prefix: 'https://', placeholder: 'Enter URL' },
    { id: 'email', label: 'Email', icon: Mail, prefix: 'mailto:', placeholder: 'Enter email' },
    { id: 'phone', label: 'Phone', icon: Phone, prefix: 'tel:', placeholder: 'Enter phone number' },
  ];

  const handlePresetClick = (preset) => {
    setType(preset.id);
    if (!text.startsWith(preset.prefix)) {
      setText(preset.prefix);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    const res = await fetch(qrDataUrl);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="qr-wrapper">
      <div className="qr-container">
        <div className="qr-header">
          <QrCode className="qr-icon" />
          <h1 className="qr-title">QRCraft</h1>
          <p className="qr-subtitle">Generate QR codes for text, URLs, emails, and phones</p>
        </div>

        <div className="qr-grid">
          <div className="qr-panel">
            <h2 className="qr-section-title">Input</h2>

            <div className="qr-types">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePresetClick(p)}
                  className={`qr-type-btn ${type === p.id ? 'active' : ''}`}
                >
                  <p.icon size={18} /> {p.label}
                </button>
              ))}
            </div>

            <label className="qr-label">Content</label>
            <textarea
              className="qr-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={presets.find(p => p.id === type)?.placeholder}
              rows={4}
            />
          </div>

          <div className="qr-panel">
            <h2 className="qr-section-title">Preview</h2>
            {qrDataUrl ? (
              <div className="qr-preview-wrapper">
                <div className="qr-preview">
                  <img src={qrDataUrl} alt="QR Code" width={200} height={200} />
                </div>
                <div className="qr-buttons">
                  <button className="qr-btn blue" onClick={handleDownload}><Download size={20} />Download</button>
                  <button className="qr-btn gray" onClick={handleCopy}>{copied ? <Check size={20} /> : <Copy size={20} />}{copied ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            ) : (
              <div className="qr-empty">
                <QrCode size={64} />
                <p>Enter content</p>
              </div>
            )}
          </div>
        </div>

        <div className="qr-footer">Quick & Easy QR Code Generator</div>
        <div className="qr-footer">Created by Madhan Sundhar</div>
      </div>
    </div>
  );
}

export default QRCodeGenerator;
