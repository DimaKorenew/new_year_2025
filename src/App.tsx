import { useState, useEffect } from 'react';
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
import { ShoppingListFAB } from './components/ShoppingListFAB';
import { ShoppingListModal } from './components/ShoppingListModal';
import { useShoppingList } from './hooks/useShoppingList';
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
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);

  const {
    list,
    itemsCount,
    addIngredient,
    addAllIngredients,
    toggleItem,
    removeItem,
    clearList,
    loadSharedList,
  } = useShoppingList();

  // Handle URL parameter for shared lists
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get('list');
    if (listId) {
      loadSharedList(listId);
      setShowShoppingListModal(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [loadSharedList]);

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

  const handleShowToast = (message: string) => {
    setToastMessage(message);
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
      <ShoppingListFAB itemsCount={itemsCount} onClick={() => setShowShoppingListModal(true)} />
      
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
        <Modal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
          onAddIngredient={addIngredient}
          onAddAllIngredients={addAllIngredients}
          onShowToast={handleShowToast}
        />
      )}

      {showShoppingListModal && (
        <ShoppingListModal
          list={list}
          onClose={() => setShowShoppingListModal(false)}
          onToggleItem={toggleItem}
          onRemoveItem={removeItem}
          onClearList={clearList}
          onShowToast={handleShowToast}
        />
      )}
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

export default App;


