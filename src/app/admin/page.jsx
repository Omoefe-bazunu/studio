"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getContactMessages,
  deleteContactMessage,
} from "@/lib/firebase/firestoreService";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
  Loader2,
  Users,
  Mail,
  Activity,
  ChevronRight,
  Menu as MenuIcon,
  X,
  Image as ImageIcon,
  Trash2,
  Clock,
  LogOut,
  DollarSign,
  Package,
  QuoteIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Components
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ManageAmazonProducts from "@/components/admin/ManageAmazonProducts";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import ShopAdminPage from "../../components/admin/shopAdmin";
import { Button } from "@/components/ui/button";
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
import AdminSubscribers from "../../components/admin/AdminSubscribers";

const ADMIN_EMAIL = "raniem57@gmail.com";

export default function AdminDashboard() {
  const { currentUser, loadingAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [activeMenu, setActiveMenu] = useState("traffic");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const isAuthorized = currentUser?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (loadingAuth) return;
    if (!isAuthorized) {
      toast({ title: "Unauthorized", variant: "destructive" });
      router.push("/");
    } else {
      fetchDashboardData();
    }
  }, [currentUser, loadingAuth, router, isAuthorized, toast]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    try {
      const fetchedMessages = await getContactMessages();
      setMessages(fetchedMessages || []);
      const userSnap = await getDocs(
        query(collection(db, "users"), orderBy("createdAt", "desc")),
      );
      setUsersList(userSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Fetch Error:", error);
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

  const menuItems = [
    { id: "traffic", label: "Site Traffic", icon: Activity },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "users", label: "Users", icon: Users },
    { id: "amazon", label: "Amazon", icon: Package },
    { id: "shop", label: "Shop", icon: Package },
    { id: "testimonials", label: "Testimonials", icon: QuoteIcon },
    { id: "newsletter", label: "Newsletter", icon: Mail },
  ];

  if (loadingAuth)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F0A1F]">
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );
  if (!isAuthorized) return null;

  return (
    <>
      <div className="relative min-h-screen bg-slate-50">
        {/* Mobile Nav */}
        <div className="lg:hidden fixed top-0 w-full h-16 bg-[#0F0A1F] text-white z-[60] flex items-center justify-between px-6">
          <h1 className="font-bold text-lg">Admin Panel</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-full w-64 bg-white border-r p-6 flex flex-col transition-transform z-[70] lg:sticky lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="mb-8 mt-8 lg:mt-0">
              <h1 className="text-xl font-black text-slate-900">HIGH-ER</h1>
              <p className="text-[10px] font-bold uppercase text-primary tracking-widest">
                Admin Menu
              </p>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${activeMenu === item.id ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="font-bold text-xs uppercase">
                      {item.label}
                    </span>
                  </div>
                  {activeMenu === item.id && <ChevronRight size={14} />}
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-500 hover:text-red-500"
                onClick={() => router.push("/")}
              >
                <LogOut size={18} className="mr-2" />
                <span className="text-xs font-bold uppercase">Logout</span>
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-10 pt-24 lg:pt-10 overflow-x-hidden">
            <header className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase">
                {menuItems.find((i) => i.id === activeMenu)?.label}
              </h2>
              <div className="h-1 w-12 bg-[#FF8C38] mt-2" />
            </header>

            <div className="animate-in fade-in duration-300">
              {activeMenu === "traffic" && <AnalyticsDashboard />}
              {activeMenu === "amazon" && <ManageAmazonProducts />}
              {activeMenu === "testimonials" && <AdminTestimonials />}
              {activeMenu === "shop" && <ShopAdminPage />}
              {activeMenu === "newsletter" && <AdminSubscribers />}
              {activeMenu === "messages" && (
                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                  {loadingData ? (
                    <div className="p-12 flex justify-center">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-bold uppercase text-xs">
                      No messages found.
                    </div>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {messages.map((msg) => (
                        <AccordionItem
                          value={msg.id}
                          key={msg.id}
                          className="border-b last:border-0"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 hover:no-underline">
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-slate-900">
                                {msg.subject}
                              </span>
                              <span className="text-xs text-primary font-medium mt-1">
                                {msg.name} • {msg.email}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                              <div className="flex justify-between items-center border-b pb-3">
                                <span className="text-xs text-slate-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />{" "}
                                  {msg.createdAt
                                    ? format(new Date(msg.createdAt), "PPP p")
                                    : "N/A"}
                                </span>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setMessageToDelete(msg)}
                                  className="h-8 rounded-full"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                </Button>
                              </div>
                              <p className="text-slate-700 text-sm whitespace-pre-wrap">
                                {msg.message}
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              )}

              {activeMenu === "users" && (
                <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">
                          Email
                        </th>
                        <th className="px-6 py-3 text-xs font-bold uppercase text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {u.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold uppercase">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Delete Modal */}
        <AlertDialog
          open={!!messageToDelete}
          onOpenChange={() => setMessageToDelete(null)}
        >
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Message</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this message? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteMessage}
                className="bg-red-600 rounded-full"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <style
          dangerouslySetInnerHTML={{
            __html: `.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`,
          }}
        />
      </div>
    </>
  );
}
