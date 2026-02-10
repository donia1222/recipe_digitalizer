"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { RecipeService } from "@/lib/services/recipeService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Star, Calendar, ChefHat, Search, Grid3x3, List, ChevronLeft, ChevronRight, Camera, Upload, RefreshCw, Scan, BookOpen, Home, LogOut, ArrowLeft, Shield, Users } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface HistoryItem {
  id: number
  recipeId?: string
  image: string
  analysis: string
  date: string
  folderId?: string
  title?: string
  isFavorite?: boolean
  user_id?: string
}

interface RecipeLibraryProps {
  onSelectItem: (item: HistoryItem) => void
  onCreateNew: () => void
  onUploadImage: (file: File, onProgress?: (progress: number) => void, onComplete?: () => void, servings?: number) => void
  onTakePhoto: (onPhotoTaken: (imageData: string) => void) => void
  onStartAnalysis: () => void
  onBackToHome?: () => void
  handleLogout: () => void
}

const RecipeLibrary: React.FC<RecipeLibraryProps> = ({ onSelectItem, onCreateNew, onUploadImage, onTakePhoto, onStartAnalysis, onBackToHome, handleLogout }) => {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [imageIndices, setImageIndices] = useState<{[key: number]: number}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedImageData, setSelectedImageData] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [initialServings, setInitialServings] = useState(2)

  useEffect(() => {
    loadData()
  }, [])

  // Escuchar eventos de actualización y eliminación de recetas
  useEffect(() => {
    const handleRecipeUpdate = () => {
      console.log('📚 Recipe updated event received in LIBRARY, reloading data...');
      loadData();
    };

    const handleRecipeDelete = () => {
      console.log('📚 Recipe deleted event received, reloading data...');
      loadData();
    };

    window.addEventListener('recipeUpdated', handleRecipeUpdate);
    window.addEventListener('recipeDeleted', handleRecipeDelete);

    return () => {
      window.removeEventListener('recipeUpdated', handleRecipeUpdate);
      window.removeEventListener('recipeDeleted', handleRecipeDelete);
    };
  }, [])

  const loadData = async () => {
    try {
      // Cargar recetas directamente desde la BD con cache busting
      console.log('📚 Cargando recetas desde la BD...');

      // Hacer llamada directa a la API para forzar datos frescos
      const response = await fetch(`https://web.lweb.ch/recipedigitalizer/apis/recipes-simple.php?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });

      const data = await response.json();
      const recipesFromDB = data.data || [];
      console.log('📚 Recetas desde BD (fresh):', recipesFromDB);

      // IMPORTANTE: Usar imagen adicional como miniatura si no hay imagen principal
      const optimizedRecipes = recipesFromDB.map((recipe: any) => {
        // Determinar imagen principal: usar imagen principal, o primera imagen adicional si no hay principal
        let mainImage = recipe.image_base64 || recipe.image_url || recipe.image;

        // Debug: Mostrar información de la receta
        console.log('🔍 Processing recipe in library:', {
          id: recipe.id,
          title: recipe.title,
          hasMainImage: !!mainImage,
          hasAdditionalImages: !!(recipe.additional_images && recipe.additional_images.length > 0),
          additionalImagesCount: recipe.additional_images ? recipe.additional_images.length : 0
        });

        // Si no hay imagen principal pero sí hay imágenes adicionales, usar la primera
        if (!mainImage && recipe.additional_images && recipe.additional_images.length > 0) {
          const firstAdditionalImage = recipe.additional_images[0];
          mainImage = firstAdditionalImage.image_base64 || firstAdditionalImage.image_url;
          console.log('🖼️ Library - Using first additional image as main for recipe:', recipe.id, 'has additional images:', recipe.additional_images.length);
        }

        return {
          ...recipe,
          image: mainImage, // Imagen principal o primera adicional
          folderId: recipe.category_id || recipe.folderId,
          title: recipe.title || recipe.name,
          date: recipe.created_at || recipe.date,
          recipeId: recipe.recipe_id || recipe.recipeId
        };
      });

      setHistory(optimizedRecipes);
    } catch (error) {
      console.error('Error cargando recetas:', error);
      setHistory([]); // Si hay error, mostrar lista vacía
    }
  }


  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()

    const updatedHistory = history.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    )
    setHistory(updatedHistory)
    localStorage.setItem("recipeHistory", JSON.stringify(updatedHistory))
  }


  const deleteHistoryItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()

    const itemToDelete = history.find(item => item.id === id)
    const recipeTitle = itemToDelete?.title || extractRecipeTitle(itemToDelete?.analysis || '')

    const confirmed = window.confirm(`¿Está seguro de que desea eliminar la receta "${recipeTitle}"?\n\nEsta acción no se puede deshacer.`)

    if (!confirmed) {
      return
    }

    if (itemToDelete?.recipeId) {
      localStorage.removeItem(`recipe-images-${itemToDelete.recipeId}`)
    }

    const updatedHistory = history.filter((item) => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem("recipeHistory", JSON.stringify(updatedHistory))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Datum unbekannt'
    }

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Datum unbekannt'
    }

    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const extractRecipeTitle = (analysis: string) => {
    const firstLine = analysis.split('\n')[0]
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
  }

  const [userNameCache, setUserNameCache] = useState<{[key: string]: string}>({})

  const getUserName = (userId?: string): string => {
    if (!userId) return 'Unbekannter Benutzer';

    // Check cache first
    if (userNameCache[userId]) {
      return userNameCache[userId];
    }

    // Try to get user name from current user if it matches
    const currentUserStr = localStorage.getItem('current-user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === userId) {
          const name = currentUser.name || 'Sie';
          setUserNameCache(prev => ({ ...prev, [userId]: name }));
          return name;
        }
      } catch (error) {
        console.error('Error parsing current user:', error);
      }
    }

    // Fetch from API in background
    fetchUserName(userId);

    return 'Cargando...';
  }

  const fetchUserName = async (userId: string) => {
    try {
      const response = await fetch(`https://web.lweb.ch/recipedigitalizer/apis/users.php?id=${userId}`);
      const data = await response.json();

      if (data.success && data.data) {
        // Check if data.data is an array (all users) or single user
        if (Array.isArray(data.data)) {
          const user = data.data.find((u: any) => u.id === userId);
          if (user && user.name) {
            setUserNameCache(prev => ({ ...prev, [userId]: user.name }));
            return;
          }
        } else if (data.data.name) {
          setUserNameCache(prev => ({ ...prev, [userId]: data.data.name }));
          return;
        }
      }

      // Fallback to static mapping
      const staticMappings: { [key: string]: string } = {
        '1': 'Andrea Müller',
        '2': 'Hans Weber',
        '3': 'Maria Schmidt',
        '4': 'Peter Fischer',
        'admin-001': 'Andrea Müller',
        'worker-001': 'Hans Weber',
        'worker-002': 'Maria Schmidt',
        'guest-001': 'Peter Fischer'
      };
      const fallbackName = staticMappings[userId] || 'Usuario';
      setUserNameCache(prev => ({ ...prev, [userId]: fallbackName }));
    } catch (error) {
      console.error('Error fetching user:', error);
      setUserNameCache(prev => ({ ...prev, [userId]: 'Usuario' }));
    }
  }


  const getRecipeImages = (item: HistoryItem): string[] => {
    const allImages: string[] = []

    if (item.image) {
      allImages.push(item.image)
    }

    const savedImages = localStorage.getItem(`recipe-images-${item.recipeId || item.id}`)
    if (savedImages) {
      try {
        const additionalImages = JSON.parse(savedImages)
        allImages.push(...additionalImages)
      } catch (error) {
        console.error('Error loading additional images:', error)
      }
    }

    return allImages
  }

  const nextImageInMiniature = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const item = history.find(h => h.id === itemId)
    if (!item) return

    const images = getRecipeImages(item)
    const currentIndex = imageIndices[itemId] || 0
    const nextIndex = (currentIndex + 1) % images.length

    setImageIndices(prev => ({
      ...prev,
      [itemId]: nextIndex
    }))
  }

  const prevImageInMiniature = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const item = history.find(h => h.id === itemId)
    if (!item) return

    const images = getRecipeImages(item)
    const currentIndex = imageIndices[itemId] || 0
    const prevIndex = (currentIndex - 1 + images.length) % images.length

    setImageIndices(prev => ({
      ...prev,
      [itemId]: prevIndex
    }))
  }

  const getCurrentImage = (item: HistoryItem): string => {
    const images = getRecipeImages(item)
    const currentIndex = imageIndices[item.id] || 0
    return images[currentIndex] || item.image || "/placeholder.svg"
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImageData(event.target.result as string)
          setShowConfirmModal(true)
        }
      }

      reader.readAsDataURL(file)
      e.target.value = ""
    }
  }

  const updateProgress = useCallback((progress: number) => {
    setTimeout(() => {
      setAnalysisProgress(progress * 100)
    }, 0)
  }, [])

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      setShowConfirmModal(false)
      setSelectedImageData(null)
      setIsAnalyzing(false)
      setAnalysisProgress(0)
      onStartAnalysis()
    }, 0)
  }, [onStartAnalysis])

  const confirmAnalysis = () => {
    if (selectedImageData) {
      setIsAnalyzing(true)
      setAnalysisProgress(0)

      // Convert back to File object for the onUploadImage function
      fetch(selectedImageData)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "uploaded_image.jpg", { type: "image/jpeg" })
          // Pass initial servings to the upload function
          onUploadImage(file, updateProgress, handleComplete, initialServings)
        })
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleTakePhoto = () => {
    onTakePhoto((imageData: string) => {
      setSelectedImageData(imageData)
      setShowConfirmModal(true)
    })
  }

  const handleScanDocument = async () => {
    try {
      // Intentar usar la API Web Scanning si está disponible
      if ('scanner' in navigator) {
        // @ts-ignore - API experimental
        const scanner = await navigator.scanner.requestDevice()
        const scanResult = await scanner.scan()

        if (scanResult && scanResult.imageData) {
          setSelectedImageData(scanResult.imageData)
          setShowConfirmModal(true)
        }
      } else {
        // Fallback: Simular input file con accept específico para scanner
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.capture = 'environment' // Priorizar cámara trasera/scanner

        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
              if (event.target?.result) {
                setSelectedImageData(event.target.result as string)
                setShowConfirmModal(true)
              }
            }
            reader.readAsDataURL(file)
          }
        }

        input.click()
      }
    } catch (error) {
      console.error('Error al acceder al scanner:', error)
      // Fallback a selección de archivo normal
      triggerFileInput()
    }
  }

  const filteredHistory = history.filter(item => {
    const matchesSearch = searchTerm === "" ||
      item.analysis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-blue-50 overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </button>
            )}
            <img src="/1e9739e5-a2a7-4218-8384-5602515adbb7.png" alt="RezeptApp" className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover" />
            <div className="leading-none">
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Rezeptsammlung</span>
              <span className="text-lg sm:text-xl font-extrabold text-blue-600 tracking-tight"> App</span>
            </div>
          </div>
        </div>
        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent translate-y-full pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-12">
        {/* Section title */}
        <div className="mb-8 mt-2">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Rezepte Digitalisieren</h2>
          <p className="text-[15px] text-gray-500">Foto aufnehmen oder hochladen</p>
        </div>

        <div className="space-y-5">

          {/* Foto machen */}
          <div
            onClick={handleTakePhoto}
            className="group bg-white rounded-[20px] p-7 sm:p-10 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Foto machen</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
                  Machen Sie ein Foto Ihres Rezepts direkt mit der Kamera Ihres Geräts
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                      <Camera className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Direkte Aufnahme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                      <Scan className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Optimiert für Dokumente</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Bild hochladen */}
          <div
            onClick={triggerFileInput}
            className="group bg-white rounded-[20px] p-7 sm:p-10 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Bild hochladen</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
                  Wählen Sie ein bereits gespeichertes Bild aus Ihrer Galerie oder Ihrem Computer aus
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                      <Upload className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Aus Galerie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                      <ChefHat className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Alle Formate</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Dokument scannen */}
          <div
            onClick={handleScanDocument}
            className="group bg-white rounded-[20px] p-7 sm:p-10 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-[250ms] cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Scan className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Dokument scannen</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
                  Verwenden Sie die Scanner-Funktion für beste Qualität bei Rezeptbüchern und Dokumenten
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                      <Scan className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Dokumenten-Scanner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                      <BookOpen className="h-3 w-3 text-blue-500" />
                    </div>
                    <span>Für Rezeptbücher</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 hidden sm:block">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <ChevronRight className="h-5 w-5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Input file oculto para subir imágenes */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Modal de confirmación */}
      <Dialog open={showConfirmModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-white rounded-[20px] border border-blue-100/60 p-0 overflow-hidden [&>button:last-child]:hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-blue-600" />
                </div>
                {isAnalyzing ? 'Rezept wird analysiert...' : 'Rezept analysieren?'}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6 space-y-5">
            {/* Image preview */}
            {selectedImageData && (
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-blue-100/60">
                <Image
                  src={selectedImageData}
                  alt="Ausgewähltes Bild"
                  fill
                  className="object-cover"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-5 text-center shadow-lg">
                      <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-semibold">Analysiere...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isAnalyzing ? (
              <div className="space-y-3">
                <Progress value={analysisProgress} className="w-full h-2.5 rounded-full bg-blue-50 [&>div]:bg-blue-600 [&>div]:rounded-full" />
                <p className="text-sm text-blue-600 text-center font-semibold">
                  <span className="text-xl font-extrabold">{Math.round(analysisProgress)}%</span>
                  <span className="text-gray-500 font-normal ml-2">Bitte warten...</span>
                </p>
              </div>
            ) : (
              <>
                {/* Servings input */}
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100/60">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <label className="text-sm font-semibold text-gray-700">
                      Für wie viele Personen?
                    </label>
                    <Input
                      type="number"
                      value={initialServings}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= 100) {
                          setInitialServings(value);
                        }
                      }}
                      min="1"
                      max="100"
                      className="w-16 h-9 text-center rounded-xl border-blue-200 bg-white focus:border-blue-500 font-bold text-gray-900"
                    />
                    <span className="text-sm text-gray-500 font-medium">Personen</span>
                  </div>
                </div>

                <p className="text-[15px] text-gray-500 text-center leading-relaxed">
                  Möchten Sie dieses Bild analysieren und das Rezept digitalisieren?
                </p>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false)
                      setSelectedImageData(null)
                    }}
                    className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-700 font-semibold text-[15px] hover:bg-gray-200 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={confirmAnalysis}
                    className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-semibold text-[15px] hover:bg-blue-700 transition-colors shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                  >
                    Analysieren
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default RecipeLibrary