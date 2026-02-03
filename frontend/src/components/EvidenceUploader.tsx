import { useState, useCallback } from 'react';

interface EvidenceUploaderProps {
    claimId?: number;
    onUploadComplete?: (files: UploadedFile[]) => void;
}

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: Date;
    category: 'document' | 'screenshot' | 'transaction' | 'other';
}

export default function EvidenceUploader({ claimId, onUploadComplete }: EvidenceUploaderProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (fileList: FileList) => {
        setUploading(true);
        const newFiles: UploadedFile[] = [];

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];

            // Simulate upload
            await new Promise(resolve => setTimeout(resolve, 500));

            const uploadedFile: UploadedFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date(),
                category: categorizeFile(file.name)
            };

            newFiles.push(uploadedFile);
        }

        setFiles(prev => [...prev, ...newFiles]);
        setUploading(false);
        onUploadComplete?.(newFiles);
    };

    const categorizeFile = (filename: string): UploadedFile['category'] => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf' || ext === 'doc' || ext === 'docx') return 'document';
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'screenshot';
        if (ext === 'txt' || ext === 'csv') return 'transaction';
        return 'other';
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getCategoryIcon = (category: UploadedFile['category']): string => {
        const icons = {
            document: '📄',
            screenshot: '📸',
            transaction: '💳',
            other: '📎'
        };
        return icons[category];
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Evidence</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Provide supporting documentation for your claim. Accepted formats: PDF, PNG, JPG, TXT, CSV (Max 10MB per file)
                </p>
            </div>

            {/* Upload Area */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${dragActive
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
            >
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.csv"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-6xl mb-4">📎</div>
                    <p className="text-gray-700 font-medium mb-2">
                        {dragActive ? 'Drop files here' : 'Drag and drop files here'}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <div className="inline-block px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition">
                        Browse Files
                    </div>
                </label>
            </div>

            {/* Uploading Progress */}
            {uploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-800">Uploading files...</span>
                    </div>
                </div>
            )}

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Uploaded Files ({files.length})</h4>
                    {files.map(file => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="text-3xl">{getCategoryIcon(file.category)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{file.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {formatFileSize(file.size)} • {file.category} • {file.uploadedAt.toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(file.url, '_blank')}
                                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Evidence Categories Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Evidence Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li><strong>Documents:</strong> Official reports, audit findings, security alerts</li>
                    <li><strong>Screenshots:</strong> Wallet balances, transaction confirmations, error messages</li>
                    <li><strong>Transactions:</strong> Transaction hashes, blockchain explorer links</li>
                    <li><strong>Other:</strong> Communication logs, witness statements, expert opinions</li>
                </ul>
            </div>

            {/* Summary */}
            {files.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Evidence Files:</span>
                        <span className="font-semibold text-gray-900">{files.length}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Total Size:</span>
                        <span className="font-semibold text-gray-900">
                            {formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
