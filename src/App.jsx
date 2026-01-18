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

  useEffect(function() {
    loadTokens();
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
        { id: 1, severity: "high", title: "Viral Potential", message: "Tweet velocity +340% in last hour", time: "12m" },
        { id: 2, severity: "medium", title: "Whale Activity", message: "Top 10 holder active on X", time: "1h" },
        { id: 3, severity: "high", title: "New Influencer", message: "@CryptoKing (1.2M) first mention", time: "3h" }
      ],
      totalPosts: 8432,
      postsPerHour: 127,
      totalLikes: 156789,
      totalViews: 2847612,
      totalReplies: 12456,
      totalRetweets: 34521,
      uniqueAuthors: 4821,
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
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function(day) {
      return {
        day: day,
        posts: Math.floor(Math.random() * 1500) + 800
      };
    });
  };

  const generateHourlyData = function() {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push({ hour: i + ":00", posts: Math.floor(Math.random() * 200) + 50 });
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #581c87, #000000, #164e63)",
      color: "white",
      overflow: "hidden",
      position: "relative"
    }}>
      <div style={{ position: "relative", zIndex: 10, maxWidth: "80rem", margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: "900",
            marginBottom: "0.5rem",
            background: "linear-gradient(to right, #c084fc, #f472b6, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            SOLANA MINDSHARE TRACKER
          </h1>
          <p style={{ color: "#67e8f9", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Zap size={16} />
            Advanced X Analytics • Community Intelligence • Viral Detection
          </p>
        </div>

        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.75rem" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#c084fc" }} size={18} />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={function(e) { setSearchTerm(e.target.value); }}
              style={{
                width: "100%",
                paddingLeft: "2.5rem",
                paddingRight: "0.75rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                background: "rgba(88, 28, 135, 0.4)",
                border: "2px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "0.75rem",
                outline: "none",
                color: "white"
              }}
            />
          </div>
          <button
            onClick={function() { setShowAddForm(!showAddForm); }}
            style={{
              padding: "0.5rem 1.25rem",
              background: "linear-gradient(to right, #10b981, #059669)",
              borderRadius: "0.75rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "none",
              cursor: "pointer",
              color: "white"
            }}
          >
            <Plus size={18} />
            ADD
          </button>
        </div>

        {showAddForm && (
          <div style={{
            marginBottom: "1rem",
            padding: "1rem",
            background: "rgba(88, 28, 135, 0.4)",
            border: "2px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "1rem"
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <input
                type="text"
                placeholder="Name (e.g., $PUMP)"
                value={newToken.name}
                onChange={function(e) { setNewToken(Object.assign({}, newToken, { name: e.target.value })); }}
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "2px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "0.5rem",
                  outline: "none",
                  color: "white"
                }}
              />
              <input
                type="text"
                placeholder="Contract Address"
                value={newToken.address}
                onChange={function(e) { setNewToken(Object.assign({}, newToken, { address: e.target.value })); }}
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "2px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "0.5rem",
                  outline: "none",
                  color: "white"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={addToken} style={{ padding: "0.5rem 1rem", background: "#7c3aed", borderRadius: "0.5rem", fontWeight: "700", border: "none", cursor: "pointer", color: "white" }}>
                Add
              </button>
              <button onClick={function() { setShowAddForm(false); }} style={{ padding: "0.5rem 1rem", background: "#374151", borderRadius: "0.5rem", fontWeight: "700", border: "none", cursor: "pointer", color: "white" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
          {filteredTokens.map(function(token) {
            return (
              <div
                key={token.id}
                onClick={function() { setSelectedToken(token); }}
                style={{
                  padding: "1rem",
                  background: "linear-gradient(to bottom right, rgba(88, 28, 135, 0.5), rgba(107, 33, 168, 0.5))",
                  border: "2px solid rgba(168, 85, 247, 0.2)",
                  borderRadius: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: "900",
                    background: "linear-gradient(to right, #d8b4fe, #67e8f9)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    {token.name}
                  </h3>
                  <button onClick={function(e) { e.stopPropagation(); removeToken(token.id); }} style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>
                    <X size={14} />
                  </button>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontFamily: "monospace", marginBottom: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {token.address}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Flame size={12} style={{ color: "#fb923c" }} />
                      Viral
                    </span>
                    <span style={{ fontWeight: "700", color: "#fb923c" }}>{token.viralScore}/100</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Shield size={12} style={{ color: "#4ade80" }} />
                      Loyalty
                    </span>
                    <span style={{ fontWeight: "700", color: "#4ade80" }}>{token.loyaltyIndex}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Heart size={12} />
                      Likes
                    </span>
                    <span style={{ fontWeight: "700", color: "#f472b6" }}>{(token.totalLikes / 1000).toFixed(1)}K</span>
                  </div>
                </div>
                <button
                  onClick={function(e) { e.stopPropagation(); refreshData(token.id); }}
                  style={{
                    marginTop: "0.75rem",
                    width: "100%",
                    padding: "0.25rem",
                    background: "rgba(124, 58, 237, 0.5)",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    border: "none",
                    cursor: "pointer",
                    color: "white"
                  }}
                >
                  Refresh
                </button>
              </div>
            );
          })}
        </div>

        {selectedToken && (
          <div style={{
            padding: "1.25rem",
            background: "rgba(88, 28, 135, 0.4)",
            border: "2px solid rgba(168, 85, 247, 0.4)",
            borderRadius: "1.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <h2 style={{
                  fontSize: "1.875rem",
                  fontWeight: "900",
                  background: "linear-gradient(to right, #d8b4fe, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  {selectedToken.name}
                </h2>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", fontFamily: "monospace", marginBottom: "0.5rem", wordBreak: "break-all" }}>
                  {selectedToken.address}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ padding: "0.25rem 0.5rem", background: "rgba(168, 85, 247, 0.2)", border: "1px solid rgba(168, 85, 247, 0.4)", borderRadius: "0.25rem" }}>
                    MCap: ${(selectedToken.marketCap / 1e6).toFixed(1)}M
                  </span>
                  <span style={{ padding: "0.25rem 0.5rem", background: "rgba(6, 182, 212, 0.2)", border: "1px solid rgba(6, 182, 212, 0.4)", borderRadius: "0.25rem" }}>
                    Vol: ${(selectedToken.volume24h / 1e6).toFixed(1)}M
                  </span>
                  <span style={{ padding: "0.25rem 0.5rem", background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "0.25rem" }}>
                    +{selectedToken.weeklyGrowth}%
                  </span>
                </div>
              </div>
              <button onClick={function() { setSelectedToken(null); }} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", overflowX: "auto" }}>
              {[
                { id: "overview", label: "Overview", bg: "linear-gradient(to right, #7c3aed, #db2777)" },
                { id: "competition", label: "Competition", bg: "linear-gradient(to right, #ea580c, #dc2626)" },
                { id: "alerts", label: "Alerts", bg: "linear-gradient(to right, #ca8a04, #ea580c)" }
              ].map(function(tab) {
                return (
                  <button
                    key={tab.id}
                    onClick={function() { setActiveTab(tab.id); }}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      background: activeTab === tab.id ? tab.bg : "rgba(0, 0, 0, 0.3)",
                      border: "none",
                      cursor: "pointer",
                      color: activeTab === tab.id ? "white" : "#9ca3af"
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "overview" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                  {[
                    { icon: Twitter, label: "Posts", value: selectedToken.totalPosts.toLocaleString() },
                    { icon: Heart, label: "Likes", value: selectedToken.totalLikes.toLocaleString() },
                    { icon: Eye, label: "Views", value: (selectedToken.totalViews / 1e6).toFixed(2) + "M" },
                    { icon: Clock, label: "Per Hour", value: selectedToken.postsPerHour }
                  ].map(function(item, i) {
                    return (
                      <div key={i} style={{ padding: "0.75rem", background: "rgba(0, 0, 0, 0.4)", border: "1px solid #374151", borderRadius: "0.75rem" }}>
                        <item.icon size={18} style={{ marginBottom: "0.25rem", color: "#60a5fa" }} />
                        <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{item.label}</p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "900" }}>{item.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.75rem" }}>
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
                    <h3 style={{ fontWeight: "700", marginBottom: "0.5rem", color: "#c084fc", fontSize: "0.875rem" }}>Weekly Activity</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={selectedToken.mindshareData}>
                        <defs>
                          <linearGradient id="cP" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="#a78bfa" style={{ fontSize: "10px" }} />
                        <YAxis stroke="#a78bfa" style={{ fontSize: "10px" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#000", border: "2px solid #8b5cf6", borderRadius: "8px" }} />
                        <Area type="monotone" dataKey="posts" stroke="#8b5cf6" strokeWidth={2} fill="url(#cP)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: "0.75rem", borderRadius: "0.75rem", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                    <h3 style={{ fontWeight: "700", marginBottom: "0.5rem", color: "#22d3ee", fontSize: "0.875rem" }}>24h Hourly Posts</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={selectedToken.hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="hour" stroke="#22d3ee" style={{ fontSize: "8px" }} interval={3} />
                        <YAxis stroke="#22d3ee" style={{ fontSize: "10px" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#000", border: "2px solid #06b6d4", borderRadius: "8px" }} />
                        <Bar dataKey="posts" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "competition" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {selectedToken.competitors.map(function(comp, i) {
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "1px solid " + (comp.name === selectedToken.name ? "rgba(168, 85, 247, 0.4)" : "#374151"),
                        background: comp.name === selectedToken.name ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 0, 0, 0.3)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: "700", fontSize: "1.125rem" }}>{comp.name}</span>
                        <span style={{ fontWeight: "700", color: comp.growth >= 0 ? "#4ade80" : "#f87171" }}>
                          {comp.growth >= 0 ? "↗" : "↘"} {comp.growth}%
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.875rem" }}>
                        <div>
                          <span style={{ color: "#9ca3af" }}>Mentions: </span>
                          <span style={{ fontWeight: "600" }}>{comp.mentions.toLocaleString()}</span>
                        </div>
                        <div>
                          <span style={{ color: "#9ca3af" }}>Sentiment: </span>
                          <span style={{ fontWeight: "600", color: "#60a5fa" }}>{comp.sentiment}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "alerts" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {selectedToken.alerts.map(function(alert) {
                  return (
                    <div
                      key={alert.id}
                      style={{
                        padding: "1rem",
                        borderRadius: "0.75rem",
                        border: "2px solid " + (alert.severity === "high" ? "rgba(239, 68, 68, 0.4)" : "rgba(234, 179, 8, 0.4)"),
                        background: alert.severity === "high" ? "rgba(239, 68, 68, 0.1)" : "rgba(234, 179, 8, 0.1)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                        <Bell size={20} style={{ color: alert.severity === "high" ? "#f87171" : "#fbbf24" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                            <h4 style={{ fontWeight: "700" }}>{alert.title}</h4>
                            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{alert.time}</span>
                          </div>
                          <p style={{ fontSize: "0.875rem", color: "#d1d5db" }}>{alert.message}</p>
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
