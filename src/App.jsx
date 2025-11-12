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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 via-indigo-950 to-black relative overflow-hidden perspective-container preserve-3d">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none preserve-3d">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse float-3d" style={{ transform: 'translateZ(-200px)' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-700/20 rounded-full blur-3xl animate-pulse delay-1000 float-3d" style={{ transform: 'translateZ(-150px)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl animate-pulse delay-2000 float-3d" style={{ transform: 'translateZ(-100px)' }}></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-emerald-700/15 rounded-full blur-3xl animate-pulse delay-3000 float-3d" style={{ transform: 'translateZ(-180px)' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-rose-700/15 rounded-full blur-3xl animate-pulse delay-4000 float-3d" style={{ transform: 'translateZ(-120px)' }}></div>
      </div>

      {/* 3D Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" style={{ transform: 'translateZ(-50px)' }}></div>
      
      {/* 3D Floating Particles */}
      <div className="absolute inset-0 pointer-events-none preserve-3d">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0 ? 'rgba(34, 211, 238, 0.25)' : i % 3 === 1 ? 'rgba(217, 70, 239, 0.25)' : 'rgba(139, 92, 246, 0.25)',
              transform: `translateZ(${-100 - Math.random() * 200}px)`,
              animation: `float-3d ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${4 + Math.random() * 4}px currentColor`
            }}
          />
        ))}
      </div>

      {/* 3D Preview Modal */}
      {showPreview && portfolioId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 preserve-3d">
          <div className="glass-3d border border-cyan-600/50 rounded-3xl glow-3d w-full max-w-6xl h-[90vh] flex flex-col card-3d preserve-3d" style={{ transform: 'translateZ(100px)' }}>
            <div className="flex items-center justify-between p-6 border-b border-cyan-600/50 bg-gradient-to-r from-cyan-900/40 via-fuchsia-900/40 to-violet-900/40 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse depth-1 shadow-lg shadow-cyan-500/60"></div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400">
                  Portfolio Preview
                </h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePreviewNewTab}
                  className="btn-3d px-5 py-2.5 bg-gradient-to-r from-cyan-600/50 to-fuchsia-600/50 hover:from-cyan-600/60 hover:to-fuchsia-600/60 border border-cyan-500/60 text-cyan-100 rounded-xl font-medium glass-3d preserve-3d shadow-lg shadow-cyan-600/30"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="btn-3d px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800/60 border border-slate-600/50 text-slate-200 rounded-xl font-medium glass-3d preserve-3d"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-2">
              <iframe
                src={`${API_BASE}/preview/${portfolioId}`}
                className="w-full h-full border-0 rounded-2xl bg-white/10 backdrop-blur-sm preserve-3d"
                style={{ transform: 'translateZ(20px)' }}
                title="Portfolio Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3D Header */}
      <header className="relative border-b border-cyan-600/50 backdrop-blur-xl glass-3d sticky top-0 z-40 preserve-3d" style={{ transform: 'translateZ(50px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative p-3 bg-gradient-to-br from-cyan-600 via-fuchsia-600 to-violet-600 rounded-2xl shadow-lg shadow-cyan-600/50 rotate-3d preserve-3d glow-3d" style={{ transform: 'translateZ(30px)' }}>
                <Brain className="w-8 h-8 text-white depth-1" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping depth-4 shadow-lg shadow-emerald-500/60"></div>
              </div>
              <div className="preserve-3d">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 via-violet-400 to-emerald-400 depth-1">
                  AI Portfolio Generator
                </h1>
                <p className="text-sm text-cyan-400 mt-1 flex items-center gap-2 depth-2">
                  <Zap className="w-3 h-3" />
                  Neural-Powered Portfolio Creation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 preserve-3d">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass-3d border border-emerald-600/50 rounded-xl depth-2 shadow-lg shadow-emerald-600/30">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/60"></div>
                <span className="text-sm text-emerald-300">System Online</span>
              </div>
              <Cpu className="w-8 h-8 text-fuchsia-400 animate-pulse depth-3 float-3d" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 3D Error Status Card */}
        {error && (
          <div className="mb-8 glass-3d border border-rose-600/50 rounded-2xl p-6 glow-3d card-3d preserve-3d animate-in slide-in-from-top duration-500" style={{ transform: 'translateZ(60px)' }}>
            <div className="flex items-center gap-4 preserve-3d">
              <div className="p-3 bg-gradient-to-br from-rose-700/40 to-pink-700/40 rounded-xl border border-rose-600/50 rotate-3d preserve-3d shadow-lg shadow-rose-600/30" style={{ transform: 'translateZ(20px)' }}>
                <AlertCircle className="w-6 h-6 text-rose-300" />
              </div>
              <div className="preserve-3d">
                <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 depth-1">System Error</h3>
                <p className="text-sm text-rose-300/90 mt-1 depth-2">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 3D Main Upload Card */}
        <div className="relative glass-3d rounded-3xl border border-cyan-600/50 glow-3d overflow-hidden card-3d preserve-3d" style={{ transform: 'translateZ(80px)' }}>
          {/* 3D Holographic Effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80 depth-4 shadow-lg shadow-cyan-500/60"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-80 depth-4 shadow-lg shadow-fuchsia-500/60"></div>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500 to-transparent opacity-80 depth-4 shadow-lg shadow-violet-500/60"></div>
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent opacity-80 depth-4 shadow-lg shadow-emerald-500/60"></div>

          <div className="p-8 sm:p-12">
            {/* 3D Header Section */}
            <div className="text-center mb-8 preserve-3d">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-3d border border-fuchsia-600/50 rounded-full mb-4 rotate-3d preserve-3d float-3d shadow-lg shadow-fuchsia-600/30" style={{ transform: 'translateZ(25px)' }}>
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span className="text-sm text-fuchsia-300 font-medium">AI-Powered Transformation</span>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 mb-3 depth-1">
                Upload Your Resume
              </h2>
              <p className="text-cyan-300/90 depth-2">Neural networks will transform your resume into a stunning portfolio</p>
            </div>

            {/* 3D Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 preserve-3d card-3d ${dragActive
                ? 'border-cyan-500 bg-gradient-to-br from-cyan-700/30 to-fuchsia-700/30 scale-[1.02] glow-3d shadow-2xl shadow-cyan-600/40'
                : 'border-cyan-600/50 bg-gradient-to-br from-slate-950/50 to-black/50 hover:border-cyan-500/70 hover:bg-gradient-to-br hover:from-cyan-700/20 hover:to-fuchsia-700/20'
                }`}
              style={{ transform: dragActive ? 'translateZ(40px) rotateX(2deg)' : 'translateZ(20px)' }}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />

              {/* 3D Scanning Lines Effect */}
              {dragActive && (
                <div className="absolute inset-0 pointer-events-none preserve-3d">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent scan-3d depth-4 shadow-lg shadow-cyan-500/60"></div>
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent scan-3d depth-4 shadow-lg shadow-fuchsia-500/60" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent scan-3d depth-4 shadow-lg shadow-violet-500/60" style={{ animationDelay: '1s' }}></div>
                </div>
              )}

              <div className="flex flex-col items-center space-y-6 relative z-0 preserve-3d">
                <div className={`relative p-6 rounded-2xl transition-all duration-300 rotate-3d preserve-3d ${dragActive ? 'bg-gradient-to-br from-cyan-700/50 to-fuchsia-700/50 scale-110 glow-3d shadow-2xl shadow-cyan-600/50' : 'bg-gradient-to-br from-cyan-700/30 to-fuchsia-700/30 via-violet-700/30'
                  }`}
                  style={{ transform: dragActive ? 'translateZ(30px) rotateY(5deg)' : 'translateZ(15px)' }}
                >
                  {file ? (
                    <>
                      <FileText className="w-16 h-16 text-cyan-300 depth-1" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white/50 flex items-center justify-center depth-4 glow-3d shadow-lg shadow-emerald-500/60">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <Upload className="w-16 h-16 text-cyan-300 depth-1 float-3d" />
                  )}

                  {/* 3D Corner Accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-cyan-500 depth-3 shadow-lg shadow-cyan-500/60"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-fuchsia-500 depth-3 shadow-lg shadow-fuchsia-500/60"></div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-violet-500 depth-3 shadow-lg shadow-violet-500/60"></div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-emerald-500 depth-3 shadow-lg shadow-emerald-500/60"></div>
                </div>

                {file ? (
                  <div className="text-center preserve-3d">
                    <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300 depth-1">{file.name}</p>
                    <p className="text-sm text-cyan-300/90 mt-2 flex items-center gap-2 justify-center depth-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      File loaded • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center preserve-3d">
                    <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-300 depth-1">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-cyan-300/80 mt-2 depth-2">
                      or click to browse files
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 px-4 py-2 glass-3d border border-cyan-600/50 rounded-lg preserve-3d depth-2 shadow-lg shadow-cyan-600/30">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-300">PDF files only • Max 10MB</span>
                </div>
              </div>
            </div>

            {/* 3D Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 preserve-3d">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`btn-3d flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg relative overflow-hidden group preserve-3d ${!file || uploading
                  ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-600/30'
                  : 'bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-violet-600 hover:from-cyan-700 hover:via-fuchsia-700 hover:to-violet-700 text-white shadow-xl shadow-cyan-600/50 glow-3d border border-cyan-500/50'
                  }`}
                style={{ transform: 'translateZ(25px)' }}
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
                  className="btn-3d px-8 py-4 glass-3d border border-slate-400/30 text-slate-200 rounded-xl font-semibold preserve-3d"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  Reset System
                </button>
              )}
            </div>

            {/* 3D Success Status Card */}
            {uploadStatus === 'success' && (
              <div className="mt-8 glass-3d border border-emerald-600/50 rounded-2xl p-6 glow-3d card-3d preserve-3d animate-in slide-in-from-top duration-500" style={{ transform: 'translateZ(60px)' }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 preserve-3d">
                    <div className="p-3 bg-gradient-to-br from-emerald-700/40 to-cyan-700/40 rounded-xl border border-emerald-600/50 rotate-3d preserve-3d shadow-lg shadow-emerald-600/30" style={{ transform: 'translateZ(20px)' }}>
                      <CheckCircle className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div className="preserve-3d">
                      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 depth-1">Portfolio Generated Successfully!</h3>
                      <p className="text-sm text-emerald-300/90 mt-1 depth-2">Your AI-powered portfolio is ready to preview and download</p>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto preserve-3d">
                    <button
                      onClick={handlePreview}
                      type="button"
                      className="btn-3d flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-700 hover:to-fuchsia-700 text-white rounded-xl font-medium shadow-lg shadow-cyan-600/50 preserve-3d"
                      style={{ transform: 'translateZ(15px)' }}
                    >
                      <Globe className="w-5 h-5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      type="button"
                      className="btn-3d flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-600/50 preserve-3d"
                      style={{ transform: 'translateZ(15px)' }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3D Features Section */}
          <div className="bg-gradient-to-r from-cyan-900/20 via-fuchsia-900/20 to-violet-900/20 border-t border-cyan-600/50 px-8 sm:px-12 py-8 preserve-3d" style={{ transform: 'translateZ(40px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 preserve-3d">
              <div className="group p-6 glass-3d border border-cyan-600/50 rounded-xl card-3d preserve-3d rotate-3d shadow-lg shadow-cyan-600/30" style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-start gap-4 preserve-3d">
                  <div className="p-3 bg-gradient-to-br from-cyan-700/40 to-cyan-800/40 border border-cyan-600/50 rounded-lg group-hover:scale-110 transition-transform rotate-3d preserve-3d glow-3d shadow-lg shadow-cyan-600/40" style={{ transform: 'translateZ(15px)' }}>
                    <Brain className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div className="preserve-3d">
                    <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 mb-1 depth-1">Neural AI</h3>
                    <p className="text-sm text-cyan-300/80 depth-2">Advanced content extraction</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 glass-3d border border-fuchsia-600/50 rounded-xl card-3d preserve-3d rotate-3d shadow-lg shadow-fuchsia-600/30" style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-start gap-4 preserve-3d">
                  <div className="p-3 bg-gradient-to-br from-fuchsia-700/40 to-fuchsia-800/40 border border-fuchsia-600/50 rounded-lg group-hover:scale-110 transition-transform rotate-3d preserve-3d glow-3d shadow-lg shadow-fuchsia-600/40" style={{ transform: 'translateZ(15px)' }}>
                    <Sparkles className="w-6 h-6 text-fuchsia-300" />
                  </div>
                  <div className="preserve-3d">
                    <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-fuchsia-300 mb-1 depth-1">Smart Design</h3>
                    <p className="text-sm text-fuchsia-300/80 depth-2">Professional layouts</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 glass-3d border border-violet-600/50 rounded-xl card-3d preserve-3d rotate-3d shadow-lg shadow-violet-600/30" style={{ transform: 'translateZ(20px)' }}>
                <div className="flex items-start gap-4 preserve-3d">
                  <div className="p-3 bg-gradient-to-br from-violet-700/40 to-violet-800/40 border border-violet-600/50 rounded-lg group-hover:scale-110 transition-transform rotate-3d preserve-3d glow-3d shadow-lg shadow-violet-600/40" style={{ transform: 'translateZ(15px)' }}>
                    <Zap className="w-6 h-6 text-violet-300" />
                  </div>
                  <div className="preserve-3d">
                    <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-300 mb-1 depth-1">Instant Export</h3>
                    <p className="text-sm text-violet-300/80 depth-2">Ready-to-use HTML</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Info Section */}
        <div className="mt-12 text-center preserve-3d" style={{ transform: 'translateZ(30px)' }}>
          <div className="text-cyan-400/80 text-sm flex items-center justify-center gap-2 preserve-3d">
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse depth-1 shadow-lg shadow-cyan-500/60"></div>
            <span className="depth-2">Powered by Advanced Neural Networks</span>
            <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse depth-1 shadow-lg shadow-fuchsia-500/60"></div>
          </div>
        </div>
      </main>

      {/* 3D Footer */}
      <footer className="relative mt-20 py-8 border-t border-cyan-600/50 glass-3d preserve-3d" style={{ transform: 'translateZ(40px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center preserve-3d">
          <div className="text-cyan-400/80 flex items-center justify-center gap-2 preserve-3d">
            <Cpu className="w-4 h-4 depth-1 float-3d text-cyan-400" />
            <span className="depth-2">UI/UX Innovation Lab • AI-Assisted Design</span>
            <Brain className="w-4 h-4 depth-1 float-3d text-fuchsia-400" />
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
        .delay-3000 {
          animation-delay: 3s;
        }
        /* 3D Mouse Parallax Effect */
        @media (hover: hover) {
          .card-3d:hover {
            transform: translateZ(20px) rotateX(2deg) rotateY(2deg) !important;
          }
        }
      `}} />
    </div>
  );
}