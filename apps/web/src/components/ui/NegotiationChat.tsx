"use client";

import { useState, useRef, useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { Send, X, Truck, Wrench, IndianRupee, Zap, MessageSquare } from "lucide-react";
import { clsx } from "clsx";

interface NegotiationMessage {
  id: string;
  from: "buyer" | "seller" | "system";
  text: string;
  timestamp: number;
  meta?: {
    price?: number;
    action?: "offer" | "counter" | "accept" | "reject" | "info";
  };
}

export function NegotiationChat() {
  const { gameState, marketListings } = useGameStore();
  const [activeNegotiation, setActiveNegotiation] = useState<typeof marketListings[0] | null>(null);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMarket, setShowMarket] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startNegotiation = (listing: typeof marketListings[0]) => {
    setActiveNegotiation(listing);
    setIsMinimized(false);
    setMessages([
      {
        id: "sys-1",
        from: "system",
        text: `Negotiation started for ${listing.vehicle.specId}. Condition: ${listing.vehicle.condition}. Asking: ₹${listing.askingPrice.toLocaleString()}. ${listing.billType === "KACHHA" ? "⚠️ Kachha Bill (No GST)" : "✅ Pakka Bill (GST Included)"}`,
        timestamp: Date.now(),
        meta: { action: "info" },
      },
      {
        id: "seller-1",
        from: "seller",
        text: listing.sellerType === "AUCTION"
          ? "Auction reserve price. Minimum bid applies."
          : listing.sellerType === "BANK_RECOVERY"
          ? "Bank recovery vehicle. No negotiation on price. As-is condition."
          : "Slightly negotiable. Serious buyers only.",
        timestamp: Date.now() + 100,
        meta: { action: "info" },
      },
    ]);
    setInputValue("");
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !activeNegotiation) return;

    const isPriceOffer = /^\d+$/.test(inputValue.trim());
    const newMessage: NegotiationMessage = {
      id: `buyer-${Date.now()}`,
      from: "buyer",
      text: inputValue,
      timestamp: Date.now(),
      meta: isPriceOffer ? { price: parseInt(inputValue), action: "offer" } : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Simulate seller response
    setTimeout(() => {
      if (!activeNegotiation) return;
      const offerPrice = isPriceOffer ? parseInt(inputValue) : 0;
      let response: NegotiationMessage;

      if (isPriceOffer) {
        const minPrice = Math.round(activeNegotiation.askingPrice * 0.85);
        const maxPrice = activeNegotiation.askingPrice;

        if (offerPrice >= maxPrice) {
          response = {
            id: `seller-${Date.now()}`,
            from: "seller",
            text: `Deal! ₹${offerPrice.toLocaleString()} it is. ${activeNegotiation.billType === "KACHHA" ? "Cash only, no receipt." : "GST invoice will be issued."}`,
            timestamp: Date.now() + 500,
            meta: { price: offerPrice, action: "accept" },
          };
          // Complete transaction
          setTimeout(() => completePurchase(offerPrice), 1500);
        } else if (offerPrice >= minPrice) {
          const counter = Math.round((offerPrice + maxPrice) / 2);
          response = {
            id: `seller-${Date.now()}`,
            from: "seller",
            text: `₹${offerPrice.toLocaleString()} is too low. I can do ₹${counter.toLocaleString()}. Final offer.`,
            timestamp: Date.now() + 500,
            meta: { price: counter, action: "counter" },
          };
        } else {
          response = {
            id: `seller-${Date.now()}`,
            from: "seller",
            text: `₹${offerPrice.toLocaleString()}? Are you serious? Minimum is ₹${minPrice.toLocaleString()}. Don't waste my time.`,
            timestamp: Date.now() + 500,
            meta: { action: "reject" },
          };
        }
      } else {
        const responses = [
          "Condition is as described. Check photos.",
          "Cash payment preferred. Can arrange transport.",
          "RTO papers clear. NOC available for interstate.",
          "Engine runs smooth. No major accidents.",
          "Price is firm for this quality.",
        ];
        response = {
          id: `seller-${Date.now()}`,
          from: "seller",
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: Date.now() + 500,
          meta: { action: "info" },
        };
      }

      setMessages((prev) => [...prev, response]);
    }, 800 + Math.random() * 500);
  };

  const completePurchase = (price: number) => {
    if (!activeNegotiation) return;
    const { addCash, addTransaction, inventory, buyVehicle } = useGameStore.getState();

    const success = buyVehicle(activeNegotiation.vehicle, price, activeNegotiation.billType);
    if (success) {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          from: "system",
          text: `✅ Purchase complete! ${activeNegotiation.vehicle.specId} added to your yard. Paid ₹${price.toLocaleString()} (${activeNegotiation.billType}).`,
          timestamp: Date.now(),
          meta: { action: "info" },
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          from: "system",
          text: `❌ Purchase failed. Insufficient funds or yard full.`,
          timestamp: Date.now(),
          meta: { action: "info" },
        },
      ]);
    }

    setTimeout(() => {
      setActiveNegotiation(null);
      setIsMinimized(true);
    }, 3000);
  };

  const quickOffer = (percentage: number) => {
    if (!activeNegotiation) return;
    const offer = Math.round(activeNegotiation.askingPrice * percentage);
    setInputValue(offer.toString());
    sendMessage();
  };

  if (isMinimized && !activeNegotiation) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          onClick={() => setShowMarket(true)}
          className="desi-button flex items-center gap-2 px-6 py-3 shadow-xl"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Market / बाजार</span>
          <span className="bg-kabaad-600 text-white px-2 py-0.5 rounded-full text-xs font-mono">
            {marketListings.length}
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Market Listings Modal */}
      {showMarket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="desi-panel w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl text-loha-900">Vehicle Market / वाहन बाजार</h2>
              <button onClick={() => setShowMarket(false)} className="text-loha-500 hover:text-loha-700 text-2xl">×</button>
            </div>
            <div className="overflow-y-auto space-y-3 max-h-[60vh]">
              {marketListings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => { setShowMarket(false); startNegotiation(listing); }}
                  className="w-full text-left p-4 bg-white border border-kabaad-200 rounded-xl hover:border-kabaad-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-heading text-lg text-loha-900">{listing.vehicle.specId}</div>
                      <div className="text-sm text-kabaad-500 hindi-text flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${listing.condition === "GOOD" ? "bg-green-100 text-green-700" : listing.condition === "REPAIRABLE" ? "bg-yellow-100 text-yellow-700" : listing.condition === "DAMAGED" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                          {listing.vehicle.condition}
                        </span>
                        <span className="font-mono text-kabaad-600">{listing.vehicle.healthPercent}% Health</span>
                        <span className="font-mono text-blue-600">{listing.vehicle.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-heading text-xl font-bold text-kabaad-600">₹{listing.askingPrice.toLocaleString()}</div>
                      <div className={`text-xs px-2 py-0.5 rounded ${listing.billType === "KACHHA" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {listing.billType}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-kabaad-500">
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {listing.sellerType}</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> {listing.negotiable ? "Negotiable" : "Fixed Price"}</span>
                  </div>
                </button>
              ))}
              {marketListings.length === 0 && (
                <div className="text-center py-8 text-kabaad-500">No listings available. Check back tomorrow.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Negotiation Chat Window */}
      {activeNegotiation && (
        <div
          className={clsx(
            "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md pointer-events-auto transition-all duration-300",
            isMinimized ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
          )}
        >
          <div className="desi-panel flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: "50vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-kabaad-200 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kabaad-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-kabaad-600" />
                </div>
                <div>
                  <div className="font-heading text-loha-900">{activeNegotiation.vehicle.specId}</div>
                  <div className="text-xs text-kabaad-500 flex items-center gap-2">
                    <span className="font-mono">₹{activeNegotiation.askingPrice.toLocaleString()}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeNegotiation.billType === "KACHHA" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                      {activeNegotiation.billType}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setActiveNegotiation(null); setIsMinimized(true); }}
                className="text-loha-400 hover:text-loha-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: "35vh" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={clsx(
                    "flex gap-2 max-w-[85%] animate-slide-up",
                    msg.from === "buyer" && "justify-end",
                    msg.from === "seller" && "justify-start",
                    msg.from === "system" && "justify-center"
                  )}
                >
                  {msg.from !== "buyer" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      {msg.from === "seller" ? (
                        <Truck className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-kabaad-500" />
                      )}
                    </div>
                  )}

                  <div
                    className={clsx(
                      "px-4 py-2 rounded-2xl text-sm max-w-[75%]",
                      msg.from === "buyer" && "bg-kabaad-500 text-white rounded-tr-sm",
                      msg.from === "seller" && "bg-loha-100 text-loha-900 rounded-tl-sm",
                      msg.from === "system" && "bg-kabaad-100 text-kabaad-700 text-center px-3 py-1 text-xs italic"
                    )}
                  >
                    {msg.meta?.action === "offer" && msg.meta.price && (
                      <div className="font-mono text-lg mb-1">₹{msg.meta.price.toLocaleString()}</div>
                    )}
                    {msg.meta?.action === "counter" && msg.meta.price && (
                      <div className="font-mono text-lg mb-1 text-yellow-600">Counter: ₹{msg.meta.price.toLocaleString()}</div>
                    )}
                    {msg.meta?.action === "accept" && (
                      <div className="font-mono text-lg mb-1 text-green-600">✅ Accepted: ₹{msg.meta.price?.toLocaleString()}</div>
                    )}
                    {msg.meta?.action === "reject" && (
                      <div className="text-red-600 mb-1">❌ Rejected</div>
                    )}
                    <div>{msg.text}</div>
                    <div className="text-[10px] opacity-60 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {msg.from === "buyer" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-kabaad-500 text-white">
                      👤
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Offer Buttons */}
            <div className="border-t border-kabaad-200 pt-3 space-y-2">
              <div className="flex gap-2">
                {[0.7, 0.8, 0.85, 0.9].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => quickOffer(pct)}
                    className="flex-1 desi-button-secondary text-xs py-1"
                  >
                    {Math.round(pct * 100)}% = ₹{Math.round(activeNegotiation.askingPrice * pct).toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type offer (e.g. 45000) or message..."
                  className="flex-1 desi-input text-sm font-mono"
                  autoFocus
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="desi-button px-4"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Floating Button */}
      {isMinimized && activeNegotiation && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-bounce-in">
          <button
            onClick={() => setIsMinimized(false)}
            className="desi-button flex items-center gap-2 px-6 py-3 shadow-xl animate-pulse"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Negotiating: {activeNegotiation.vehicle.specId}</span>
          </button>
        </div>
      )}
    </>
  );
}