"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  getVisitorStats,
  getQuickMetrics,
} from "@/lib/firebase/firestoreService";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Users,
  MousePointerClick,
  Globe,
  Layout,
  Calendar,
  FilterX,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState([]);
  const [counts, setCounts] = useState({ total: 0, unique: 0 });
  const [loading, setLoading] = useState(true);

  // Filter & Toggle States
  const [countryFilter, setCountryFilter] = useState("All");
  const [pageFilter, setPageFilter] = useState("All");
  const [openBreakdown, setOpenBreakdown] = useState(null); // 'countries', 'pages', or 'dates'

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [logs, trueCounts] = await Promise.all([
          getVisitorStats(),
          getQuickMetrics(),
        ]);
        setStats(logs);
        setCounts(trueCounts);
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const insights = useMemo(() => {
    if (stats.length === 0)
      return {
        topCountry: "N/A",
        topPage: "N/A",
        topDate: "N/A",
        growth: 0,
        sortedCountries: [],
        sortedPages: [],
        sortedDates: [],
      };

    const countryMap = {};
    const pageMap = {};
    const dateMap = {};

    // Growth Logic
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentMonthVisits = 0;
    let lastMonthVisits = 0;

    stats.forEach((log) => {
      const dateOnly = log.timestamp.split(",")[0];
      countryMap[log.country] = (countryMap[log.country] || 0) + 1;
      pageMap[log.page] = (pageMap[log.page] || 0) + 1;
      dateMap[dateOnly] = (dateMap[dateOnly] || 0) + 1;

      const logDate = new Date(log.timestamp);
      if (
        logDate.getMonth() === currentMonth &&
        logDate.getFullYear() === currentYear
      ) {
        currentMonthVisits++;
      } else if (
        logDate.getMonth() === lastMonth &&
        logDate.getFullYear() === lastMonthYear
      ) {
        lastMonthVisits++;
      }
    });

    // Helper to sort maps by count
    const sortMap = (map) =>
      Object.entries(map)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }));

    const sortedCountries = sortMap(countryMap);
    const sortedPages = sortMap(pageMap);
    const sortedDates = sortMap(dateMap);

    let growth =
      lastMonthVisits > 0
        ? ((currentMonthVisits - lastMonthVisits) / lastMonthVisits) * 100
        : currentMonthVisits > 0
        ? 100
        : 0;

    return {
      topCountry: sortedCountries[0]?.name || "N/A",
      topPage: sortedPages[0]?.name || "N/A",
      pageCount: sortedPages[0]?.count || 0,
      topDate: sortedDates[0]?.name || "N/A",
      dateCount: sortedDates[0]?.count || 0,
      growth: growth.toFixed(1),
      sortedCountries,
      sortedPages,
      sortedDates,
    };
  }, [stats]);

  const filteredStats = stats.filter((log) => {
    const matchCountry =
      countryFilter === "All" || log.country === countryFilter;
    const matchPage = pageFilter === "All" || log.page === pageFilter;
    return matchCountry && matchPage;
  });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B46C1] mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Syncing Intelligence...
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 1. METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          label="Unique Sessions"
          value={counts.unique}
          icon={<Users className="opacity-20" />}
          color="bg-[#6B46C1]"
        />
        <MetricCard
          label="Total Hits"
          value={counts.total}
          icon={<MousePointerClick className="opacity-20" />}
          color="bg-slate-900"
          trend={insights.growth}
        />

        <MetricCard
          label="Top Country"
          value={insights.topCountry}
          icon={<Globe className="opacity-20" />}
          color="bg-[#FF8C38]"
          isExpandable
          onClick={() =>
            setOpenBreakdown(openBreakdown === "countries" ? null : "countries")
          }
        />

        <MetricCard
          label={`Top Page (${insights.pageCount})`}
          value={insights.topPage}
          icon={<Layout className="opacity-20" />}
          color="bg-indigo-900"
          isExpandable
          onClick={() =>
            setOpenBreakdown(openBreakdown === "pages" ? null : "pages")
          }
        />

        <MetricCard
          label={`Peak Date (${insights.dateCount})`}
          value={insights.topDate}
          icon={<Calendar className="opacity-20" />}
          color="bg-blue-900"
          isExpandable
          onClick={() =>
            setOpenBreakdown(openBreakdown === "dates" ? null : "dates")
          }
        />

        <MetricCard
          label="Active Regions"
          value={insights.sortedCountries.length}
          icon={<Globe className="opacity-20" />}
          color="bg-emerald-800"
        />
      </div>

      {/* 2. DROPDOWN BREAKDOWNS (Hidden until clicked) */}
      {openBreakdown && (
        <div className="bg-white border border-slate-100 shadow-xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Detailed Breakdown: {openBreakdown}
            </h4>
            <button
              onClick={() => setOpenBreakdown(null)}
              className="text-slate-400 hover:text-slate-900"
            >
              <FilterX size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(openBreakdown === "countries"
              ? insights.sortedCountries
              : openBreakdown === "pages"
              ? insights.sortedPages
              : insights.sortedDates
            ).map((item, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 border-l-2 border-[#6B46C1]"
              >
                <p
                  className="text-[10px] font-bold text-slate-500 truncate"
                  title={item.name}
                >
                  {item.name}
                </p>
                <p className="text-lg font-black italic text-slate-900">
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FILTER CONTROLS */}
      <div className="bg-white p-4 flex flex-col md:flex-row gap-4 md:items-center border border-slate-100 shadow-sm">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Filter Country:
          </span>
          <select
            className="text-xs font-bold border border-slate-200 bg-slate-50 p-2 rounded-md w-full md:w-48"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="All">All Nations</option>
            {insights.sortedCountries.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-auto">
          <span className="text-[10px] font-black uppercase text-slate-400">
            Filter Page:
          </span>
          <select
            className="text-xs font-bold border border-slate-200 bg-slate-50 p-2 rounded-md w-full md:w-48"
            value={pageFilter}
            onChange={(e) => setPageFilter(e.target.value)}
          >
            <option value="All">All Pages</option>
            {insights.sortedPages.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. TABLE */}
      <div className="p-4 md:p-8 bg-white border border-slate-100 shadow-xl overflow-x-auto">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-6">
          Traffic Stream
        </h2>
        <Table className="min-w-[600px]">
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
            {filteredStats.map((log) => (
              <TableRow
                key={log.id}
                className="hover:bg-slate-50 border-slate-50"
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
                  {log.city}, {log.country}
                </TableCell>
                <TableCell className="text-slate-400 text-[10px] max-w-[150px] truncate font-medium">
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

function MetricCard({
  label,
  value,
  icon,
  color,
  trend,
  isExpandable,
  onClick,
}) {
  const isPositive = trend >= 0;

  return (
    <div
      onClick={onClick}
      className={`p-4 md:p-6 ${color} text-white rounded-none shadow-xl flex justify-between items-center h-24 md:h-28 relative group ${
        isExpandable ? "cursor-pointer hover:brightness-110 transition-all" : ""
      }`}
    >
      <div className="max-w-[85%]">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] opacity-70 leading-tight">
            {label}
          </p>
          {trend !== undefined && (
            <span
              className={`text-[8px] font-black flex items-center gap-1 px-1.5 py-0.5 rounded-sm ${
                isPositive
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {isPositive ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <h3
          className="text-lg md:text-xl font-black italic tracking-tighter truncate"
          title={value} // Native HTML Tooltip on hover
        >
          {value}
        </h3>
        {isExpandable && (
          <div className="absolute bottom-2 right-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <ChevronDown size={12} />
          </div>
        )}
      </div>
      <div className="h-6 w-6 md:h-8 md:w-8 shrink-0">{icon}</div>
    </div>
  );
}
