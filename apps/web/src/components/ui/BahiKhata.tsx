"use client";

import { useGameStore } from "@/store/gameStore";
import { BookOpen, Coin, TrendingUp, TrendingDown, Filter, Download, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";
import { clsx } from "clsx";

export function BahiKhata() {
  const { gameState, transactionHistory } = useGameStore();
  const [filter, setFilter] = useState<"all" | "income" | "expense" | "kachha" | "pakka">("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactionHistory
      .filter((tx) => {
        if (filter === "income") return tx.amount > 0;
        if (filter === "expense") return tx.amount < 0;
        if (filter === "kachha") return tx.billType === "KACHHA";
        if (filter === "pakka") return tx.billType === "PAKKA";
        return true;
      })
      .filter((tx) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
          tx.type.toLowerCase().includes(s) ||
          tx.counterparty?.toLowerCase().includes(s) ||
          tx.notes?.toLowerCase().includes(s)
        );
      })
      .slice(-50) // Show last 50
      .reverse(); // Newest first
  }, [transactionHistory, filter, search]);

  const totals = useMemo(() => {
    const income = transactionHistory.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expense = transactionHistory.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
    const kachhaIncome = transactionHistory.filter((t) => t.amount > 0 && t.billType === "KACHHA").reduce((sum, t) => sum + t.amount, 0);
    const pakkaIncome = transactionHistory.filter((t) => t.amount > 0 && t.billType === "PAKKA").reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income + expense, kachhaIncome, pakkaIncome };
  }, [transactionHistory]);

  return (
    <div className="desi-panel w-80 max-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-kabaad-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-kabaad-500" />
          <span className="font-heading text-lg text-loha-900">बही खाता</span>
          <span className="text-xs text-kabaad-500">Bahi Khata</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 text-loha-400 hover:text-loha-600" title="Export CSV">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1 text-loha-400 hover:text-loha-600" title="Refresh">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-xs text-green-700 uppercase tracking-wide">Income</div>
          <div className="font-heading font-bold text-green-600 font-mono text-lg">₹{totals.income.toLocaleString()}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-xs text-red-700 uppercase tracking-wide">Expense</div>
          <div className="font-heading font-bold text-red-600 font-mono text-lg">₹{Math.abs(totals.expense).toLocaleString()}</div>
        </div>
        <div className={clsx("rounded-lg p-3 text-center", totals.net >= 0 ? "bg-blue-50 border border-blue-200" : "bg-red-50 border border-red-200")}>
          <div className="text-xs text-loha-500 uppercase tracking-wide">Net</div>
          <div className={clsx("font-heading font-bold font-mono text-lg", totals.net >= 0 ? "text-blue-600" : "text-red-600")}>
            {totals.net >= 0 ? "+" : ""}₹{totals.net.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Kachha/Pakka Split */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-2 bg-kabaad-50 rounded-lg">
        <div className="text-center">
          <div className="text-xs text-orange-700 uppercase tracking-wide">कच्चा / Kachha</div>
          <div className="font-mono font-bold text-orange-600">₹{totals.kachhaIncome.toLocaleString()}</div>
          <div className="text-[10px] text-kabaad-500">
            {totals.income > 0 ? Math.round((totals.kachhaIncome / totals.income) * 100) : 0}% of income
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-green-700 uppercase tracking-wide">पक्का / Pakka</div>
          <div className="font-mono font-bold text-green-600">₹{totals.pakkaIncome.toLocaleString()}</div>
          <div className="text-[10px] text-kabaad-500">
            {totals.income > 0 ? Math.round((totals.pakkaIncome / totals.income) * 100) : 0}% of income
          </div>
        </div>
      </div>

      {/* Raid Risk Indicator */}
      <div className={clsx("mb-4 p-3 rounded-lg text-center text-sm", gameState.player.raidRiskMeter > 60 ? "bg-red-50 border border-red-200" : gameState.player.raidRiskMeter > 30 ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200")}>
        <div className="flex items-center justify-center gap-2">
          <span className={clsx("font-bold", gameState.player.raidRiskMeter > 60 ? "text-red-700" : gameState.player.raidRiskMeter > 30 ? "text-yellow-700" : "text-green-700")}>
            ⚠️ IT RAID RISK: {gameState.player.raidRiskMeter.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-2 bg-kabaad-200 rounded-full mt-2 overflow-hidden">
          <div
            className={clsx("h-full rounded-full transition-all duration-500", gameState.player.raidRiskMeter > 60 ? "bg-red-500" : gameState.player.raidRiskMeter > 30 ? "bg-yellow-500" : "bg-green-500")}
            style={{ width: `${gameState.player.raidRiskMeter}%` }}
          />
        </div>
        <div className="text-[10px] text-kabaad-500 mt-1">
          Kachha Ratio: {(gameState.player.kachhaRatio * 100).toFixed(1)}% | Threshold: 40%
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 mb-3">
        {["all", "income", "expense", "kachha", "pakka"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-2 py-1 text-xs rounded-full transition-colors",
              filter === f ? "bg-kabaad-500 text-white" : "bg-kabaad-100 text-loha-700 hover:bg-kabaad-200"
            )}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kabaad-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-kabaad-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kabaad-500"
        />
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-kabaad-400 py-8 text-sm">No transactions found</div>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-kabaad-200 flex flex-wrap gap-4 text-[10px] text-kabaad-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500" /> Income</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500" /> Expense</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500" /> Kachha</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Pakka</span>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: any }) {
  const isIncome = tx.amount > 0;
  const typeIcons: Record<string, any> = {
    BUY_VEHICLE: "🚗",
    SELL_VEHICLE: "💰",
    SELL_PART: "🔧",
    SELL_SCRAP: "♻️",
    REPAIR: "🔨",
    UPGRADE: "⬆️",
    LOAN_PAYMENT: "🏦",
    STAFF_SALARY: "👥",
    BRIBE: "💸",
    FINE: "🚨",
    BONUS: "🎁",
    DISMANTLE: "⚙️",
  };

  return (
    <div className="group px-2 py-1.5 hover:bg-kabaad-50 rounded-lg transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-base">{typeIcons[tx.type] || "📝"}</span>
          <div className="min-w-0">
            <div className="font-mono text-xs text-loha-900 truncate">{tx.type.replace(/_/g, " ")}</div>
            {tx.counterparty && (
              <div className="text-[10px] text-kabaad-500 truncate">{tx.counterparty}</div>
            )}
            {tx.notes && (
              <div className="text-[10px] text-kabaad-400 truncate italic">{tx.notes}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right min-w-[80px]">
          <span
            className={clsx(
              "font-mono font-bold text-xs",
              isIncome ? "text-green-600" : "text-red-600"
            )}
          >
            {isIncome ? "+" : ""}₹{Math.abs(tx.amount).toLocaleString()}
          </span>
          {tx.billType && (
            <span
              className={clsx(
                "px-1.5 py-0.5 rounded text-[9px] font-medium",
                tx.billType === "KACHHA" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
              )}
            >
              {tx.billType}
            </span>
          )}
          <span className="text-[9px] text-kabaad-400">
            Day {tx.day}
          </span>
        </div>
      </div>
    </div>
  );
}

const FILTER_LABELS: Record<string, string> = {
  all: "All",
  income: "Income",
  expense: "Expense",
  kachha: "कच्चा",
  pakka: "पक्का",
};