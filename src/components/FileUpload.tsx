import React, { useRef, useState } from 'react';
import { messages, type Lang } from '../utils/i18n';

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
  lang: Lang;
}

export function FileUpload({ onFile, disabled, lang }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const t = messages(lang);

  function handleFile(file: File | undefined) {
    if (file) onFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    // The app also accepts drops anywhere on the page; don't open the file twice.
    e.stopPropagation();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    // dragleave also fires when moving onto a child element
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setDragging(false);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  }

  function openPicker() {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div
      className={`file-upload${dragging ? ' file-upload--drag' : ''}${disabled ? ' file-upload--disabled' : ''}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={openPicker}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPicker();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".evtx"
        style={{ display: 'none' }}
        onChange={onInputChange}
        disabled={disabled}
      />
      <div className="file-upload__icon">📂</div>
      <div className="file-upload__text">{t.uploadText}</div>
      <div className="file-upload__hint">{t.uploadHint}</div>
    </div>
  );
}
