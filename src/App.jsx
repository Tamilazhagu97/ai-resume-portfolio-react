import React, { useState, useCallback } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, Loader2, FileText, Sparkles, Globe, Zap, Cpu, Brain } from 'lucide-react';

const API_BASE = 'http://localhost:3300/api';

export default function ResumePortfolioGenerator() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [portfolioId, setPortfolioId] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadStatus('success');

      const id = data.portfolioId || data.id || data.filename || data.fileName;
      console.log('Portfolio ID:', id);
      console.log('Full response:', data);
      setPortfolioId(id);
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = () => {
    if (!portfolioId) return;
    setShowPreview(true);
  };

  const handlePreviewNewTab = () => {
    if (!portfolioId) return;
    window.open(`${API_BASE}/preview/${portfolioId}`, '_blank');
  };

  const handleDownload = async () => {
    if (!portfolioId) return;

    try {
      const response = await fetch(`${API_BASE}/download/${portfolioId}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-${portfolioId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download portfolio. Please try again.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploadStatus(null);
    setPortfolioId(null);
    setError(null);
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Animated Background - Light theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay - Light */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Preview Modal */}
      {showPreview && portfolioId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-blue-200 rounded-3xl shadow-2xl shadow-blue-500/20 w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Portfolio Preview
                </h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePreviewNewTab}
                  className="px-5 py-2.5 bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-700 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              <iframe
                src={`${API_BASE}/preview/${portfolioId}`}
                className="w-full h-full border-0 rounded-2xl bg-white"
                title="Portfolio Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative border-b border-blue-200 backdrop-blur-xl bg-white/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-300/50">
                <Brain className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                  AI Portfolio Generator
                </h1>
                <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  Neural-Powered Portfolio Creation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700">System Online</span>
              </div>
              <Cpu className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Status Card */}
        {uploadStatus === 'success' && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-300 rounded-2xl p-6 backdrop-blur-xl shadow-xl shadow-emerald-200/30 animate-in slide-in-from-top duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-900">Portfolio Generated Successfully!</h3>
                  <p className="text-sm text-emerald-700 mt-1">Your AI-powered portfolio is ready to preview and download</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handlePreview}
                  type="button"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-300/30 hover:shadow-xl hover:shadow-blue-400/40 hover:scale-105"
                >
                  <Globe className="w-5 h-5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={handleDownload}
                  type="button"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-emerald-300/30 hover:shadow-xl hover:shadow-emerald-400/40 hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Status Card */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-300 rounded-2xl p-6 backdrop-blur-xl shadow-xl shadow-red-200/30 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl border border-red-300">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">System Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Upload Card */}
        <div className="relative bg-white backdrop-blur-xl rounded-3xl border border-blue-200 shadow-2xl shadow-blue-200/20 overflow-hidden">
          {/* Holographic Effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50"></div>

          <div className="p-8 sm:p-12">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-300 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 font-medium">AI-Powered Transformation</span>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                Upload Your Resume
              </h2>
              <p className="text-slate-600">Neural networks will transform your resume into a stunning portfolio</p>
            </div>

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${dragActive
                ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-300/30'
                : 'border-blue-300 bg-slate-50 hover:border-blue-400/70 hover:bg-blue-50/50'
                }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />

              {/* Scanning Lines Effect */}
              {dragActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan"></div>
                </div>
              )}

              <div className="flex flex-col items-center space-y-6 relative z-0">
                <div className={`relative p-6 rounded-2xl transition-all duration-300 ${dragActive ? 'bg-blue-200/30 scale-110' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
                  }`}>
                  {file ? (
                    <>
                      <FileText className="w-16 h-16 text-blue-500" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <Upload className="w-16 h-16 text-blue-500" />
                  )}

                  {/* Corner Accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-blue-400"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-blue-400"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-purple-400"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-purple-400"></div>
                </div>

                {file ? (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-slate-900">{file.name}</p>
                    <p className="text-sm text-purple-600 mt-2 flex items-center gap-2 justify-center">
                      <CheckCircle className="w-4 h-4" />
                      File loaded • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-slate-900">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-purple-600 mt-2">
                      or click to browse files
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-700">PDF files only • Max 10MB</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${!file || uploading
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl shadow-purple-300/30 hover:shadow-2xl hover:shadow-purple-400/40 hover:scale-[1.02] border border-blue-400/30'
                  }`}
              >
                {!file || uploading ? null : (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing Neural Network...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6" />
                    <span>Generate AI Portfolio</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>

              {(file || uploadStatus) && (
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  Reset System
                </button>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 border-t border-blue-200 px-8 sm:px-12 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group p-6 bg-white border border-blue-200 rounded-xl hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-200/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Neural AI</h3>
                    <p className="text-sm text-blue-700">Advanced content extraction</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-white border border-purple-200 rounded-xl hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-200/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 border border-purple-300 rounded-lg group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-1">Smart Design</h3>
                    <p className="text-sm text-purple-700">Professional layouts</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 bg-white border border-pink-200 rounded-xl hover:border-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-200/30">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-100 border border-pink-300 rounded-lg group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-pink-900 mb-1">Instant Export</h3>
                    <p className="text-sm text-pink-700">Ready-to-use HTML</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <div className="text-blue-600/60 text-sm flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Powered by Advanced Neural Networks</span>
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 py-8 border-t border-blue-200 backdrop-blur-xl bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-blue-600/70 flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>UI/UX Innovation Lab • AI-Assisted Design</span>
            <Brain className="w-4 h-4" />
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}} />
    </div>
  );
}