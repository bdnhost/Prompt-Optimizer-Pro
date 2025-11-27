import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Wand2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { optimizePrompt } from './services/geminiService';
import { AppStatus, OptimizationResult } from './types';

function App() {
  const [prompt, setPrompt] = useState('');
  const [criteria, setCriteria] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!prompt.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await optimizePrompt(prompt, criteria);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה בעת עיבוד הפרומט. אנא נסה שנית.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setCriteria('');
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-purple-700">
              Prompt Optimizer Pro
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Gemini 2.5 Flash מופעל באמצעות
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center ml-3 text-slate-600 font-mono text-sm">1</span>
                הפרומט המקורי שלך
              </h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={'הדבק כאן את הפרומט שברצונך לשפר.\n\nלדוגמה: "כתוב תיאור מוצר עבור בקבוק מים חכם שמתזכר לשתות. קהל היעד הוא ספורטאים חובבים. הוסף רשימת תכונות עיקריות."'}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-base placeholder:text-slate-400"
                dir="auto"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
               <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center ml-3 text-slate-600 font-mono text-sm">2</span>
                קריטריונים להערכה (אופציונלי)
              </h2>
              <textarea
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                placeholder={'לדוגמה: "אני צריך שהתשובה תהיה בפורמט JSON בלבד, ללא הקדמות. הטון צריך להיות שיווקי ומניע לפעולה. כלול שדות עבור: כותרת, תיאור קצר, ומחיר."'}
                className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-sm placeholder:text-slate-400"
                dir="auto"
              />
              <p className="mt-2 text-xs text-slate-500">
                השאר ריק כדי להשתמש בשיטות העבודה המומלצות הכלליות.
              </p>
            </div>

            <div className="flex space-x-4 space-x-reverse pt-2">
              <Button 
                onClick={handleOptimize} 
                isLoading={status === AppStatus.LOADING}
                disabled={!prompt.trim()}
                className="flex-1 py-3 text-lg"
                icon={<Wand2 className="w-5 h-5" />}
              >
                בצע אופטימיזציה
              </Button>
              
              {status !== AppStatus.IDLE && (
                <Button 
                  onClick={handleReset} 
                  variant="secondary"
                  icon={<RefreshCw className="w-5 h-5" />}
                  title="אפס הכל"
                >
                  
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Outputs */}
          <div className="lg:col-span-7">
             {status === AppStatus.IDLE && (
               <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                 <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                   <Wand2 className="w-10 h-10 text-primary-500" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">מוכן לעבודה</h3>
                 <p className="text-slate-500 max-w-md">
                   הזן את הפרומט שלך בצד ימין ולחץ על "בצע אופטימיזציה" כדי לקבל גרסה משופרת ומקצועית יותר.
                 </p>
               </div>
             )}

             {status === AppStatus.ERROR && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start space-x-4 space-x-reverse">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800 mb-1">שגיאה</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
             )}

             {status === AppStatus.SUCCESS && result && (
               <div className="space-y-6 animate-fadeInUp">
                  
                  {/* Optimized Prompt - Most Important */}
                  <ResultCard 
                    title="הפרומט המשופר" 
                    content={result.optimizedPrompt} 
                    isCode={true}
                    color="green"
                    defaultExpanded={true}
                  />

                  {/* Key Improvements */}
                  <ResultCard 
                    title="שיפורים עיקריים" 
                    content={result.keyImprovements} 
                    color="purple"
                    defaultExpanded={true}
                  />

                  {/* Detailed Analysis */}
                  <ResultCard 
                    title="ניתוח מעמיק" 
                    content={result.analysis} 
                    color="blue"
                    defaultExpanded={false}
                  />

                   {/* Scratchpad (Debug/Thought Process) */}
                   <ResultCard 
                    title="תהליך החשיבה (Scratchpad)" 
                    content={result.scratchpad} 
                    color="amber"
                    defaultExpanded={false}
                  />
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;