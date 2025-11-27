import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string;
  isCode?: boolean;
  defaultExpanded?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'amber';
}

export const ResultCard: React.FC<ResultCardProps> = ({ 
  title, 
  content, 
  isCode = false, 
  defaultExpanded = true,
  color = 'blue'
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const codeRef = useRef<HTMLElement>(null);

  // Apply syntax highlighting when expanded and content is code
  useEffect(() => {
    if (isExpanded && isCode && codeRef.current && (window as any).Prism) {
      (window as any).Prism.highlightElement(codeRef.current);
    }
  }, [isExpanded, isCode, content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorStyles = {
    blue: "border-blue-100 bg-blue-50/50",
    purple: "border-purple-100 bg-purple-50/50",
    green: "border-green-100 bg-green-50/50",
    amber: "border-amber-100 bg-amber-50/50"
  };

  const headerColors = {
    blue: "text-blue-800",
    purple: "text-purple-800",
    green: "text-green-800",
    amber: "text-amber-800"
  };

  return (
    <div className={`rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${colorStyles[color]} mb-6`}>
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/40"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className={`text-lg font-bold ${headerColors[color]} flex items-center`}>
          {title}
        </h3>
        <div className="flex items-center space-x-2 space-x-reverse">
          {isCode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-white rounded-md transition-colors"
              title="העתק ללוח"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6 animate-fadeIn">
          {isCode ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-sm shadow-inner overflow-hidden">
              <pre className="!m-0 !p-0">
                <code 
                  ref={codeRef} 
                  className="language-markdown whitespace-pre-wrap break-words"
                  dir="auto"
                  style={{ display: 'block' }}
                >
                  {content}
                </code>
              </pre>
            </div>
          ) : (
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
};