'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { setCookie, getCookie } from 'cookies-next';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Loader } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [pexelsApiKey, setPexelsApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Clear feedback message after 5 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Load settings from cookie and Firestore on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {        
        const cookieGoogleKey = getCookie('googleApiKey') || '';
        const cookieGroqKey = getCookie('groqApiKey') || '';
        const cookiePexelsKey = getCookie('pexelsApiKey') || '';
        
        if (cookieGoogleKey) {
          setGoogleApiKey(cookieGoogleKey);
        }
        if (cookieGroqKey) {
          setGroqApiKey(cookieGroqKey);
        }
        if (cookiePexelsKey) {
          setPexelsApiKey(cookiePexelsKey);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setFeedbackMessage({
          type: 'error',
          message: 'Failed to load settings. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle input change with code checking
  const handleInputChange = (value, setter) => {
    setter(value);
  };

  // Save settings to both cookie and Firestore
  const saveCookies = async () => {
    // Validate input
    if (!googleApiKey.trim() || !groqApiKey.trim() || !pexelsApiKey.trim()) {
      setFeedbackMessage({
        type: 'error',
        message: 'Please enter valid API keys'
      });
      return;
    }

    try {
      // Set cookie with expiration
      const thirtyDaysExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      setCookie('googleApiKey', googleApiKey, {
        expires: thirtyDaysExpiry,
      });
      setCookie('groqApiKey', groqApiKey, {
        expires: thirtyDaysExpiry,
      });
      setCookie('pexelsApiKey', pexelsApiKey, {
        expires: thirtyDaysExpiry,
      });

      // Success feedback
      setFeedbackMessage({
        type: 'success',
        message: 'API keys saved successfully'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setFeedbackMessage({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-gray-200">
        <Loader size={28} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200 flex flex-col">
      {/* Feedback Alert */}
      {feedbackMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <div 
            className={`
              p-4 rounded-lg shadow-md flex items-center 
              ${feedbackMessage.type === 'success' 
                ? 'bg-green-500/80 text-white' 
                : 'bg-red-500/80 text-white'
              }
            `}
          >
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 mr-3" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-3" />
            )}
            <div>
              <div className="font-bold">
                {feedbackMessage.type === 'success' ? 'Success' : 'Error'}
              </div>
              <div className="text-sm">{feedbackMessage.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-neutral-800/60 text-gray-100 py-2 flex items-center px-6 shadow-md border-b border-gray-700">
        <button onClick={() => router.back()} className="text-gray-100 hover:text-gray-400 transition">
          <ChevronLeft size={20} />
        </button>
        <h1 className="flex-grow text-center font-semibold text-md">Settings</h1>
      </div>

      {/* Settings Form */}
      <div className="flex-grow p-4 w-full max-w-2xl mx-auto">
        <div className="py-8">
          <div className="mb-6">
            <label
              htmlFor="googleApiKey"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Google API Key
            </label>
            <input
              type="text"
              id="googleApiKey"
              value={googleApiKey}
              onChange={(e) => handleInputChange(e.target.value, setGoogleApiKey)}
              className="block w-full px-4 py-3 bg-neutral-700/50 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
              placeholder="Enter Google API Key"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="groqApiKey"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Groq API Key
            </label>
            <input
              type="text"
              id="groqApiKey"
              value={groqApiKey}
              onChange={(e) => handleInputChange(e.target.value, setGroqApiKey)}
              className="block w-full px-4 py-3 bg-neutral-700/50 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
              placeholder="Enter Groq API Key"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="pexelsApiKey"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Pexels API Key
            </label>
            <input
              type="text"
              id="pexelsApiKey"
              value={pexelsApiKey}
              onChange={(e) => handleInputChange(e.target.value, setPexelsApiKey)}
              className="block w-full px-4 py-3 bg-neutral-700/50 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
              placeholder="Enter Pexels API Key"
            />
          </div>

          <button
            onClick={saveCookies}
            className="w-full bg-blue-600/50 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}