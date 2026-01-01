"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getContactMessages,
  deleteContactMessage,
} from "@/lib/firebase/firestoreService";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trash2,
  Users,
  Mail,
  ShieldAlert,
  Clock,
  Activity,
} from "lucide-react"; // Added Activity icon
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard"; // 1. Import your Analytics component
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const ADMIN_EMAIL = "raniem57@gmail.com";

export default function AdminDashboard() {
  const { currentUser, loadingAuth, isAdmin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [messages, setMessages] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);
  const [loadingData, setLoadingData] = React.useState(true);
  const [messageToDelete, setMessageToDelete] = React.useState(null);

  React.useEffect(() => {
    if (!loadingAuth) {
      if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
        toast({
          title: "Unauthorized Access",
          description: "Returning to home...",
          variant: "destructive",
        });
        const timer = setTimeout(() => router.push("/"), 2000);
        return () => clearTimeout(timer);
      } else {
        fetchDashboardData();
      }
    }
  }, [currentUser, loadingAuth, router, toast]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const fetchedMessages = await getContactMessages();
      setMessages(fetchedMessages);

      const userQuery = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
      );
      const userSnap = await getDocs(userQuery);
      const fetchedUsers = userSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate
          ? doc.data().createdAt.toDate()
          : doc.data().createdAt,
      }));
      setUsersList(fetchedUsers);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await deleteContactMessage(messageToDelete.id);
      setMessages(messages.filter((m) => m.id !== messageToDelete.id));
      toast({ title: "Message Deleted" });
      setMessageToDelete(null);
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  if (loadingAuth) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-[#6B46C1] mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          Authenticating Admin...
        </p>
      </div>
    );
  }

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="h-screen flex items-center justify-center bg-white p-6">
        <Alert variant="destructive" className="max-w-md border-2 rounded-none">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="font-bold uppercase tracking-tighter">
            Security Alert
          </AlertTitle>
          <AlertDescription>
            Account <strong>{currentUser?.email || "Guest"}</strong> is not
            authorized for Admin access. Redirecting...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 pb-20">
        <div className="bg-[#0F0A1F] py-12 mb-8 border-b border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <h1 className="text-3xl font-bold text-white tracking-tighter">
              Admin <span className="text-[#FF8C38]">Command Center</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Authenticated as {ADMIN_EMAIL}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          {/* Changed default to 'analytics' to see your traffic first */}
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="bg-white h-fit border px-8 py-2 grid grid-cols-1 md:grid-cols-3 rounded-full mb-8 w-fit mx-auto md:mx-0 shadow-sm">
              {/* 2. Added Analytics Tab Trigger */}
              <TabsTrigger
                value="analytics"
                className="rounded-full px-8 data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white font-bold transition-all"
              >
                <Activity className="w-4 h-4 mr-2" /> Traffic Intelligence
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="rounded-full px-8 data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white font-bold transition-all"
              >
                <Mail className="w-4 h-4 mr-2" /> Messages ({messages.length})
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="rounded-full px-8 data-[state=active]:bg-[#6B46C1] data-[state=active]:text-white font-bold transition-all"
              >
                <Users className="w-4 h-4 mr-2" /> Users ({usersList.length})
              </TabsTrigger>
            </TabsList>

            {/* 3. Added Analytics Content Section */}
            <TabsContent
              value="analytics"
              className="border-none p-0 outline-none"
            >
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="messages">
              <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
                {loadingData ? (
                  <div className="p-20 flex justify-center">
                    <Loader2 className="animate-spin text-[#6B46C1]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-20 text-center text-slate-400">
                    No active inquiries.
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {messages.map((message) => (
                      <AccordionItem
                        value={message.id}
                        key={message.id}
                        className="border-b last:border-0"
                      >
                        <AccordionTrigger className="px-8 py-6 hover:bg-slate-50 transition-all hover:no-underline">
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-900">
                              {message.subject}
                            </span>
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">
                              {message.name} • {message.email}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-8 pb-8">
                          <div className="bg-slate-50 p-6 border-l-4 border-[#6B46C1] space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                <Clock className="w-3 h-3 mr-1" />{" "}
                                {format(new Date(message.createdAt), "PPP p")}
                              </span>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setMessageToDelete(message)}
                                className="rounded-full h-8 px-4"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                              </Button>
                            </div>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap pt-2">
                              {message.message}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-4 text-xs font-bold uppercase text-slate-400">
                        Email Address
                      </th>
                      <th className="px-8 py-4 text-xs font-bold uppercase text-slate-400">
                        Join Date
                      </th>
                      <th className="px-8 py-4 text-xs font-bold uppercase text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-8 py-5 text-sm font-bold text-slate-900">
                          {u.email}
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-500">
                          {u.createdAt
                            ? format(new Date(u.createdAt), "MMM dd, yyyy p")
                            : "---"}
                        </td>
                        <td className="px-8 py-5">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <AlertDialog
          open={!!messageToDelete}
          onOpenChange={() => setMessageToDelete(null)}
        >
          <AlertDialogContent className="rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold text-xl uppercase tracking-tighter">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                This inquiry will be permanently removed from the records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteMessage}
                className="bg-destructive rounded-full"
              >
                Delete Message
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Footer />
    </>
  );
}
