import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Twitter, Plus, X, Zap, Activity, Heart, Eye, MessageCircle, Clock, Users, Share2, Bell, AlertTriangle, Shield, Target, Flame, GitCompare, Smile } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";

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
      emotionData: [
        { emotion: "Excitement", value: 45, color: "#14f195" },
        { emotion: "Trust", value: 32, color: "#06b6d4" },
        { emotion: "Fear", value: 8, color: "#ef4444" },
        { emotion: "Greed", value: 28, color: "#f59e0b" },
        { emotion: "Skepticism", value: 12, color: "#8b5cf6" }
      ],
      communityRadar: [
        { metric: "Loyalty", value: 87 },
        { metric: "Organic", value: 92 },
        { metric: "Engagement", value: 75 },
        { metric: "Influence", value: 68 },
        { metric: "Authenticity", value: 89 }
      ],
      loyaltyBreakdown: [
        { name: "Daily Posters", value: 42, color: "#14f195" },
        { name: "Weekly", value: 35, color: "#06b6d4" },
        { name: "One-time", value: 23, color: "#8b5cf6" }
      ],
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

  const floatingParticles = [];
  for (let i = 0; i < 30; i++) {
    floatingParticles.push(i);
  }

  return React.createElement("div", { className: "min-h-screen bg-black text-white overflow-hidden relative" },
    React.createElement("div", { className: "fixed inset-0 z-0" },
      React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" }),
      React.createElement("div", {
        className: "absolute inset-0 opacity-20",
        style: {
          backgroundImage: "linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite"
        }
      }),
      floatingParticles.map(function(i) {
        return React.createElement("div", {
          key: i,
          className: "absolute rounded-full",
          style: {
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            background: "radial-gradient(circle, " + (i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#06b6d4" : "#14f195") + ", transparent)",
            animation: "float " + (Math.random() * 10 + 10) + "s ease-in-out infinite",
            animationDelay: Math.random() * 5 + "s"
          }
        });
      }),
      React.createElement("div", {
        className: "absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-300",
        style: {
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)"
        }
      })
    ),
    React.createElement("div", { className: "relative z-10 max-w-7xl mx-auto p-6" },
      React.createElement("div", { className: "mb-6 text-center" },
        React.createElement("h1", { className: "text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent" }, "SOLANA MINDSHARE TRACKER"),
        React.createElement("p", { className: "text-cyan-300 font-semibold" },
          React.createElement(Zap, { className: "inline mr-1", size: 16 }),
          "Advanced X Analytics • Community Intelligence • Viral Detection"
        )
      ),
      React.createElement("div", { className: "mb-4 flex gap-3" },
        React.createElement("div", { className: "flex-1 relative" },
          React.createElement(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400", size: 18 }),
          React.createElement("input", {
            type: "text",
            placeholder: "Search tokens...",
            value: searchTerm,
            onChange: function(e) { setSearchTerm(e.target.value); },
            className: "w-full pl-10 pr-3 py-2 bg-purple-900/40 border-2 border-purple-500/30 rounded-xl focus:outline-none focus:border-purple-500 backdrop-blur-sm"
          })
        ),
        React.createElement("button", {
          onClick: function() { setShowAddForm(!showAddForm); },
          className: "px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105"
        },
          React.createElement(Plus, { size: 18 }),
          "ADD"
        )
      ),
      showAddForm && React.createElement("div", { className: "mb-4 p-4 bg-purple-900/40 border-2 border-purple-500/30 rounded-xl backdrop-blur-md" },
        React.createElement("div", { className: "grid grid-cols-2 gap-3 mb-3" },
          React.createElement("input", {
            type: "text",
            placeholder: "Name (e.g., $PUMP)",
            value: newToken.name,
            onChange: function(e) { setNewToken(Object.assign({}, newToken, { name: e.target.value })); },
            className: "px-3 py-2 bg-black/50 border-2 border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500"
          }),
          React.createElement("input", {
            type: "text",
            placeholder: "Contract Address",
            value: newToken.address,
            onChange: function(e) { setNewToken(Object.assign({}, newToken, { address: e.target.value })); },
            className: "px-3 py-2 bg-black/50 border-2 border-cyan-500/30 rounded-lg focus:outline-none focus:border-cyan-500"
          })
        ),
        React.createElement("div", { className: "flex gap-2" },
          React.createElement("button", {
            onClick: addToken,
            className: "px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold"
          }, "Add"),
          React.createElement("button", {
            onClick: function() { setShowAddForm(false); },
            className: "px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
          }, "Cancel")
        )
      ),
      React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 mb-4" },
        filteredTokens.map(function(token) {
          return React.createElement("div", {
            key: token.id,
            onClick: function() { setSelectedToken(token); },
            className: "p-4 bg-purple-900/30 border-2 border-purple-500/20 hover:border-purple-500/60 rounded-xl cursor-pointer transition-all transform hover:scale-105"
          },
            React.createElement("div", { className: "flex justify-between mb-2" },
              React.createElement("h3", { className: "text-xl font-black bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent" }, token.name),
              React.createElement("button", {
                onClick: function(e) { e.stopPropagation(); removeToken(token.id); },
                className: "text-red-400 hover:text-red-300"
              }, React.createElement(X, { size: 14 }))
            ),
            React.createElement("p", { className: "text-xs text-gray-400 font-mono mb-3 truncate" }, token.address),
            React.createElement("div", { className: "space-y-1 text-sm" },
              React.createElement("div", { className: "flex justify-between" },
                React.createElement("span", { className: "text-gray-400 flex items-center gap-1" },
                  React.createElement(Flame, { size: 12, className: "text-orange-400" }),
                  "Viral"
                ),
                React.createElement("span", { className: "font-bold text-orange-400" }, token.viralScore, "/100")
              ),
              React.createElement("div", { className: "flex justify-between" },
                React.createElement("span", { className: "text-gray-400 flex items-center gap-1" },
                  React.createElement(Shield, { size: 12, className: "text-green-400" }),
                  "Loyalty"
                ),
                React.createElement("span", { className: "font-bold text-green-400" }, token.loyaltyIndex, "%")
              ),
              React.createElement("div", { className: "flex justify-between" },
                React.createElement("span", { className: "text-gray-400 flex items-center gap-1" },
                  React.createElement(Heart, { size: 12 }),
                  "Likes"
                ),
                React.createElement("span", { className: "font-bold text-pink-400" }, (token.totalLikes / 1000).toFixed(1), "K")
              )
            ),
            React.createElement("button", {
              onClick: function(e) { e.stopPropagation(); refreshData(token.id); },
              className: "mt-3 w-full py-1 bg-purple-600/50 hover:bg-purple-600 rounded-lg text-sm font-bold"
            }, "Refresh")
          );
        })
      ),
      selectedToken && React.createElement("div", { className: "p-5 bg-purple-900/40 border-2 border-purple-500/40 rounded-2xl backdrop-blur-md" },
        React.createElement("div", { className: "flex justify-between mb-4" },
          React.createElement("div", null,
            React.createElement("h2", { className: "text-3xl font-black bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent" }, selectedToken.name),
            React.createElement("p", { className: "text-xs text-gray-400 font-mono mb-2" }, selectedToken.address),
            React.createElement("div", { className: "flex gap-2 text-xs" },
              React.createElement("span", { className: "px-2 py-1 bg-purple-500/20 border border-purple-500/40 rounded" }, "MCap: $", (selectedToken.marketCap / 1e6).toFixed(1), "M"),
              React.createElement("span", { className: "px-2 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded" }, "Vol: $", (selectedToken.volume24h / 1e6).toFixed(1), "M"),
              React.createElement("span", { className: "px-2 py-1 bg-green-500/20 border border-green-500/40 rounded" }, "+", selectedToken.weeklyGrowth, "%")
            )
          ),
          React.createElement("button", {
            onClick: function() { setSelectedToken(null); },
            className: "text-gray-400 hover:text-white"
          }, React.createElement(X, { size: 24 }))
        ),
        React.createElement("div", { className: "flex gap-2 mb-4 overflow-x-auto" },
          [
            { id: "overview", label: "Overview", colors: "from-purple-600 to-pink-600" },
            { id: "community", label: "Community", colors: "from-green-600 to-emerald-600" },
            { id: "competition", label: "Competition", colors: "from-orange-600 to-red-600" },
            { id: "alerts", label: "Alerts", colors: "from-yellow-600 to-orange-600" }
          ].map(function(tab) {
            return React.createElement("button", {
              key: tab.id,
              onClick: function() { setActiveTab(tab.id); },
              className: "px-4 py-2 rounded-lg font-semibold whitespace-nowrap " + (activeTab === tab.id ? "bg-gradient-to-r " + tab.colors : "bg-black/30 text-gray-400")
            }, tab.label);
          })
        ),
        activeTab === "overview" && React.createElement("div", { className: "space-y-4" },
          React.createElement("div", { className: "grid grid-cols-4 gap-3" },
            [
              { icon: Twitter, label: "Posts", value: selectedToken.totalPosts.toLocaleString() },
              { icon: Heart, label: "Likes", value: selectedToken.totalLikes.toLocaleString() },
              { icon: Eye, label: "Views", value: (selectedToken.totalViews / 1e6).toFixed(2) + "M" },
              { icon: Clock, label: "Per Hour", value: selectedToken.postsPerHour }
            ].map(function(item, i) {
              return React.createElement("div", {
                key: i,
                className: "p-3 bg-black/40 border border-gray-700 rounded-xl"
              },
                React.createElement(item.icon, { size: 18, className: "mb-1 text-blue-400" }),
                React.createElement("p", { className: "text-xs text-gray-400" }, item.label),
                React.createElement("p", { className: "text-2xl font-black" }, item.value)
              );
            })
          ),
          React.createElement("div", { className: "grid grid-cols-2 gap-3" },
            React.createElement("div", { className: "bg-black/40 p-3 rounded-xl border border-purple-500/30" },
              React.createElement("h3", { className: "font-bold mb-2 text-purple-300 text-sm" }, "Weekly Activity"),
              React.createElement(ResponsiveContainer, { width: "100%", height: 180 },
                React.createElement(AreaChart, { data: selectedToken.mindshareData },
                  React.createElement("defs", null,
                    React.createElement("linearGradient", { id: "cP", x1: "0", y1: "0", x2: "0", y2: "1" },
                      React.createElement("stop", { offset: "5%", stopColor: "#8b5cf6", stopOpacity: 0.8 }),
                      React.createElement("stop", { offset: "95%", stopColor: "#8b5cf6", stopOpacity: 0 })
                    )
                  ),
                  React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#ffffff10" }),
                  React.createElement(XAxis, { dataKey: "day", stroke: "#a78bfa", style: { fontSize: "10px" } }),
                  React.createElement(YAxis, { stroke: "#a78bfa", style: { fontSize: "10px" } }),
                  React.createElement(Tooltip, { contentStyle: { backgroundColor: "#000", border: "2px solid #8b5cf6", borderRadius: "8px", fontSize: "11px" } }),
                  React.createElement(Area, { type: "monotone", dataKey: "posts", stroke: "#8b5cf6", strokeWidth: 2, fill: "url(#cP)" })
                )
              )
            ),
            React.createElement("div", { className: "bg-black/40 p-3 rounded-xl border border-cyan-500/30" },
              React.createElement("h3", { className: "font-bold mb-2 text-cyan-300 text-sm" }, "24h Hourly Posts"),
              React.createElement(ResponsiveContainer, { width: "100%", height: 180 },
                React.createElement(BarChart, { data: selectedToken.hourlyData },
                  React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#ffffff10" }),
                  React.createElement(XAxis, { dataKey: "hour", stroke: "#22d3ee", style: { fontSize: "8px" }, interval: 3 }),
                  React.createElement(YAxis, { stroke: "#22d3ee", style: { fontSize: "10px" } }),
                  React.createElement(Tooltip, { contentStyle: { backgroundColor: "#000", border: "2px solid #06b6d4", borderRadius: "8px", fontSize: "11px" } }),
                  React.createElement(Bar, { dataKey: "posts", fill: "#06b6d4", radius: [4, 4, 0, 0] })
                )
              )
            )
          )
        ),
        activeTab === "community" && React.createElement("div", { className: "text-center py-8 text-gray-400" },
          "Community analytics coming soon..."
        ),
        activeTab === "competition" && React.createElement("div", { className: "space-y-3" },
          selectedToken.competitors.map(function(comp, i) {
            return React.createElement("div", {
              key: i,
              className: comp.name === selectedToken.name ? "p-3 rounded-lg border bg-purple-500/20 border-purple-500/40" : "p-3 rounded-lg border bg-black/30 border-gray-700"
            },
              React.createElement("div", { className: "flex justify-between items-center mb-2" },
                React.createElement("span", { className: "font-bold text-lg" }, comp.name),
                React.createElement("span", { className: comp.growth >= 0 ? "font-bold text-green-400" : "font-bold text-red-400" },
                  comp.growth >= 0 ? "↗" : "↘", " ", comp.growth, "%"
                )
              ),
              React.createElement("div", { className: "grid grid-cols-2 gap-2 text-sm" },
                React.createElement("div", null,
                  React.createElement("span", { className: "text-gray-400" }, "Mentions: "),
                  React.createElement("span", { className: "font-semibold" }, comp.mentions.toLocaleString())
                ),
                React.createElement("div", null,
                  React.createElement("span", { className: "text-gray-400" }, "Sentiment: "),
                  React.createElement("span", { className: "font-semibold text-blue-400" }, comp.sentiment, "%")
                )
              )
            );
          })
        ),
        activeTab === "alerts" && React.createElement("div", { className: "space-y-3" },
          selectedToken.alerts.map(function(alert) {
            return React.createElement("div", {
              key: alert.id,
              className: alert.severity === "high" ? "p-4 rounded-xl border-2 bg-red-500/10 border-red-500/40" : "p-4 rounded-xl border-2 bg-yellow-500/10 border-yellow-500/40"
            },
              React.createElement("div", { className: "flex items-start gap-3" },
                React.createElement(Bell, { className: alert.severity === "high" ? "text-red-400" : "text-yellow-400", size: 20 }),
                React.createElement("div", { className: "flex-1" },
                  React.createElement("div", { className: "flex justify-between items-start mb-1" },
                    React.createElement("h4", { className: "font-bold" }, alert.title),
                    React.createElement("span", { className: "text-xs text-gray-400" }, alert.time)
                  ),
                  React.createElement("p", { className: "text-sm text-gray-300" }, alert.message)
                )
              )
            );
          })
        )
      )
    ),
    React.createElement("style", null, "@keyframes float { 0%, 100% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(10px); } } @keyframes gridMove { 0% { transform: translateY(0); } 100% { transform: translateY(50px); } }")
  );
}

export default SolanaTokenTracker;
