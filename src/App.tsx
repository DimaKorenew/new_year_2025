import { useState } from 'react';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { FloatingShareButton } from './components/FloatingShareButton';
import { ShareButtons } from './components/ShareButtons';
import { TagsSection } from './components/TagsSection';
import { SaladsSection } from './components/SaladsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { TimelineSection } from './components/TimelineSection';
import { VideoRecipesSection, saladsData, appetizersData } from './components/VideoRecipesSection';
import { Footer } from './components/Footer';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';
import { Recipe } from './types';
import {
  salads,
  articles,
  timelineStages,
} from './mockData';

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleCopySuccess = () => {
    setToastMessage('Ссылка скопирована!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <SaladsSection recipes={salads} onRecipeClick={handleRecipeClick} />
      <TagsSection />
      <ArticlesSection articles={articles} />
      <TimelineSection stages={timelineStages} />
      <VideoRecipesSection data={saladsData} />
      <VideoRecipesSection data={appetizersData} />
      <Footer />
      
      <FloatingShareButton onClick={handleShareClick} />
      
      {showShareModal && (
        <ShareButtons
          url={window.location.href}
          title="Новогоднее застолье 2026"
          description="Все рецепты, идеи и советы для идеального Нового года в одном месте"
          onClose={handleCloseShareModal}
          onCopySuccess={handleCopySuccess}
        />
      )}
      
      {selectedRecipe && (
        <Modal recipe={selectedRecipe} onClose={handleCloseModal} />
      )}
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default App;


