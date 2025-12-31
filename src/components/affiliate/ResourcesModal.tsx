
"use client";

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, Edit3, Loader2, PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { AffiliateResourceText, AffiliateResourceImage, AffiliateResourceTextFormData, AffiliateResourceImageFormData } from '@/types';
import {
  getAffiliateTextResources,
  addAffiliateTextResource,
  updateAffiliateTextResource,
  deleteAffiliateTextResource,
  getAffiliateImageResources,
  addAffiliateImageResource,
  updateAffiliateImageResource,
  deleteAffiliateImageResource,
} from '@/lib/firebase/firestoreService';
import AffiliateTextResourceForm from '@/components/admin/AffiliateTextResourceForm';
import AffiliateImageResourceForm from '@/components/admin/AffiliateImageResourceForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Dummy data as fallback
const dummyTextAssets = [
  {
    id: 'dummy-text1',
    title: 'Social Media Post - General (Placeholder)',
    content: "Looking for top-notch Web Development, Digital Marketing, Ads Design, or CV/Resume Writing? HIGH-ER ENTERPRISES delivers quality and affordability. Check them out! [Your Affiliate Link Here]",
  },
];

const dummyImageAssets = [
  {
    id: 'dummy-img1',
    altText: 'Promotional Banner 1 (Placeholder)',
    imageUrl: 'https://placehold.co/600x300.png?text=Ad+Banner+1',
    imageHint: 'promotional banner modern',
    downloadName: 'higher_promo_banner_1.png',
  },
];

interface ResourcesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type ResourceType = 'text' | 'image';
interface ResourceToDelete {
  id: string;
  type: ResourceType;
  name: string; // For display in confirmation (e.g., title or altText)
}

export default function ResourcesModal({ isOpen, onOpenChange }: ResourcesModalProps) {
  const { toast } = useToast();
  const { isAdmin, loadingAuth } = useAuth();

  const [textResources, setTextResources] = React.useState<AffiliateResourceText[]>([]);
  const [imageResources, setImageResources] = React.useState<AffiliateResourceImage[]>([]);
  const [isLoadingText, setIsLoadingText] = React.useState(false);
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);
  const [textError, setTextError] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState<string | null>(null);

  const [isTextFormOpen, setIsTextFormOpen] = React.useState(false);
  const [editingTextResource, setEditingTextResource] = React.useState<AffiliateResourceText | null>(null);
  const [isImageFormOpen, setIsImageFormOpen] = React.useState(false);
  const [editingImageResource, setEditingImageResource] = React.useState<AffiliateResourceImage | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = React.useState(false);
  const [resourceToDelete, setResourceToDelete] = React.useState<ResourceToDelete | null>(null);

  const fetchResources = React.useCallback(async () => {
    setIsLoadingText(true);
    setIsLoadingImages(true);
    setTextError(null);
    setImageError(null);
    try {
      const texts = await getAffiliateTextResources();
      setTextResources(texts);
    } catch (e) {
      console.error("Error fetching text resources:", e);
      setTextError("Could not load text resources.");
    } finally {
      setIsLoadingText(false);
    }
    try {
      const images = await getAffiliateImageResources();
      setImageResources(images);
    } catch (e) {
      console.error("Error fetching image resources:", e);
      setImageError("Could not load image resources.");
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      fetchResources();
    }
  }, [isOpen, fetchResources]);

  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({ title: 'Text Copied!', description: 'Marketing text copied to clipboard.' });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({ title: 'Copy Failed', description: 'Could not copy text.', variant: 'destructive' });
      });
  };

  // --- Admin Form Handlers ---
  const handleOpenAddTextForm = () => {
    setEditingTextResource(null);
    setIsTextFormOpen(true);
  };
  const handleOpenEditTextForm = (resource: AffiliateResourceText) => {
    setEditingTextResource(resource);
    setIsTextFormOpen(true);
  };
  const handleOpenAddImageForm = () => {
    setEditingImageResource(null);
    setIsImageFormOpen(true);
  };
  const handleOpenEditImageForm = (resource: AffiliateResourceImage) => {
    setEditingImageResource(resource);
    setIsImageFormOpen(true);
  };

  const handleTextFormSubmit = async (data: AffiliateResourceTextFormData) => {
    setIsSubmittingForm(true);
    try {
      if (editingTextResource) {
        await updateAffiliateTextResource(editingTextResource.id, data);
        toast({ title: "Text Resource Updated!" });
      } else {
        await addAffiliateTextResource(data);
        toast({ title: "Text Resource Added!" });
      }
      setIsTextFormOpen(false);
      fetchResources();
    } catch (error) {
      toast({ title: `Error ${editingTextResource ? 'updating' : 'adding'} text resource`, description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleImageFormSubmit = async (data: AffiliateResourceImageFormData) => {
    setIsSubmittingForm(true);
    try {
      if (editingImageResource) {
        await updateAffiliateImageResource(editingImageResource.id, data);
        toast({ title: "Image Resource Updated!" });
      } else {
        await addAffiliateImageResource(data);
        toast({ title: "Image Resource Added!" });
      }
      setIsImageFormOpen(false);
      fetchResources();
    } catch (error) {
      toast({ title: `Error ${editingImageResource ? 'updating' : 'adding'} image resource`, description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDeleteConfirmation = (id: string, type: ResourceType, name: string) => {
    setResourceToDelete({ id, type, name });
  };

  const confirmDeleteResource = async () => {
    if (!resourceToDelete) return;
    try {
      if (resourceToDelete.type === 'text') {
        await deleteAffiliateTextResource(resourceToDelete.id);
      } else {
        await deleteAffiliateImageResource(resourceToDelete.id);
      }
      toast({ title: `${resourceToDelete.type === 'text' ? 'Text' : 'Image'} Resource Deleted` });
      fetchResources();
    } catch (error) {
      toast({ title: `Error deleting ${resourceToDelete.type} resource`, description: (error as Error).message, variant: "destructive" });
    } finally {
      setResourceToDelete(null);
    }
  };

  // Determine which data to display
  const showDummyText = (!isLoadingText && (textError || textResources.length === 0)) && !isAdmin;
  const showDummyImages = (!isLoadingImages && (imageError || imageResources.length === 0)) && !isAdmin;

  const currentTextAssets = showDummyText ? dummyTextAssets : textResources;
  const currentImageAssets = showDummyImages ? dummyImageAssets : imageResources;


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-primary">Affiliate Marketing Resources</DialogTitle>
          <DialogDescription>
            Use these assets to promote HIGH-ER ENTERPRISES services.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-220px)] p-1 pr-4">
          <div className="space-y-8 py-4">
            {/* Text Resources Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-primary">Text Assets</h3>
                {isAdmin && !loadingAuth && (
                  <Button size="sm" onClick={handleOpenAddTextForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Text
                  </Button>
                )}
              </div>
              {isLoadingText && <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />}
              {!isLoadingText && textError && (
                <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{textError}</AlertDescription></Alert>
              )}
              {!isLoadingText && !textError && currentTextAssets.length === 0 && isAdmin && (
                <p className="text-muted-foreground text-sm text-center py-4">No text resources found. Add some!</p>
              )}
              {!isLoadingText && !textError && currentTextAssets.length > 0 && (
                <div className="space-y-4">
                  {currentTextAssets.map((asset) => (
                    <div key={asset.id} className="p-4 border rounded-lg bg-muted/50 shadow-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-foreground mb-1 flex-1">{asset.title}</h4>
                        {isAdmin && !loadingAuth && (
                          <div className="flex gap-2 ml-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleOpenEditTextForm(asset as AffiliateResourceText)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteConfirmation(asset.id, 'text', asset.title)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line">{asset.content}</p>
                      <Button variant="outline" size="sm" onClick={() => handleCopyText(asset.content)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Text
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image Resources Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-primary">Image Assets</h3>
                {isAdmin && !loadingAuth && (
                  <Button size="sm" onClick={handleOpenAddImageForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                  </Button>
                )}
              </div>
              {isLoadingImages && <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />}
              {!isLoadingImages && imageError && (
                 <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{imageError}</AlertDescription></Alert>
              )}
              {!isLoadingImages && !imageError && currentImageAssets.length === 0 && isAdmin && (
                 <p className="text-muted-foreground text-sm text-center py-4">No image resources found. Add some!</p>
              )}
              {!isLoadingImages && !imageError && currentImageAssets.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentImageAssets.map((asset) => (
                    <div key={asset.id} className="p-4 border rounded-lg bg-muted/50 shadow-sm">
                       <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-foreground truncate flex-1" title={asset.altText}>{asset.altText}</p>
                         {isAdmin && !loadingAuth && (
                          <div className="flex gap-2 ml-2">
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleOpenEditImageForm(asset as AffiliateResourceImage)}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteConfirmation(asset.id, 'image', asset.altText)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="relative w-full h-48 rounded-md overflow-hidden mb-3 shadow">
                        <Image
                          src={asset.imageUrl}
                          alt={asset.altText}
                          data-ai-hint={asset.imageHint}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={asset.imageUrl} download={asset.downloadName || asset.altText.replace(/\s+/g, '_') + '.png'}>
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Admin Forms */}
      {isAdmin && (
        <>
          <AffiliateTextResourceForm
            isOpen={isTextFormOpen}
            onOpenChange={setIsTextFormOpen}
            onSubmit={handleTextFormSubmit}
            initialData={editingTextResource}
            isLoading={isSubmittingForm}
          />
          <AffiliateImageResourceForm
            isOpen={isImageFormOpen}
            onOpenChange={setIsImageFormOpen}
            onSubmit={handleImageFormSubmit}
            initialData={editingImageResource}
            isLoading={isSubmittingForm}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!resourceToDelete} onOpenChange={() => setResourceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the {resourceToDelete?.type} resource titled "{resourceToDelete?.name}".
              {resourceToDelete?.type === 'image' && " The image file will also be removed from storage."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResourceToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteResource} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </Dialog>
  );
}


    