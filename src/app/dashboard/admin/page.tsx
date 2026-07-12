"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, ShoppingBag, TrendingUp } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getDashboard } from "@/lib/api/dashboard";

interface MetricData {
  value: string;
  change: string;
}

interface ChartItem {
  date: string;
  revenue: number;
  bookings: number;
}

interface DashboardData {
  totalUsers: MetricData;
  totalRevenue: MetricData;
  totalBookings: MetricData;
  chartData: ChartItem[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();
        setData(response as DashboardData);
        setError(null);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#c8f542] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center text-red-600 border border-red-200">
        <p className="font-semibold">{error || "No data found."}</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: data.totalRevenue?.value.replace("৳", "$") || "$0",
      change: data.totalRevenue.change,
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Total Bookings",
      value: data.totalBookings.value,
      change: data.totalBookings.change,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Active Users",
      value: data.totalUsers.value,
      change: data.totalUsers.change,
      icon: Users,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto bg-[#0a0a0a] text-white selection:bg-[#c8f542] selection:text-black min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">
            Dashboard <span className="text-[#c8f542]">Overview</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            Real-time database analytics and live booking sync status.
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6 shadow-xl transition hover:border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-[#c8f542]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {card.value}
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-[#c8f542] bg-[#c8f542]/5 w-fit px-2 py-0.5 rounded border border-[#c8f542]/10">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{card.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between border-b border-neutral-900 pb-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-200">
              Revenue Analytics
            </h2>
            <p className="text-sm text-neutral-500">
              Daily breakdown of platform income trajectories.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-[#c8f542]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c8f542] animate-pulse" />
              <span>Revenue ($)</span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-80 w-full min-h-80 text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data?.chartData || []}
              margin={{ top: 20, right: 20, left: -10, bottom: 15 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#171717"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#525252", fontWeight: "600" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#525252", fontWeight: "600" }}
                tickFormatter={(value) => `$${value}`}
                dx={-5}
              />
              <Tooltip
                contentStyle={{
                  background: "#050505",
                  border: "1px solid #262626",
                  borderRadius: "12px",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                itemStyle={{ color: "#c8f542" }}
                labelStyle={{ color: "#a3a3a3", marginBottom: "4px" }}
                formatter={(value) => {
                  if (value === undefined || value === null)
                    return ["$0", "Revenue"];
                  const numericValue = Number(value);
                  return [`$${numericValue.toLocaleString()}`, "Revenue"];
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c8f542"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, stroke: "#050505", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
