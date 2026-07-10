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
    
    const payload = {
      crop: user.primaryCrop || 'Onion',
      state: user.state || 'Maharashtra',
      district: user.district || 'Nashik'
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
      <div className="bg-white/5 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl animate-pulse h-64" />
    );
  }

  if (!data) return null;

  // Dynamic Logic Computation
  const todayPrice = data.todayPrice || 0;
  const predictedPrice = data.predictedPrice || 0;
  
  const gainValue = predictedPrice - todayPrice;
  const gainPercent = todayPrice > 0 ? ((gainValue / todayPrice) * 100).toFixed(1) : 0;
  
  let dynamicTrend = 'stable';
  if (predictedPrice > todayPrice) dynamicTrend = 'increasing';
  if (predictedPrice < todayPrice) dynamicTrend = 'decreasing';
  
  const trendVisuals = {
    increasing: { icon: '🟢', color: 'text-green-600 dark:text-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900/30' },
    decreasing: { icon: '🔴', color: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30' },
    stable: { icon: '🟡', color: 'text-yellow-600 dark:text-yellow-400', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' },
  };
  const visual = trendVisuals[dynamicTrend];
  
  const confidenceScore = data.confidence || 75;

  let recKey = 'dashboard.predictionCard.recommendationStable';
  if (dynamicTrend === 'increasing') recKey = 'dashboard.predictionCard.recommendationHold';
  if (dynamicTrend === 'decreasing') recKey = 'dashboard.predictionCard.recommendationSell';

  return (
    <div className="bg-white/80 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl relative overflow-hidden group transition-all duration-300 hover:shadow-2xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {t('dashboard.predictionTitle')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse"></span>
            {user?.primaryCrop || 'Commodity'} • AI Analysis
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {data.mode === 'fallback' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-800/50">
              {t('dashboard.predictionCard.fallbackPrediction')}
            </span>
          )}
          <span className="text-[11px] text-gray-400 font-medium">
            {t('dashboard.predictionCard.lastUpdated')}: {t('dashboard.predictionCard.justNow')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {/* Today's Price */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💰</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('dashboard.predictionCard.currentPrice')}</p>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {todayPrice > 0 ? `₹${todayPrice}/kg` : t('dashboard.predictionCard.dataUnavailable')}
          </p>
        </div>

        {/* Predicted Tomorrow */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔮</span>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider">{t('dashboard.predictionCard.predictedPrice')}</p>
          </div>
          <p className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
            ₹{predictedPrice}/kg
          </p>
        </div>

        {/* Expected Gain */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📈</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('dashboard.predictionCard.expectedGain')}</p>
          </div>
          <p className={`text-xl font-black ${gainValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {gainValue > 0 ? '+' : ''}₹{gainValue.toFixed(2)} 
            <span className="text-sm ml-1 opacity-80">({gainPercent > 0 ? '+' : ''}{gainPercent}%)</span>
          </p>
        </div>

        {/* Market Trend & Confidence */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('dashboard.predictionCard.trend')}</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${visual.badge}`}>
                {visual.icon} {t(`dashboard.predictionCard.${dynamicTrend}`)}
              </span>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-end mb-1">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">{t('dashboard.predictionCard.confidence')}</p>
              <p className="text-xs font-black text-gray-700 dark:text-gray-300">{confidenceScore}%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-gray-200/60 dark:border-gray-700/60 relative z-10">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent border border-indigo-100/50 dark:border-indigo-800/30">
          <div className="text-2xl mt-0.5">🤖</div>
          <div>
            <h4 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-300 mb-1">
              {t('dashboard.predictionCard.aiRecommendation')}
            </h4>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(recKey)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
