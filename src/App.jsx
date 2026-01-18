import React, { useState, useEffect } from "react";
import { Search, Twitter, Plus, X, Zap, Heart, Eye, MessageCircle, Clock, Users, Share2, Bell, AlertTriangle, Shield, Target, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

function SolanaTokenTracker() {
  const [tokens, setTokens] = useState([]);
  const [newToken, setNewToken] = useState({ name: "", address: "" });
  const [selectedToken, setSelectedToken] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("$Troll");
  const [activeTab, setActiveTab] = useState("overview");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(function() {
    loadTokens();
    const handleMouseMove = function(e) {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return function() {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const loadTokens = async function() {
    try {
      const stored = await window.storage.get("solana-tokens");
      if (stored && stored.value) {
        const loadedTokens = JSON.parse(stored.value);
        setTokens(loadedTokens);
        const trollToken = loadedTokens.find(function(t) { return t.name === "$Troll"; });
        if (trollToken) setSelectedToken(trollToken);
      } else {
        const demoToken = createDemoToken();
        await window.storage.set("solana-tokens", JSON.stringify([demoToken]));
        setTokens([demoToken]);
        setSelectedToken(demoToken);
      }
    } catch (error) {
      const demoToken = createDemoToken();
      setTokens([demoToken]);
      setSelectedToken(demoToken);
    }
  };

  const createDemoToken = function() {
    return {
      id: Date.now(),
      name: "$Troll",
      address: "TroLL8kMxDvK3qPnEYWh6cZ9fQr2yXbN4pU7mSoLaNa",
      mindshareData: generateMindshareData(),
      hourlyData: generateHourlyData(),
      competitors: [
        { name: "$Troll", mentions: 8432, sentiment: 78, growth: 34.7 },
        { name: "$BONK", mentions: 12567, sentiment: 72, growth: 12.3 },
        { name: "$WIF", mentions: 9821, sentiment: 81, growth: 28.4 },
        { name: "$PEPE", mentions: 15234, sentiment: 68, growth: -5.2 }
      ],
      alerts: [
        { id: 1, type: "viral", severity: "high", title: "Viral Potential", message: "Tweet velocity +340% in last hour", time: "12m" },
        { id: 2, type: "whale", severity: "medium", title: "Whale Activity", message: "Top 10 holder active on X", time: "1h" },
        { id: 3, type: "influencer", severity: "high", title: "New Influencer", message: "@CryptoKing (1.2M) first mention", time: "3h" }
      ],
      totalPosts: 8432,
      postsPerHour: 127,
      totalLikes: 156789,
      totalViews: 2847612,
      totalReplies: 12456,
      totalRetweets: 34521,
      uniqueAuthors: 4821,
      repeatPosters: 3247,
      loyaltyIndex: 87.3,
      botPercentage: 8.2,
      organicGrowth: 92.1,
      viralScore: 78,
      weeklyGrowth: 34.7,
      sentiment: 78.3,
      marketCap: 45782000,
      volume24h: 8920000
    };
  };

  const generateMindshareData = function() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map(function(day) {
      return {
        day: day,
        posts: Math.floor(Math.random() * 1500) + 800,
        likes: Math.floor(Math.random() * 25000) + 15000,
        views: Math.floor(Math.random() * 500000) + 300000
      };
    });
  };

  const generateHourlyData = function() {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({
        hour: i + ":00",
        posts: Math.floor(Math.random() * 200) + 50
      });
    }
    return hours;
  };

  const saveTokens = async function(updatedTokens) {
    try {
      await window.storage.set("solana-tokens", JSON.stringify(updatedTokens));
      setTokens(updatedTokens);
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  const addToken = function() {
    if (!newToken.name || !newToken.address) return;
    const token = Object.assign({}, createDemoToken(), { id: Date.now(), name: newToken.name, address: newToken.address });
    saveTokens([].concat(tokens, [token]));
    setNewToken({ name: "", address: "" });
    setShowAddForm(false);
  };

  const removeToken = function(id) {
    const updated = tokens.filter(function(t) { return t.id !== id; });
    saveTokens(updated);
    if (selectedToken && selectedToken.id === id) setSelectedToken(null);
  };

  const refreshData = function(tokenId) {
    const updated = tokens.map(function(t) {
      if (t.id === tokenId) {
        return Object.assign({}, t, { mindshareData: generateMindshareData(), hourlyData: generateHourlyData() });
      }
      return t;
    });
    saveTokens(updated);
    if (selectedToken && selectedToken.id === tokenId) {
      setSelectedToken(updated.find(function(t) { return t.id === tokenId; }));
    }
  };

  const filteredTokens = tokens.filter(function(t) {
    return t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.address.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 text-white overflow-hidden relative">
      <div className="fixed inset-0 bg-black opacity-40 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            SOLANA MINDSHARE TRACKER
          </h1>
          <p className="text-sm md:text-base text-cyan-300 font-semibold flex items-center justify-center gap-2">
            <Zap size={16} />
            Advanced X Analytics • Community Intelligence • Viral Detection
          </p>
        </div>

        <div className="mb-4 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={function(e) { setSearchTerm(e.target.value); }}
              className="w-full pl-10 pr-3 py-2 bg-purple-900 bg-opacity-40 border-2 border-purple-500 border-opacity-30 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
            />
          </div>
          <button
            onClick={function() { setShowAddForm(!showAddForm); }}
            className="px-4 md:px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            <span className="hidden md:inline">ADD</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-4 p-4 bg-purple-900 bg-opacity-40 border-2 border-purple-500 border-opacity-30 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Name (e.g., $PUMP)"
                value={newToken.name}
                onChange={function(e) { setNewToken(Object.assign({}, newToken, { name: e.target.value })); }}
                className="px-3 py-2 bg-black bg-opacity-50 border-2 border-purple-500 border-opacity-30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Contract Address"
                value={newToken.address}
                onChange={function(e) { setNewToken(Object.assign({}, newToken, { address: e.target.value })); }}
                className="px-3 py-2 bg-black bg-opacity-50 border-2 border-cyan-500 border-opacity-30 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addToken}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold"
              >
                Add
              </button>
              <button
                onClick={function() { setShowAddForm(false); }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {filteredTokens.map(function(token) {
            return (
              <div
                key={token.id}
                onClick={function() { setSelectedToken(token); }}
                className="p-4 bg-gradient-to-br from-purple-900 to-purple-800 bg-opacity-50 border-2 border-purple-500 border-opacity-20 hover:border-purple-500 hover:border-opacity-60 rounded-xl cursor-pointer transition-all"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="text-xl font-black bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    {token.name}
                  </h3>
                  <button
                    onClick={function(e) { e.stopPropagation(); removeToken(token.id); }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 font-mono mb-3 truncate">{token.address}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Flame size={12} className="text-orange-400" />
                      Viral
                    </span>
                    <span className="font-bold text-orange-400">{token.viralScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Shield size={12} className="text-green-400" />
                      Loyalty
                    </span>
                    <span className="font-bold text-green-400">{token.loyaltyIndex}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Heart size={12} />
                      Likes
                    </span>
                    <span className="font-bold text-pink-400">{(token.totalLikes / 1000).toFixed(1)}K</span>
                  </div>
                </div>
                <button
                  onClick={function(e) { e.stopPropagation(); refreshData(token.id); }}
                  className="mt-3 w-full py-1 bg-purple-600 bg-opacity-50 hover:bg-purple-600 rounded-lg text-sm font-bold"
                >
                  Refresh
                </button>
              </div>
            );
          })}
        </div>

        {selectedToken && (
          <div className="p-4 md:p-5 bg-purple-900 bg-opacity-40 border-2 border-purple-500 border-opacity-40 rounded-2xl">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  {selectedToken.name}
                </h2>
                <p className="text-xs text-gray-400 font-mono mb-2 break-all">{selectedToken.address}</p>
                <div className="flex gap-2 text-xs flex-wrap">
                  <span className="px-2 py-1 bg-purple-500 bg-opacity-20 border border-purple-500 border-opacity-40 rounded">
                    MCap: ${(selectedToken.marketCap / 1e6).toFixed(1)}M
                  </span>
                  <span className="px-2 py-1 bg-cyan-500 bg-opacity-20 border border-cyan-500 border-opacity-40 rounded">
                    Vol: ${(selectedToken.volume24h / 1e6).toFixed(1)}M
                  </span>
                  <span className="px-2 py-1 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-40 rounded">
                    +{selectedToken.weeklyGrowth}%
                  </span>
                </div>
              </div>
              <button
                onClick={function() { setSelectedToken(null); }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", colors: "from-purple-600 to-pink-600" },
                { id: "community", label: "Community", colors: "from-green-600 to-emerald-600" },
                { id: "competition", label: "Competition", colors: "from-orange-600 to-red-600" },
                { id: "alerts", label: "Alerts", colors: "from-yellow-600 to-orange-600" }
              ].map(function(tab) {
                return (
                  <button
                    key={tab.id}
                    onClick={function() { setActiveTab(tab.id); }}
                    className={
                      "px-4 py-2 rounded-lg font-semibold whitespace-nowrap " +
                      (activeTab === tab.id ? "bg-gradient-to-r " + tab.colors : "bg-black bg-opacity-30 text-gray-400")
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: Twitter, label: "Posts", value: selectedToken.totalPosts.toLocaleString() },
                    { icon: Heart, label: "Likes", value: selectedToken.totalLikes.toLocaleString() },
                    { icon: Eye, label: "Views", value: (selectedToken.totalViews / 1e6).toFixed(2) + "M" },
                    { icon: Clock, label: "Per Hour", value: selectedToken.postsPerHour }
                  ].map(function(item, i) {
                    return (
                      <div key={i} className="p-3 bg-black bg-opacity-40 border border-gray-700 rounded-xl">
                        <item.icon size={18} className="mb-1 text-blue-400" />
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-xl md:text-2xl font-black">{item.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-black bg-opacity-40 p-3 rounded-xl border border-purple-500 border-opacity-30">
                    <h3 className="font-bold mb-2 text-purple-300 text-sm">Weekly Activity</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={selectedToken.mindshareData}>
                        <defs>
                          <linearGradient id="cP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="day" stroke="#a78bfa" style={{ fontSize: "10px" }} />
                        <YAxis stroke="#a78bfa" style={{ fontSize: "10px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #8b5cf6",
                            borderRadius: "8px",
                            fontSize: "11px"
                          }}
                        />
                        <Area type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={2} fill="url(#cP)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-black bg-opacity-40 p-3 rounded-xl border border-cyan-500 border-opacity-30">
                    <h3 className="font-bold mb-2 text-cyan-300 text-sm">24h Hourly Posts</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={selectedToken.hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="hour" stroke="#22d3ee" style={{ fontSize: "8px" }} interval={3} />
                        <YAxis stroke="#22d3ee" style={{ fontSize: "10px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #06b6d4",
                            borderRadius: "8px",
                            fontSize: "11px"
                          }}
                        />
                        <Bar dataKey="posts" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "community" && (
              <div className="text-center py-8 text-gray-400">Community analytics coming soon...</div>
            )}

            {activeTab === "competition" && (
              <div className="space-y-3">
                {selectedToken.competitors.map(function(comp, i) {
                  return (
                    <div
                      key={i}
                      className={
                        comp.name === selectedToken.name
                          ? "p-3 rounded-lg border bg-purple-500 bg-opacity-20 border-purple-500 border-opacity-40"
                          : "p-3 rounded-lg border bg-black bg-opacity-30 border-gray-700"
                      }
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">{comp.name}</span>
                        <span className={comp.growth >= 0 ? "font-bold text-green-400" : "font-bold text-red-400"}>
                          {comp.growth >= 0 ? "↗" : "↘"} {comp.growth}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Mentions: </span>
                          <span className="font-semibold">{comp.mentions.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Sentiment: </span>
                          <span className="font-semibold text-blue-400">{comp.sentiment}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="space-y-3">
                {selectedToken.alerts.map(function(alert) {
                  return (
                    <div
                      key={alert.id}
                      className={
                        alert.severity === "high"
                          ? "p-4 rounded-xl border-2 bg-red-500 bg-opacity-10 border-red-500 border-opacity-40"
                          : "p-4 rounded-xl border-2 bg-yellow-500 bg-opacity-10 border-yellow-500 border-opacity-40"
                      }
                    >
                      <div className="flex items-start gap-3">
                        <Bell className={alert.severity === "high" ? "text-red-400" : "text-yellow-400"} size={20} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold">{alert.title}</h4>
                            <span className="text-xs text-gray-400">{alert.time}</span>
                          </div>
                          <p className="text-sm text-gray-300">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SolanaTokenTracker;
