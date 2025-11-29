import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Wand2, RefreshCw, AlertCircle, Play, Download, Globe, FileText, File } from 'lucide-react';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { WordPressModal } from './components/WordPressModal';
import { optimizePrompt, generateContentFromPrompt } from './services/geminiService';
import { exportToPDF, exportToDOCX } from './services/exportService';
import { publishToWordPress } from './services/wordpressService';
import { AppStatus, OptimizationResult, WordPressConfig } from './types';

function App() {
  const [prompt, setPrompt] = useState('');
  const [criteria, setCriteria] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New states for content generation and publishing
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWPModalOpen, setIsWPModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!prompt.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);
    setResult(null);
    setGeneratedContent(null);
    setPublishSuccess(null);

    try {
      const data = await optimizePrompt(prompt, criteria);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה בעת עיבוד הפרומט. אנא נסה שנית.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleGenerateContent = async () => {
    if (!result?.optimizedPrompt) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      const content = await generateContentFromPrompt(result.optimizedPrompt);
      setGeneratedContent(content);
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת התוכן');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (generatedContent) {
      exportToPDF(generatedContent, 'opti-prompt-result');
    }
  };

  const handleExportDOCX = () => {
    if (generatedContent) {
      exportToDOCX(generatedContent, 'opti-prompt-result');
    }
  };

  const handleWordPressSubmit = async (config: WordPressConfig) => {
    if (!generatedContent) return;
    
    setIsPublishing(true);
    setError(null);
    
    try {
      // Extract a simple title from first line or use default
      const title = generatedContent.split('\n')[0].substring(0, 50).replace(/[#*]/g, '') || "Generated Content";
      await publishToWordPress(config, title, generatedContent);
      setPublishSuccess("הפוסט פורסם בהצלחה באתר שלך!");
      setIsWPModalOpen(false);
    } catch (err: any) {
      // Keep modal open on error so user can fix details
      alert(`שגיאה בפרסום: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setCriteria('');
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
    setGeneratedContent(null);
    setPublishSuccess(null);
  };

  return (
    <div className="min-h-screen text-slate-900 pb-20">
      <WordPressModal 
        isOpen={isWPModalOpen}
        onClose={() => setIsWPModalOpen(false)}
        onSubmit={handleWordPressSubmit}
        isLoading={isPublishing}
      />

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
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start space-x-4 space-x-reverse mb-6">
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

                   {/* Execution Section */}
                   <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center">
                        <Play className="w-5 h-5 ml-2 text-green-400" />
                        הרצת הפרומט המשופר
                      </h3>
                    </div>
                    <p className="text-slate-300 text-sm mb-6">
                      רוצה לראות את התוצאה? לחץ למטה כדי לשלוח את הפרומט המשופר ל-Gemini וליצור את התוכן שלך עכשיו.
                    </p>
                    <Button 
                      onClick={handleGenerateContent} 
                      isLoading={isGenerating}
                      variant="secondary"
                      className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      צור תוכן באמצעות הפרומט המשופר
                    </Button>
                   </div>

                   {/* Generated Content Result */}
                   {generatedContent && (
                     <div className="animate-fadeIn">
                       <ResultCard 
                          title="תוכן שנוצר" 
                          content={generatedContent} 
                          color="amber"
                          defaultExpanded={true}
                        />

                        {publishSuccess && (
                          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                             <Globe className="w-5 h-5 ml-2" />
                             {publishSuccess}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                          <Button 
                            onClick={handleExportPDF} 
                            variant="secondary"
                            icon={<FileText className="w-4 h-4" />}
                            className="text-sm"
                          >
                            PDF ייצא ל
                          </Button>
                          <Button 
                            onClick={handleExportDOCX} 
                            variant="secondary"
                            icon={<File className="w-4 h-4" />}
                            className="text-sm"
                          >
                            DOCX ייצא ל
                          </Button>
                          <Button 
                            onClick={() => setIsWPModalOpen(true)} 
                            variant="primary"
                            icon={<Globe className="w-4 h-4" />}
                            className="text-sm bg-blue-600 hover:bg-blue-700"
                          >
                            פרסם לוורדפרס
                          </Button>
                        </div>
                     </div>
                   )}

                  {/* Key Improvements */}
                  <ResultCard 
                    title="שיפורים עיקריים" 
                    content={result.keyImprovements} 
                    color="purple"
                    defaultExpanded={false}
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