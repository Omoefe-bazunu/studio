"use client";

import React, { useEffect, useState } from "react";
import { getVisitorStats } from "@/lib/firebase/firestoreService";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Users, MousePointerClick } from "lucide-react";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisitorStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  // 1. Calculate Metrics
  const totalVisits = stats.length;
  const uniqueVisits = stats.filter((log) => log.isUnique).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B46C1] mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Syncing Traffic Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 2. ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-[#6B46C1] text-white rounded-none shadow-xl flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">
              Unique Sessions
            </p>
            <h3 className="text-4xl font-black italic tracking-tighter">
              {uniqueVisits}
            </h3>
          </div>
          <Users className="h-10 w-10 opacity-20" />
        </div>

        <div className="p-8 bg-slate-900 text-white rounded-none shadow-xl flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">
              Total Page Hits
            </p>
            <h3 className="text-4xl font-black italic tracking-tighter">
              {totalVisits}
            </h3>
          </div>
          <MousePointerClick className="h-10 w-10 opacity-20" />
        </div>
      </div>

      {/* 3. VISITOR TABLE */}
      <div className="p-8 bg-white rounded-none border border-slate-100 shadow-xl overflow-x-auto">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-6">
          Live Visitor Traffic
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-none">
              <TableCell className="font-black uppercase text-[10px] tracking-widest text-slate-400">
                Time
              </TableCell>
              <TableCell className="font-black uppercase text-[10px] tracking-widest text-slate-400">
                Page
              </TableCell>
              <TableCell className="font-black uppercase text-[10px] tracking-widest text-slate-400">
                Location
              </TableCell>
              <TableCell className="font-black uppercase text-[10px] tracking-widest text-slate-400">
                Device
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((log) => (
              <TableRow
                key={log.id}
                className="hover:bg-slate-50 transition-colors border-slate-50"
              >
                <TableCell className="text-slate-500 text-xs font-medium">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-[10px] font-black px-3 py-1 uppercase rounded-full ${
                      log.isUnique
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-[#6B46C1]"
                    }`}
                  >
                    {log.page}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600 font-bold text-sm">
                  {log.city}, {log.region}, {log.country}
                </TableCell>
                <TableCell className="text-slate-400 text-[10px] max-w-[200px] truncate font-medium">
                  {log.userAgent}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
