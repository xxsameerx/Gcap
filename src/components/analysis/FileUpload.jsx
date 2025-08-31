import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, Button, Alert, ProgressBar, ListGroup } from 'react-bootstrap';
import { FaUpload, FaFileAlt, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FileUpload = ({ onFileUpload, acceptedFiles = ['.json', '.csv', '.xlsx'] }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => 
        `${file.file.name}: ${file.errors.map(e => e.message).join(', ')}`
      );
      toast.error(`Upload failed: ${errors.join('; ')}`);
      return;
    }

    // Process accepted files
    acceptedFiles.forEach(file => {
      const fileWithId = {
        ...file,
        id: Date.now() + Math.random(),
        status: 'pending'
      };
      
      setUploadedFiles(prev => [...prev, fileWithId]);
      simulateUpload(fileWithId);
    });
  }, []);

  const simulateUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Update file status to completed
          setUploadedFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === file.id ? { ...f, status: 'completed' } : f
            )
          );
          
          // Process file content
          processFile(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const processFile = async (file) => {
    try {
      const text = await file.text();
      let data;

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        // Basic CSV parsing (you might want to use a proper CSV parser)
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {});
        });
      }

      if (onFileUpload) {
        onFileUpload(data, file);
      }
      
      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      toast.error(`Error processing ${file.name}: ${error.message}`);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <Card className="file-upload-card">
      <Card.Header>
        <h5 className="mb-0">
          <FaUpload className="me-2" />
          Upload Consultation Data
        </h5>
      </Card.Header>
      <Card.Body>
        <div
          {...getRootProps()}
          className={`file-upload-area ${isDragActive ? 'dragover' : ''} ${isUploading ? 'uploading' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <FaFileAlt size={48} className="text-muted mb-3" />
            {isDragActive ? (
              <p className="mb-2">Drop the file here...</p>
            ) : (
              <>
                <p className="mb-2">
                  Drag & drop your consultation data file here, or{' '}
                  <Button variant="link" className="p-0">
                    browse
                  </Button>
                </p>
                <small className="text-muted">
                  Supported formats: JSON, CSV, XLSX (Max 10MB)
                </small>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Uploading...</small>
              <small className="text-muted">{uploadProgress}%</small>
            </div>
            <ProgressBar now={uploadProgress} animated />
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h6>Uploaded Files</h6>
            <ListGroup variant="flush">
              {uploadedFiles.map(file => (
                <ListGroup.Item 
                  key={file.id} 
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <FaFileAlt className="text-primary me-2" />
                    <div>
                      <div className="fw-medium">{file.name}</div>
                      <small className="text-muted">
                        {(file.size / 1024).toFixed(1)} KB
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {file.status === 'completed' && (
                      <FaCheckCircle className="text-success me-2" />
                    )}
                    {file.status === 'error' && (
                      <Alert variant="danger" className="py-1 px-2 mb-0 me-2">
                        Error
                      </Alert>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <Alert variant="info" className="mt-3">
          <small>
            <strong>Tip:</strong> For best results, ensure your file contains a 'comment' or 'feedback' 
            field with the stakeholder comments you want to analyze.
          </small>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default FileUpload;
