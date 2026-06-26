"use client";

const defaultQuestions = [
  "Bugun qancha savdo bo'ldi?",
  "Bugungi tushum qancha?",
  "Coca-Cola qoldig'i qancha?",
  "Pepsi narxi qancha?",
  "Qaysi mahsulotlar kam qolgan?",
  "Eng ko'p sotilgan mahsulot qaysi?",
  "Bu oy savdo qancha?",
  "Nima qila olasan?",
];

type AISuggestedQuestionsProps = {
  questions?: string[];
  disabled?: boolean;
  onSelect: (question: string) => void;
};

export function getDefaultAIQuestions() {
  return defaultQuestions;
}

export function AISuggestedQuestions({
  questions = defaultQuestions,
  disabled = false,
  onSelect,
}: AISuggestedQuestionsProps) {
  const visibleQuestions = questions.length ? questions : defaultQuestions;

  return (
    <div className="grid gap-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        Tavsiya savollar
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visibleQuestions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="min-h-8 rounded-xl border border-slate-700/30 bg-[#131b2e] px-3 py-1.5 text-left text-[11px] font-semibold text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-900/20 hover:text-blue-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
