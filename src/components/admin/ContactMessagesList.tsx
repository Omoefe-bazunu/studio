
"use client";

import * as React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getContactMessages, deleteContactMessage } from '@/lib/firebase/firestoreService';
import type { ContactMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContactMessagesList() {
  const { isAdmin, loadingAuth } = useAuth();
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = React.useState<ContactMessage | null>(null);
  const { toast } = useToast();

  const fetchMessages = React.useCallback(async () => {
    if (!isAdmin) {
      setIsLoadingMessages(false);
      setMessages([]);
      setFetchError(null);
      return;
    }
    setIsLoadingMessages(true);
    setFetchError(null);
    try {
      const fetchedMessages = await getContactMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      const errorMessage = (error instanceof Error) ? error.message : "Could not load messages.";
      toast({
        title: "Error Fetching Messages",
        description: errorMessage,
        variant: "destructive",
      });
      setFetchError(errorMessage);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [isAdmin, toast]);

  React.useEffect(() => {
    if (!loadingAuth && isAdmin) {
      fetchMessages();
    } else if (!loadingAuth && !isAdmin) {
      setMessages([]);
      setIsLoadingMessages(false);
      setFetchError(null);
    }
  }, [loadingAuth, isAdmin, fetchMessages]);

  const handleDeleteClick = (message: ContactMessage) => {
    setMessageToDelete(message);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      await deleteContactMessage(messageToDelete.id);
      toast({
        title: "Message Deleted",
        description: `Message from "${messageToDelete.name}" has been deleted.`,
      });
      setMessageToDelete(null);
      fetchMessages(); 
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error Deleting Message",
        description: (error instanceof Error) ? error.message : "Could not delete the message.",
        variant: "destructive",
      });
    }
  };
  
  if (loadingAuth) {
    return (
        <div className="mt-12 text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-2">Verifying admin status...</p>
        </div>
      );
  }

  // This component should only render content if isAdmin is true, 
  // the decision to render this component at all is now in src/app/contact/page.tsx
  if (!isAdmin) {
    return null; 
  }

  return (
    <section className="mt-12 py-8 border-t border-border">
      <h2 className="text-2xl font-semibold text-primary mb-6">Submitted Messages</h2>
      
      {isLoadingMessages && (
        <div className="text-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-2">Loading messages...</p>
        </div>
      )}

      {!isLoadingMessages && fetchError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Messages</AlertTitle>
          <AlertDescription>{fetchError} Please ensure your Firestore rules allow admin read/list access to 'contacts'.</AlertDescription>
        </Alert>
      )}

      {!isLoadingMessages && !fetchError && messages.length === 0 && (
        <p className="text-muted-foreground text-center py-6">No contact messages found.</p>
      )}

      {!isLoadingMessages && !fetchError && messages.length > 0 && (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {messages.map((message) => (
            <AccordionItem value={message.id} key={message.id} className="bg-card border border-border rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 w-full text-left text-foreground">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <p className="font-medium text-primary truncate max-w-xs sm:max-w-md md:max-w-lg">{message.subject}</p>
                        <p className="text-xs text-muted-foreground">From: {message.name} ({message.email})</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 sm:mt-0 sm:ml-4 whitespace-nowrap">
                        {format(new Date(message.createdAt), "PPP 'at' p")}
                    </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-0 space-y-3">
                {message.serviceOfInterest && (
                  <p className="text-sm"><strong className="text-foreground">Service of Interest:</strong> {message.serviceOfInterest}</p>
                )}
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{message.message}</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(message)}
                  className="mt-3"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Message
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {messageToDelete && (
        <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the message from "{messageToDelete.name}" regarding "{messageToDelete.subject}". This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setMessageToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </section>
  );
}

    