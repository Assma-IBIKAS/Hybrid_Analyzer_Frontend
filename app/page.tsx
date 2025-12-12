"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Zap, Lock, User, ArrowRight, Search, TrendingUp, FileText, BarChart3, Shield, LogOut } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function HybridAnalyzerAI() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  
  // Auth states
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  
  // Analysis states
  const [text, setText] = useState('');
  const [labels, setLabels] = useState(['Finance', 'RH', 'IT', 'Opérations', 'Marketing','Ventes','Stratégie','Supply Chain','Production','Juridique','Qualité','Service Client','Communication','Achats','Gestion de projet','Data / Analytics','Transformation digitale / IA','Santé / Médical','Environnement / Développement durable']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (savedToken) {
      setToken(savedToken);
      setUsername(savedUsername);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/login' : '/Register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });

      if (!response.ok) throw new Error('Authentication failed');
      
      const data = await response.json();
      
      if (authMode === 'login') {
        setToken(data.access_token);
        setUsername(authData.username);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', authData.username);
        setCurrentPage('dashboard');
      } else {
        setAuthMode('login');
        setAuthError('');
      }
    } catch (err) {
      setAuthError(authMode === 'login' ? 'Invalid credentials' : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text, labels })
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentPage('landing');
    setResult(null);
    setText('');
  };

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-20 -right-20 animate-pulse delay-1000"></div>
        </div>

        {/* Header */}
        <nav className="relative z-10 flex justify-between items-center px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Hybrid Analyzer</span>
          </div>
          <button
            onClick={() => setCurrentPage('auth')}
            className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Sign In
          </button>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-pink-200 mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Powered by AI Orchestration</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Intelligent Text
              <br />
              <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                Analysis & Synthesis
              </span>
            </h1>
            
            <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
              Orchestrez l'IA pour classifier, résumer et analyser vos textes avec une précision sans précédent
            </p>

            <button
              onClick={() => setCurrentPage('auth')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
            >
              Commencer l'analyse
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: Brain,
                title: "Classification Zero-Shot",
                desc: "Classifiez vos textes sans entraînement préalable grâce à BART-MNLI"
              },
              {
                icon: Sparkles,
                title: "Synthèse Contextuelle",
                desc: "Générez des résumés intelligents avec Gemini 2.5 Flash"
              },
              {
                icon: Shield,
                title: "Sécurisé & Privé",
                desc: "Authentification JWT et protection des données"
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Auth Page
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl bottom-20 -right-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <button
            onClick={() => setCurrentPage('landing')}
            className="mb-6 text-purple-200 hover:text-white flex items-center gap-2"
          >
            ← Retour
          </button>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Hybrid Analyzer</span>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/5 text-purple-200 hover:bg-white/10'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/5 text-purple-200 hover:bg-white/10'
                }`}
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-purple-200 mb-2 text-sm">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={authData.username}
                  onChange={(e) => setAuthData({...authData, username: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="votre_nom"
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 mb-2 text-sm">Mot de passe</label>
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Chargement...' : authMode === 'login' ? 'Se connecter' : "S'inscrire"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Hybrid Analyzer</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-purple-200 text-sm">Bonjour, </span>
              <span className="text-white font-semibold">{username}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
            >
              <LogOut className="w-5 h-5 text-purple-200" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-pink-400" />
                <h2 className="text-2xl font-bold text-white">Analyse de Texte</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 mb-2 text-sm">Texte à analyser</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Entrez votre texte ici pour l'analyser avec l'IA..."
                    className="w-full h-48 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-purple-200 mb-2 text-sm">Catégories de classification</label>
                  <div className="flex flex-wrap gap-2">
                    {labels.map((label, i) => (
                      <span key={i} className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg text-pink-200 text-sm">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Analyser avec l'IA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl border border-pink-500/20 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-pink-400" />
                    <h2 className="text-2xl font-bold text-white">Classification</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-200">Catégorie détectée</span>
                      <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-bold">
                        {result.category}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-purple-200 mb-2">
                        <span>Score de confiance</span>
                        <span>{(result.score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${result.score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Synthèse IA</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-purple-100 leading-relaxed">{result.summary}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-purple-200 text-sm">Ton détecté:</span>
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        result.tone === 'positif'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : result.tone === 'negatif'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {result.tone}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <Search className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-purple-200">Les résultats d'analyse apparaîtront ici</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}