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
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => 
        `${file.file.name}: ${file.errors.map(e => e.message).join(', ')}`
      );
      toast.error(`Upload failed: ${errors.join('; ')}`);
      return;
    }

    acceptedFiles.forEach(file => {
      // Keep the original file object and add metadata separately
      const fileWithMetadata = {
        originalFile: file,  // Store original File object
        id: Date.now() + Math.random(),
        status: 'pending',
        name: file.name,
        size: file.size,
        type: file.type
      };
      
      setUploadedFiles(prev => [...prev, fileWithMetadata]);
      simulateUpload(fileWithMetadata);
    });
  }, []);

  const simulateUpload = async (fileWithMetadata) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          setUploadedFiles(prevFiles => 
            prevFiles.map(f => 
              f.id === fileWithMetadata.id ? { ...f, status: 'completed' } : f
            )
          );
          
          processFile(fileWithMetadata);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const processFile = async (fileWithMetadata) => {
    try {
      const file = fileWithMetadata.originalFile; // Get the original File object
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          let data;

          if (file.name.endsWith('.json')) {
            data = JSON.parse(text);
          } else if (file.name.endsWith('.csv')) {
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length === 0) {
              throw new Error('CSV file is empty');
            }
            
            const headers = lines[0].split(',').map(h => h.trim());
            data = lines.slice(1).map((line, index) => {
              const values = line.split(',');
              const obj = {};
              headers.forEach((header, i) => {
                obj[header] = values[i] ? values[i].trim().replace(/^"|"$/g, '') : '';
              });
              obj.id = index + 1;
              return obj;
            }).filter(obj => {
              return Object.values(obj).some(value => value && value !== '');
            });
          } else if (file.name.endsWith('.xlsx')) {
            toast.error('XLSX files require additional processing. Please use JSON or CSV format.');
            setUploadedFiles(prev => 
              prev.map(f => 
                f.id === fileWithMetadata.id ? { ...f, status: 'error' } : f
              )
            );
            return;
          }

          if (!Array.isArray(data)) {
            throw new Error('File must contain an array of objects');
          }

          if (data.length === 0) {
            throw new Error('File contains no data');
          }

          const hasCommentField = data.some(item => 
            item && (item.comment || item.feedback || item.text || item.message)
          );

          if (!hasCommentField) {
            toast.warning('No comment/feedback fields found. Make sure your data has "comment", "feedback", or "text" fields.');
          }

          if (onFileUpload) {
            onFileUpload(data, file);
          }
          
          toast.success(`${file.name} uploaded successfully! Found ${data.length} records.`);
          
        } catch (parseError) {
          console.error('File parsing error:', parseError);
          toast.error(`Error parsing ${file.name}: ${parseError.message}`);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileWithMetadata.id ? { ...f, status: 'error' } : f
            )
          );
        }
      };

      reader.onerror = () => {
        console.error('File reading error:', reader.error);
        toast.error(`Error reading ${file.name}`);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileWithMetadata.id ? { ...f, status: 'error' } : f
          )
        );
      };

      // This should now work correctly
      reader.readAsText(file);
      
    } catch (error) {
      console.error('File processing error:', error);
      toast.error(`Error processing file: ${error.message}`);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileWithMetadata.id ? { ...f, status: 'error' } : f
        )
      );
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
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
    <Card className="file-upload-card shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaUpload className="me-2" />
            Upload Consultation Data
          </h5>
          {uploadedFiles.length > 0 && (
            <Button variant="outline-secondary" size="sm" onClick={clearAllFiles}>
              Clear All
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <div
          {...getRootProps()}
          className={`file-upload-area p-4 border-2 border-dashed rounded text-center ${
            isDragActive ? 'border-primary bg-light' : 'border-muted'
          } ${isUploading ? 'opacity-50' : ''}`}
          style={{ 
            cursor: isUploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <div className="text-center">
            <FaFileAlt size={48} className={`mb-3 ${isDragActive ? 'text-primary' : 'text-muted'}`} />
            {isDragActive ? (
              <p className="mb-2 text-primary fw-bold">Drop the file here...</p>
            ) : (
              <>
                <p className="mb-2">
                  Drag & drop your consultation data file here, or{' '}
                  <Button variant="link" className="p-0 fw-bold" disabled={isUploading}>
                    browse
                  </Button>
                </p>
                <small className="text-muted">
                  Supported formats: JSON, CSV (Max 10MB)
                  <br />
                  <strong>Required fields:</strong> comment, feedback, or text
                </small>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Processing file...</small>
              <small className="text-muted">{uploadProgress}%</small>
            </div>
            <ProgressBar now={uploadProgress} animated variant="primary" />
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h6 className="mb-3">
              <FaFileAlt className="me-2" />
              Uploaded Files ({uploadedFiles.length})
            </h6>
            <ListGroup variant="flush">
              {uploadedFiles.map(fileMetadata => (
                <ListGroup.Item 
                  key={fileMetadata.id} 
                  className="d-flex justify-content-between align-items-center border rounded mb-2"
                >
                  <div className="d-flex align-items-center">
                    <FaFileAlt className="text-primary me-3" size={20} />
                    <div>
                      <div className="fw-medium">{fileMetadata.name}</div>
                      <small className="text-muted">
                        {(fileMetadata.size / 1024).toFixed(1)} KB • {fileMetadata.type || 'Unknown type'}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {fileMetadata.status === 'pending' && (
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Processing...</span>
                      </div>
                    )}
                    {fileMetadata.status === 'completed' && (
                      <FaCheckCircle className="text-success me-2" size={20} />
                    )}
                    {fileMetadata.status === 'error' && (
                      <Alert variant="danger" className="py-1 px-2 mb-0 me-2 small">
                        Error
                      </Alert>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFile(fileMetadata.id)}
                      disabled={isUploading && fileMetadata.status === 'pending'}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <Alert variant="info" className="mt-4 mb-0">
          <div className="d-flex">
            <div className="me-2">💡</div>
            <div>
              <strong>Tip:</strong> For best results, ensure your file contains a 'comment', 'feedback', or 'text' 
              field with the stakeholder comments you want to analyze.
              <br />
              <small className="mt-1 d-block">
                Example JSON structure: <code>[{`{"comment": "Great proposal!", "date": "2025-09-03"}`}]</code>
              </small>
            </div>
          </div>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default FileUpload;
