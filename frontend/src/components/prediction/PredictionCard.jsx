import React, { useEffect, useState } from 'react';
import useTranslation from '../../hooks/useTranslation';
import api from '../../services/api';
import { useGuest } from '../auth/GuestMode';

export default function PredictionCard() {
  const { t } = useTranslation();
  const { user } = useGuest();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // We expect user to have .primaryCrop, .state, .district
    const payload = {
      crop: user.primaryCrop || 'Onion',
      state: user.state || 'Maharashtra',
      district: user.district || 'Nashik' // Fallbacks if user lacks data
    };

    api.post('/api/predict', payload)
      .then(res => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(err => console.error("Error fetching prediction:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white/5 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl animate-pulse h-48" />
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            {t('dashboard.predictionTitle') || 'AI Crop Price Prediction'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            {user?.primaryCrop || 'Commodity'} • AI Analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today's Price */}
        <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Today's Price</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">₹{data.todayPrice}/kg</p>
        </div>

        {/* Predicted Tomorrow */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Predicted Tomorrow</p>
          <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">₹{data.predictedPrice}/kg</p>
        </div>

        {/* Trend */}
        <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">7-Day Trend</p>
          <p className={`text-sm font-bold flex items-center gap-1 ${
            data.trend === 'Increasing' ? 'text-red-500' 
            : data.trend === 'Decreasing' ? 'text-green-500' 
            : 'text-yellow-500'
          }`}>
            {data.trend === 'Increasing' ? '📈' : data.trend === 'Decreasing' ? '📉' : '➖'} {data.trend}
          </p>
        </div>

        {/* Confidence */}
        <div className="bg-white/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1">Confidence Score</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{data.confidence}%</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">{t('dashboard.actionRecommendation') || 'Recommendation'}:</span> 
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
              data.recommendation === 'Sell Today' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {data.recommendation}
            </span>
          </p>
          {data.mode === 'fallback' && (
            <p className="text-xs text-yellow-500 font-medium">Using fallback estimator</p>
          )}
        </div>
      </div>
    </div>
  );
}
