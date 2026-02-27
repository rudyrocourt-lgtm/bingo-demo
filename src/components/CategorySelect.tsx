import { CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { Button } from './ui/Button';

interface Props {
  onSelect: (id: CategoryId) => void;
  onBack: () => void;
}

export function CategorySelect({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Buzzword Pack</h2>
      <p className="text-gray-500 mb-8">Each pack has 45+ words for unique cards every game</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="bg-white rounded-2xl border-2 border-gray-200 p-6 text-left hover:border-blue-400 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="text-4xl mb-3">{category.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{category.description}</p>
            <div className="flex flex-wrap gap-1">
              {category.words.slice(0, 5).map(word => (
                <span
                  key={word}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {word}
                </span>
              ))}
              <span className="text-xs text-gray-400 px-1">+{category.words.length - 5} more</span>
            </div>
          </button>
        ))}
      </div>

      <Button variant="ghost" onClick={onBack} className="mt-8">
        ← Back to Home
      </Button>
    </div>
  );
}
