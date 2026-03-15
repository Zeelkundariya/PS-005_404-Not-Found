import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area 
} from 'recharts';
import { 
  Clock, Play, Pause, AlertCircle, CheckCircle2, 
  Settings, Plus, Filter, Download, MoreVertical,
  Cpu, Users, Zap, TrendingUp, Calendar, LayoutDashboard, Activity, Wifi
} from 'lucide-react';

const SchedulerDashboard = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeTab, setActiveTab] = useState('gantt');
  const [liveData, setLiveData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('--:--:--');
  const [pulse, setPulse] = useState(false);

  // Fetch live data from IoT simulator
  const fetchLiveData = useCallback(async () => {
    try {
      const { data } = await api.get('/iot/live');
      setLiveData(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setPulse(p => !p);
    } catch (err) {
      console.error('Scheduler live data error:', err);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const id = setInterval(fetchLiveData, 2500);
    return () => clearInterval(id);
  }, [fetchLiveData]);

  const sch = liveData?.scheduler;
  const machineData = sch?.machines ?? [
    { id: 'M1', name: 'Loom #01 (Jacquard)',    status: 'Running',     health: 95, color: '#3b82f6', load: 85 },
    { id: 'M2', name: 'Loom #04 (Dobby)',        status: 'Maintenance', health: 42, color: '#f59e0b', load: 0  },
    { id: 'M3', name: 'Stenter #01 (Finishing)', status: 'Running',     health: 88, color: '#10b981', load: 92 },
    { id: 'M4', name: 'Dyeing Jar #02',          status: 'Idle',        health: 99, color: '#8b5cf6', load: 15 },
    { id: 'M5', name: 'Inspection #03',          status: 'Running',     health: 91, color: '#ec4899', load: 60 },
  ];

  const [schedule] = useState([
    { id: 'J101', job: 'Premium Denim',  task: 'Warping',   machineId: 'M1', start: 0, duration: 4, color: '#3b82f6' },
    { id: 'J101', job: 'Premium Denim',  task: 'Sizing',    machineId: 'M2', start: 4, duration: 3, color: '#3b82f6' },
    { id: 'J102', job: 'Cotton Twill',   task: 'Weaving',   machineId: 'M1', start: 4, duration: 6, color: '#10b981' },
    { id: 'J103', job: 'Silk Blend',     task: 'Dyeing',    machineId: 'M4', start: 2, duration: 5, color: '#f59e0b' },
    { id: 'J104', job: 'Polyester Tech', task: 'Finishing', machineId: 'M3', start: 0, duration: 8, color: '#8b5cf6' },
    { id: 'J105', job: 'Linen Batch',    task: 'QC Scan',   machineId: 'M5', start: 6, duration: 2, color: '#ec4899' },
  ]);

  const stats = [
    { label: 'Overall Unit Utilization', value: `${sch?.unitUtilization ?? 88.4}%`,     trend: '+4.2%', icon: <Zap size={18} /> },
    { label: 'Current Makespan',          value: `${sch?.makespan ?? 14.2}h`,             trend: '-1.5h', icon: <Clock size={18} /> },
    { label: 'Energy Efficiency',         value: `${sch?.energyEfficiency ?? 92}%`,       trend: '+0.8%', icon: <TrendingUp size={18} /> },
    { label: 'Active Operators',          value: `${sch?.activeOperators ?? 24}/30`,      trend: 'Stable', icon: <Users size={18} /> },
  ];

  const effTrend = sch?.efficiencyTrend ?? [
    { time: '0H', efficiency: 85 }, { time: '4H', efficiency: 88 },
    { time: '8H', efficiency: 82 }, { time: '12H', efficiency: 94 },
    { time: '16H', efficiency: 91 }, { time: '20H', efficiency: 89 },
    { time: '24H', efficiency: 95 },
  ];

  const logFeed = sch?.logs?.length ? sch.logs : [
    { time: '14:22:10', msg: 'Neural Sync: Loom #01 rotation adjusted (+2% throughput)', type: 'success' },
    { time: '14:15:44', msg: 'Grid Alert: Peak load detected. Throttling Inspection #03.', type: 'alert' },
    { time: '13:50:02', msg: 'Job J102 Weaving Phase 02 Initiated.', type: 'info' },
    { time: '13:30:11', msg: 'Scheduler: GAN Redefining makespan (14.2h baseline).', type: 'info' },
  ];

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 font-sans p-6">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="p-2 bg-blue-600 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Calendar size={28} />
            </span>
            Production Orchestrator <span className="text-blue-500 font-normal">v4.0</span>
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Cluster: Bhilwara Textile Core
            <span className="ml-4 text-xs text-slate-600 flex items-center gap-1">
              <Wifi size={10} className="text-emerald-500" /> Updated: {lastUpdated}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 flex items-center gap-2 transition-all shadow-lg active:scale-95 text-sm font-bold">
            <Download size={16} /> EXPORT
          </button>
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className={`px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center gap-2 transition-all active:scale-95 font-black text-sm uppercase tracking-wider ${isOptimizing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                AI OPTIMIZING...
              </>
            ) : (
              <>
                <Zap size={16} fill="currentColor" /> RUN GAN OPTIMIZER
              </>
            )}
          </button>
        </div>
      </header>

      {/* KPI Section — LIVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl shadow-xl hover:border-blue-500/30 transition-all group overflow-hidden relative">
            <div className="absolute top-2 right-2">
              <span className="text-[8px] font-black text-emerald-500 flex items-center gap-1 opacity-70">
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${pulse ? 'opacity-100' : 'opacity-30'} transition-opacity`}></span>
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-white transition-all duration-500">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Machine Status (LIVE) + Job Queue */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Machine Status Panel — LIVE */}
          <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2 truncate">
                <Cpu size={20} className="text-blue-500" /> RESOURCE CLUSTER
              </h2>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold tracking-tighter flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse`}></span>
                LIVE
              </span>
            </div>
            <div className="space-y-4">
              {machineData.map(m => (
                <div key={m.id} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${m.status === 'Running' ? 'bg-emerald-500 animate-pulse' : m.status === 'Maintenance' ? 'bg-orange-500' : 'bg-slate-500'}`}></div>
                      {m.name}
                    </span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 px-2 py-0.5 bg-slate-800 rounded">{m.status}</span>
                  </div>
                  <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full transition-all duration-1000"
                      style={{ 
                        width: `${m.load}%`, 
                        backgroundColor: m.status === 'Running' ? m.color : '#475569',
                        boxShadow: `0 0 10px ${m.color}66`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Utilization: {m.load}%</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Health: {m.health}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Job Queue Management */}
          <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-lg font-black text-white flex items-center gap-2 truncate">
                <LayoutDashboard size={20} className="text-blue-500" /> JOB BACKLOG
              </h2>
              <button className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-lg transition-all">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {[
                { id: 'J202', name: 'Silk Saris B-04',  priority: 'High', time: '12h' },
                { id: 'J203', name: 'Uniform Twill',     priority: 'Med',  time: '8h'  },
                { id: 'J204', name: 'Poly-Blend X-2',    priority: 'Low',  time: '5h'  },
                { id: 'J205', name: 'Denim Indigo',      priority: 'High', time: '14h' },
                { id: 'J206', name: 'Cotton Rugs',       priority: 'Med',  time: '10h' },
              ].map(job => (
                <div key={job.id} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-slate-500 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{job.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{job.id}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                      job.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                      job.priority === 'Med' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {job.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Clock size={10} /> {job.time}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 bg-slate-700 rounded transition-all">
                      <Play size={10} fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Gantt Chart & LIVE Analytics */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Gantt Chart Container */}
          <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-[500px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-transparent"></div>
            
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <TrendingUp size={24} className="text-blue-500" /> PRODUCTION TIMELINE
                </h2>
                <div className="hidden sm:flex bg-slate-800/80 p-1 rounded-xl gap-1 border border-slate-700">
                  {['gantt', 'workload'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`px-4 py-1 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-slate-500 uppercase mr-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Job A</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Job B</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Job C</div>
                </div>
                <button className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all text-slate-400 hover:text-white">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar relative">
              <div className="min-w-[800px] h-full flex flex-col">
                {/* Time Axis */}
                <div className="flex border-b border-slate-800 pb-4 mb-4">
                  <div className="w-48 shrink-0"></div>
                  <div className="flex-1 flex justify-between px-2">
                    {Array.from({ length: 13 }).map((_, i) => (
                      <div key={i} className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {i === 0 ? 'Start' : `${i * 2}H`}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid Rows */}
                <div className="flex-1 space-y-2 relative">
                  <div className="absolute inset-0 flex justify-between pointer-events-none px-2 z-0">
                    <div className="w-48 shrink-0"></div>
                    {Array.from({ length: 13 }).map((_, i) => (
                      <div key={i} className="w-[1px] h-full bg-slate-800/50 dashed"></div>
                    ))}
                  </div>

                  {machineData.map(m => (
                    <div key={m.id} className="flex items-center group relative z-10 transition-transform active:scale-[0.99] cursor-pointer">
                      <div className="w-48 shrink-0 pr-4">
                        <div className="text-sm font-black text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-widest">{m.name.split(' (')[0]}</div>
                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{m.id} // LOAD: {m.load}%</div>
                      </div>
                      <div className="flex-1 h-12 bg-slate-800/20 rounded-2xl relative border border-slate-800/40 group-hover:bg-slate-800/40 transition-colors">
                        {schedule.filter(s => s.machineId === m.id).map((task, idx) => (
                          <div
                            key={idx}
                            style={{ 
                              left: `${(task.start / 24) * 100}%`,
                              width: `${(task.duration / 24) * 100}%`,
                              backgroundColor: isOptimizing ? 'transparent' : task.color + '33',
                              borderLeft: `3px solid ${task.color}`,
                              boxShadow: `0 8px 20px ${task.color}11`
                            }}
                            className={`absolute top-2 bottom-2 rounded-lg flex items-center justify-center overflow-hidden group/task transition-all hover:z-20 hover:scale-y-110 ${isOptimizing ? 'animate-pulse bg-blue-500/10' : ''}`}
                          >
                            {!isOptimizing && (
                              <div className="px-3 truncate w-full flex items-center justify-between">
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{task.job}</span>
                                <span className="text-[10px] font-black text-white/50">{task.duration}h</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/task:opacity-10 transition-opacity"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Time Indicator */}
            <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 'calc(192px + 20%)', width: '2px', background: 'linear-gradient(to bottom, transparent, #3b82f6, transparent)', boxShadow: '0 0 10px #3b82f6' }}>
              <div className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded absolute -top-1 -translate-x-1/2 uppercase tracking-widest">Live</div>
            </div>
          </section>

          {/* Efficiency & Diagnostics Section — LIVE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-lg font-black text-white flex items-center gap-2 mb-2 uppercase tracking-widest">
                <AlertCircle size={20} className="text-blue-500" /> Neural Impact Analysis
              </h2>
              <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-widest font-bold flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity`}></span>
                Live Efficiency Stream
              </p>
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={effTrend}>
                    <defs>
                      <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} domain={[70, 100]} />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="efficiency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEff)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed font-bold uppercase tracking-tighter">
                AI Inference: Peak efficiency at <span className="text-white">{effTrend.reduce((a,b) => a.efficiency > b.efficiency ? a : b).time}</span> — synchronized cooling active.
              </p>
            </section>

            {/* Live Event Log */}
            <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-lg font-black text-white flex items-center gap-2 mb-6 uppercase tracking-widest">
                <CheckCircle2 size={20} className="text-blue-500" /> Optimization Event Log
              </h2>
              <div className="space-y-3 overflow-y-auto max-h-[180px] pr-2 custom-scrollbar">
                {logFeed.map((log, i) => (
                  <div key={i} className={`flex gap-3 text-[10px] border-l-2 pl-3 py-1 group transition-colors ${log.type === 'success' ? 'border-emerald-500/40' : log.type === 'alert' ? 'border-orange-500/40' : 'border-slate-700'}`}>
                    <span className="text-slate-600 font-black tracking-tighter shrink-0">{log.time}</span>
                    <span className={`font-bold ${log.type === 'success' ? 'text-emerald-400' : log.type === 'alert' ? 'text-orange-400' : 'text-slate-400'}`}>{log.msg}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">VIEW FULL DIAGNOSTIC REPORT</button>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
        .dashed { background-image: linear-gradient(to bottom, #334155 50%, transparent 50%); background-size: 1px 10px; background-repeat: repeat-y; }
      `}</style>
    </div>
  );
};

export default SchedulerDashboard;
