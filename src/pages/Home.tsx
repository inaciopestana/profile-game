import { useState } from 'react';
import characters from '@/data/characters.json';

/**
 * Design Philosophy: Optimized space-efficient character selection interface
 * - Compact header with minimal spacing
 * - Small featured character display (top-right or compact position)
 * - Maximized grid area for 24 cards
 * - Responsive design for mobile and desktop
 * - Cards as large as possible while fitting all 24 in viewport
 */

export default function Home() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [grayedOutCards, setGrayedOutCards] = useState<Set<number>>(new Set());

  const handleCharacterSelect = (id: number) => {
    // First click: lock the character selection
    if (selectedCharacterId === null) {
      setSelectedCharacterId(id);
    } else {
      // Subsequent clicks: toggle cards as grayed out (but not the selected one)
      if (id !== selectedCharacterId) {
        setGrayedOutCards(prev => {
          const newSet = new Set(prev);
          if (newSet.has(id)) {
            newSet.delete(id); // Remove from grayed out if already grayed
          } else {
            newSet.add(id); // Add to grayed out if not grayed
          }
          return newSet;
        });
      }
    }
  };

  const handleReset = () => {
    setSelectedCharacterId(null);
    setGrayedOutCards(new Set());
  };

  const selectedCharacter = selectedCharacterId !== null 
    ? characters[selectedCharacterId]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 md:p-4 flex flex-col">
      {/* Compact Header */}
      <div className="text-center mb-2 md:mb-3 flex-shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
          Profile
        </h1>
        <p className="text-xs md:text-sm text-slate-600">
          {selectedCharacterId === null 
            ? 'Click any character to select' 
            : 'Character selected and locked'}
        </p>
      </div>

      {/* Featured Character Display - Compact */}
      <div className="flex justify-center items-center gap-3 mb-3 md:mb-4 flex-shrink-0">
        {selectedCharacterId !== null && (
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-md transition-colors duration-200"
          >
            Reset
          </button>
        )}
        <div className="w-20 h-24 md:w-24 md:h-32 rounded-lg overflow-hidden shadow-lg border-3 border-blue-500 relative group bg-white flex-shrink-0">
          {selectedCharacter ? (
            <>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              
              {/* Character image */}
              <img
                src={selectedCharacter.path}
                alt={`Character ${selectedCharacter.id}`}
                className="w-full h-full object-cover"
              />
              
              {/* Shine/glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 animate-pulse" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50">
              <p className="text-center text-slate-400 text-xs font-medium px-2">
                My Character
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Characters Grid - Maximized */}
      <div className="bg-white rounded-xl shadow-lg p-2 md:p-3 flex-1 overflow-auto">
        <h2 className="text-sm md:text-base font-bold text-slate-900 mb-2 md:mb-3">
          {selectedCharacterId === null ? 'Choose Your Character' : 'Exclude Other Characters'}
        </h2>
        
        <div className="grid grid-cols-4 md:grid-cols-4 gap-1.5 md:gap-2">
          {characters.map((character) => {
            const isSelected = selectedCharacterId === character.id;
            const isGrayedOut = grayedOutCards.has(character.id);

            return (
              <button
                key={character.id}
                onClick={() => handleCharacterSelect(character.id)}
                className={`
                  relative rounded-md overflow-hidden
                  transition-all duration-300 transform
                  ${isSelected 
                    ? 'ring-2 md:ring-3 ring-blue-500 shadow-md scale-105 hover:scale-105 cursor-default' 
                    : 'hover:scale-105 hover:shadow-sm'
                  }
                  ${isGrayedOut 
                    ? 'opacity-40 grayscale' 
                    : ''
                  }
                `}
                style={{ aspectRatio: '4 / 5' }}
                disabled={isSelected}
              >
                <img
                  src={character.path}
                  alt={`Character ${character.id}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Glow effect for selected character */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instructions - Minimal */}
      {selectedCharacterId !== null && (
        <div className="mt-2 text-center text-slate-600 animate-fade-in flex-shrink-0">
          <p className="text-xs md:text-sm">
            ✓ Click other cards to mark them as grayed out.
          </p>
        </div>
      )}
    </div>
  );
}
