import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, X, CheckCircle, AlertCircle, Trash2, FileText } from 'lucide-react';
import './FileUploader.css';

const FileUploader = ({ onFilesChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    // Check if PDF
    if (file.type !== "application/pdf" && !file.name.endsWith('.pdf')) {
      setError("Solo se admiten archivos en formato PDF (.pdf)");
      return false;
    }
    // Limit to 10MB
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("El archivo excede el tamaño máximo permitido de 10 MB");
      return false;
    }
    setError('');
    return true;
  };

  const simulateUpload = (newFile) => {
    const fileId = Math.random().toString(36).substring(2, 9);
    const fileEntry = {
      id: fileId,
      name: newFile.name,
      size: (newFile.size / (1024 * 1024)).toFixed(2) + " MB",
      progress: 0,
      status: 'uploading', // 'uploading', 'success', 'error'
    };

    setFiles((prev) => [...prev, fileEntry]);

    // Simulate progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setFiles((prev) => 
        prev.map((f) => {
          if (f.id === fileId) {
            const finished = currentProgress >= 100;
            if (finished) clearInterval(interval);
            return {
              ...f,
              progress: Math.min(currentProgress, 100),
              status: finished ? 'success' : 'uploading'
            };
          }
          return f;
        })
      );
    }, 150);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        simulateUpload(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        simulateUpload(selectedFile);
      }
    }
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const triggerFileInput = () => {
    inputRef.current.click();
  };

  return (
    <div className="file-uploader-wrapper">
      {/* Drag & drop Container */}
      <motion.div
        className={`drag-area ${dragActive ? 'active-drag' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <input
          ref={inputRef}
          type="file"
          className="file-input-hidden"
          accept=".pdf"
          onChange={handleChange}
        />
        
        <div className="drag-content">
          <motion.div
            animate={dragActive ? { y: -8, scale: 1.1 } : { y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <UploadCloud size={48} className="upload-icon" />
          </motion.div>
          
          <h3>Arrastra y suelta tu archivo PDF aquí</h3>
          <p>O haz clic para explorar tus archivos</p>
          <span className="file-hint">Formatos soportados: PDF únicamente (Máx. 10MB)</span>
        </div>

        {/* Pulsating border effect when dragging */}
        <AnimatePresence>
          {dragActive && (
            <motion.div 
              className="drag-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>¡Suelta el PDF ahora!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files Queue */}
      {files.length > 0 && (
        <div className="files-queue">
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.8rem', color: 'var(--text-main)' }}>Archivos cargados</h4>
          <div className="files-list">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div 
                  key={file.id} 
                  className="file-item card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                >
                  <div className="file-info-container">
                    <FileText size={28} className="file-icon-doc primary-color" />
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{file.size}</span>
                    </div>
                  </div>

                  {file.status === 'uploading' ? (
                    <div className="file-progress-container">
                      <div className="progress-bar-bg">
                        <motion.div 
                          className="progress-bar-fill" 
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <span className="progress-pct">{file.progress}%</span>
                    </div>
                  ) : (
                    <div className="file-status-actions">
                      <div className="status-badge-success">
                        <CheckCircle size={16} /> Cargado
                      </div>
                      <button 
                        type="button" 
                        className="delete-file-btn" 
                        onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
