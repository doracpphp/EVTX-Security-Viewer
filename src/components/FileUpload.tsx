import React, { useRef, useState } from 'react';

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.evtx')) {
      alert('EVTXファイルを選択してください。');
      return;
    }
    onFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave() {
    setDragging(false);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  }

  return (
    <div
      className={`file-upload${dragging ? ' file-upload--drag' : ''}${disabled ? ' file-upload--disabled' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
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
      <div className="file-upload__text">
        EVTXファイルをドロップ、またはクリックして選択
      </div>
      <div className="file-upload__hint">.evtx ファイルのみ対応</div>
    </div>
  );
}
