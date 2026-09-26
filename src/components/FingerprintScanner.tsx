import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, RefreshCw, Upload, ShieldCheck, Sparkles, Fingerprint } from 'lucide-react';
import FingerprintLogo from './FingerprintLogo';

interface FingerprintScannerProps {
  onScanComplete: (scanData: {
    scanned: boolean;
    certificateId: string;
    timestamp: string;
    method: 'touch' | 'upload';
    fileName?: string;
  }) => void;
  initialCertificateId?: string;
  className?: string;
}

// Sound effects generator using standard Web Audio API (no external asset dependencies)
function playBiometricAudio(type: 'scan' | 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === 'scan') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
      osc2.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.24); // C6

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    }
  } catch {
    // Audio contexts can be blocked if user hasn't interacted yet; ignore gracefully
  }
}

export default function FingerprintScanner({
  onScanComplete,
  initialCertificateId,
  className = '',
}: FingerprintScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(!!initialCertificateId);
  const [certId, setCertId] = useState(initialCertificateId || '');
  const [uploadFileName, setUploadFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState('Posez et maintenez votre doigt sur le capteur');

  const scanIntervalRef = useRef<number | null>(null);

  // Trigger haptic vibration if supported on mobile
  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore
      }
    }
  };

  const startScan = () => {
    if (isCompleted) return;
    setIsScanning(true);
    setProgress(0);
    setStatusMessage('Numérisation des crêtes papillaires...');
    triggerHaptic(50);
    playBiometricAudio('scan');

    const startTime = Date.now();
    const duration = 1600; // 1.6s scan duration

    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (currentProgress >= 30 && currentProgress < 70) {
        setStatusMessage('Analyse des minuties biométriques... ' + currentProgress + '%');
      } else if (currentProgress >= 70 && currentProgress < 100) {
        setStatusMessage('Génération de la signature cryptographique... ' + currentProgress + '%');
      }

      if (currentProgress >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        const generatedCert = `SO-BIO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        setCertId(generatedCert);
        setIsScanning(false);
        setIsCompleted(true);
        setStatusMessage('Empreinte authentifiée avec succès !');
        triggerHaptic([60, 50, 100]);
        playBiometricAudio('success');

        onScanComplete({
          scanned: true,
          certificateId: generatedCert,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          method: 'touch',
        });
      }
    }, 40);
  };

  const cancelScan = () => {
    if (!isCompleted && isScanning) {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setIsScanning(false);
      setProgress(0);
      setStatusMessage('Numérisation interrompue. Maintenez le doigt jusqu\'à 100%.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const generatedCert = `SO-FILE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setUploadFileName(file.name);
      setCertId(generatedCert);
      setIsCompleted(true);
      setStatusMessage(`Empreinte chargée : ${file.name}`);
      triggerHaptic(50);
      playBiometricAudio('success');

      onScanComplete({
        scanned: true,
        certificateId: generatedCert,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        method: 'upload',
        fileName: file.name,
      });
    }
  };

  const resetScan = () => {
    setIsScanning(false);
    setProgress(0);
    setIsCompleted(false);
    setCertId('');
    setUploadFileName('');
    setStatusMessage('Posez et maintenez votre doigt sur le capteur');
    onScanComplete({
      scanned: false,
      certificateId: '',
      timestamp: '',
      method: 'touch',
    });
  };

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl border so-hairline bg-[#100d14] p-5 md:p-6 ${className}`}>
      {/* Background glow when scanning or completed */}
      <div
        className={`pointer-events-none absolute -inset-1 opacity-20 blur-xl transition-all duration-700 ${
          isCompleted
            ? 'bg-gradient-to-r from-[#e7a3b8] via-[#4ade80] to-[#e7a3b8]'
            : isScanning
            ? 'bg-gradient-to-r from-[#e7a3b8] via-[#f43f5e] to-[#e7a3b8]'
            : 'bg-transparent'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Header tag */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-[#e7a3b8] animate-pulse" />
          <p className="so-label text-[0.625rem] text-[#e7a3b8]">
            Touche d'empreinte biométrique
          </p>
        </div>

        <h4 className="so-wordmark mt-2 text-lg text-[#f4f1ec] md:text-xl">
          {isCompleted ? 'Signature biométrique validée' : 'Scannez votre empreinte digitale'}
        </h4>

        <p className="mt-1 text-xs text-[#9b93a3] max-w-sm">
          {isCompleted
            ? 'Votre empreinte unique est désormais scellée et liée à votre commande.'
            : 'Chaque pièce Sold Out est gravée de votre propre empreinte : la seule signature que personne ne peut copier.'}
        </p>

        {/* Biometric Touch Sensor Pad */}
        <div className="relative my-6 flex flex-col items-center">
          <div className="relative">
            {/* Circular Progress Ring */}
            <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                className="stroke-[#221c29]"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                className={`transition-all duration-100 ${
                  isCompleted ? 'stroke-[#4ade80]' : 'stroke-[#e7a3b8]'
                }`}
                strokeWidth="5"
                strokeDasharray={339.29}
                strokeDashoffset={339.29 - (339.29 * (isCompleted ? 100 : progress)) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Interactive Touch Pad Button */}
            <button
              type="button"
              onMouseDown={startScan}
              onMouseUp={cancelScan}
              onMouseLeave={cancelScan}
              onTouchStart={startScan}
              onTouchEnd={cancelScan}
              onClick={() => {
                // Also trigger scan on simple click/tap if user doesn't hold
                if (!isCompleted && !isScanning) {
                  startScan();
                }
              }}
              disabled={isCompleted}
              aria-label="Touche d'empreinte biométrique"
              className={`absolute inset-2 m-auto flex h-28 w-28 flex-col items-center justify-center rounded-full transition-all duration-300 focus:outline-none ${
                isCompleted
                  ? 'border border-[#4ade80]/40 bg-[#0c1a12] text-[#4ade80] shadow-[0_0_25px_rgba(74,222,128,0.25)]'
                  : isScanning
                  ? 'scale-95 border-2 border-[#e7a3b8] bg-[#22131d] text-[#e7a3b8] shadow-[0_0_30px_rgba(231,163,184,0.4)]'
                  : 'border border-[#382d42] bg-gradient-to-b from-[#191421] to-[#0c0a0f] text-[#f4f1ec] hover:border-[#e7a3b8]/60 hover:shadow-[0_0_20px_rgba(231,163,184,0.15)] active:scale-95 cursor-pointer'
              }`}
            >
              {/* Laser Scanning Beam Line */}
              {isScanning && (
                <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-transparent via-[#f43f5e] to-transparent shadow-[0_0_12px_#f43f5e] animate-scan-beam" />
              )}

              {/* The Fingerprint Logo rendered in touch pad */}
              <div className="relative">
                <FingerprintLogo
                  className={`h-16 w-auto transition-transform duration-300 ${
                    isScanning ? 'scale-110 text-[#e7a3b8]' : isCompleted ? 'text-[#4ade80]' : 'text-[#f4f1ec]/85'
                  }`}
                  strokeWidth={2.6}
                />

                {isCompleted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0c1a12]/75 backdrop-blur-[1px] rounded-full">
                    <CheckCircle2 size={32} className="text-[#4ade80]" strokeWidth={2.6} />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Touch instructions badge */}
          <div className="mt-3 flex items-center gap-1.5">
            {isCompleted ? (
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#4ade80]">
                <ShieldCheck size={14} />
                Certificat biométrique : <span className="font-mono">{certId}</span>
              </span>
            ) : isScanning ? (
              <span className="text-xs font-medium text-[#e7a3b8] animate-pulse">
                Maintenez le doigt posé ({progress}%)
              </span>
            ) : (
              <span className="text-xs text-[#9b93a3]">
                Appuyez sur la touche d'empreinte pour scanner
              </span>
            )}
          </div>
        </div>

        {/* Status Message */}
        <p className={`text-xs ${isCompleted ? 'text-[#4ade80]' : 'text-[#9b93a3]'}`}>
          {statusMessage}
        </p>

        {/* Secondary Actions: Upload file alternative or reset */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {isCompleted ? (
            <button
              type="button"
              onClick={resetScan}
              className="flex items-center gap-1.5 text-[0.6875rem] text-[#9b93a3] hover:text-[#f4f1ec] transition-colors"
            >
              <RefreshCw size={12} />
              <span>Re-scanner ou changer d'empreinte</span>
            </button>
          ) : (
            <label className="flex items-center gap-1.5 cursor-pointer text-[0.6875rem] text-[#e7a3b8] hover:text-white transition-colors border border-[#e7a3b8]/30 hover:border-[#e7a3b8] rounded-full px-3 py-1 bg-[#1a1420]">
              <Upload size={12} />
              <span>Ou importer une photo d'empreinte</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
