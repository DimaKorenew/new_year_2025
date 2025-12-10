import { useState, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { FloatingShareButton } from './components/FloatingShareButton';
import { ShareButtons } from './components/ShareButtons';
import { TagsSection } from './components/TagsSection';
import { SaladsSection } from './components/SaladsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { TimelineSection } from './components/TimelineSection';
import { VideoRecipesSection, saladsData, appetizersData } from './components/VideoRecipesSection';
import { NewYearMenuSection } from './components/NewYearMenuSection';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ShoppingListFAB } from './components/ShoppingListFAB';
import { ShoppingListModal } from './components/ShoppingListModal';
import { ShareListModal } from './components/ShareListModal';
import { SharedListBanner } from './components/SharedListBanner';
import { useShoppingList } from './hooks/useShoppingList';
import {
  salads,
  articles,
  timelineStages,
} from './mockData';
import { saveToLocalStorage } from './services/shoppingListApi';

function MainContent() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [showShareListModal, setShowShareListModal] = useState(false);
  const [showSharedBanner, setShowSharedBanner] = useState(false);

  const {
    list,
    itemsCount,
    shareId,
    shareUrl,
    isShared,
    addIngredient,
    addAllIngredients,
    toggleItem,
    removeItem,
    clearList,
    createShareLink,
  } = useShoppingList();

  // Handle shared list sync notifications
  useEffect(() => {
    if (isShared && shareId) {
      // Polling is handled in useShoppingList
      // This effect can be used for showing sync notifications
    }
  }, [isShared, shareId]);


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

  const handleShareListClick = () => {
    setShowShareListModal(true);
  };

  const handleCreateShareLink = async () => {
    try {
      await createShareLink();
      handleShowToast('✓ Ссылка создана!');
    } catch (error) {
      handleShowToast('❌ Не удалось создать ссылку');
    }
  };

  const handleCopyShareUrl = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        handleShowToast('✓ Ссылка скопирована в буфер обмена');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleShareNative = async () => {
    if (shareUrl) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Мой список продуктов на Новый год 🎄',
            text: 'Мой список продуктов на Новый год 🎄',
            url: shareUrl,
          });
        } catch (error) {
          // User cancelled
        }
      } else {
        handleCopyShareUrl();
      }
    }
  };

  const handleSaveSharedList = () => {
    if (list) {
      saveToLocalStorage(list);
      handleShowToast('✓ Список сохранен к себе');
      setShowSharedBanner(false);
    }
  };


  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <SaladsSection
        recipes={salads}
        onAddIngredient={addIngredient}
        onAddAllIngredients={addAllIngredients}
        onShowToast={handleShowToast}
      />
      <TagsSection />
      <ArticlesSection articles={articles} />
      <TimelineSection stages={timelineStages} />
      <VideoRecipesSection
        data={saladsData}
        onAddIngredient={addIngredient}
        onAddAllIngredients={addAllIngredients}
        onShowToast={handleShowToast}
      />
      <VideoRecipesSection
        data={appetizersData}
        onAddIngredient={addIngredient}
        onAddAllIngredients={addAllIngredients}
        onShowToast={handleShowToast}
      />
      <NewYearMenuSection />
      <Breadcrumbs />
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
      

      {showSharedBanner && isShared && (
        <SharedListBanner
          onSave={handleSaveSharedList}
          onDismiss={() => setShowSharedBanner(false)}
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
          onShareClick={handleShareListClick}
        />
      )}

      {showShareListModal && (
        <ShareListModal
          list={list}
          shareId={shareId}
          shareUrl={shareUrl}
          onClose={() => setShowShareListModal(false)}
          onCopyUrl={handleCopyShareUrl}
          onShare={handleShareNative}
          onGenerateShare={handleCreateShareLink}
          onShowToast={handleShowToast}
        />
      )}
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

function SharedListPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [showShareListModal, setShowShareListModal] = useState(false);
  const [showSharedBanner, setShowSharedBanner] = useState(true);
  const [sharedListError, setSharedListError] = useState<string | null>(null);

  const {
    list,
    itemsCount,
    shareUrl,
    isShared,
    addIngredient,
    addAllIngredients,
    toggleItem,
    removeItem,
    clearList,
    createShareLink,
    loadSharedListFromUrl,
  } = useShoppingList(shareId || null);

  // Load shared list on mount
  useEffect(() => {
    if (shareId) {
      loadSharedListFromUrl(shareId)
        .then(() => {
          setShowShoppingListModal(true);
          handleShowToast('🎁 Вы подключились к общему списку');
        })
        .catch((error) => {
          if (error instanceof Error) {
            if (error.message === 'EXPIRED') {
              setSharedListError('⏰ Срок действия ссылки истек (90 дней)');
            } else if (error.message.includes('404') || error.message.includes('not found')) {
              setSharedListError('😔 Список не найден или был удален');
            } else {
              setSharedListError('😔 Не удалось загрузить список');
            }
          } else {
            setSharedListError('😔 Список не найден или был удален');
          }
        });
    }
  }, [shareId]);

  const handleShowToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSharedList = () => {
    if (list) {
      saveToLocalStorage(list);
      handleShowToast('✓ Список сохранен к себе');
      setShowSharedBanner(false);
    }
  };

  const handleShareListClick = () => {
    setShowShareListModal(true);
  };

  const handleCreateShareLink = async () => {
    try {
      await createShareLink();
      handleShowToast('✓ Ссылка создана!');
    } catch (error) {
      handleShowToast('❌ Не удалось создать ссылку');
    }
  };

  const handleCopyShareUrl = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        handleShowToast('✓ Ссылка скопирована в буфер обмена');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleShareNative = async () => {
    if (shareUrl) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Мой список продуктов на Новый год 🎄',
            text: 'Мой список продуктов на Новый год 🎄',
            url: shareUrl,
          });
        } catch (error) {
          // User cancelled
        }
      } else {
        handleCopyShareUrl();
      }
    }
  };

  if (sharedListError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-4">Ошибка</h2>
          <p className="text-gray-600 mb-6">{sharedListError}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      {showSharedBanner && isShared && (
        <SharedListBanner
          onSave={handleSaveSharedList}
          onDismiss={() => setShowSharedBanner(false)}
        />
      )}
      <Hero />
      <SaladsSection
        recipes={salads}
        onAddIngredient={addIngredient}
        onAddAllIngredients={addAllIngredients}
        onShowToast={handleShowToast}
      />
      <TagsSection />
      <ArticlesSection articles={articles} />
      <TimelineSection stages={timelineStages} />
      <VideoRecipesSection
        data={saladsData}
        onAddIngredient={addIngredient}
        onAddAllIngredients={addAllIngredients}
        onShowToast={handleShowToast}
      />
      <VideoRecipesSection
        data={appetizersData}
        onAddIngredient={addIngredient}
        onAddAllIngredients={addAllIngredients}
        onShowToast={handleShowToast}
      />
      <NewYearMenuSection />
      <Breadcrumbs />
      <Footer />

      <ShoppingListFAB itemsCount={itemsCount} onClick={() => setShowShoppingListModal(true)} />


      {showShoppingListModal && (
        <ShoppingListModal
          list={list}
          onClose={() => setShowShoppingListModal(false)}
          onToggleItem={toggleItem}
          onRemoveItem={removeItem}
          onClearList={clearList}
          onShowToast={handleShowToast}
          onShareClick={handleShareListClick}
        />
      )}

      {showShareListModal && (
        <ShareListModal
          list={list}
          shareId={shareId || null}
          shareUrl={shareUrl}
          onClose={() => setShowShareListModal(false)}
          onCopyUrl={handleCopyShareUrl}
          onShare={handleShareNative}
          onGenerateShare={handleCreateShareLink}
          onShowToast={handleShowToast}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/s/:shareId" element={<SharedListPage />} />
    </Routes>
  );
}

export default App;


