import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Zap, Clock, Activity, Users, Cpu, Trash2, 
  Download, RefreshCw, Layout, BrainCircuit, List,
  TrendingUp, ShieldCheck, Plus, Settings, X, Search
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const FYPOptimizer = () => {
  const [jobs, setJobs] = useState([]);
  const [machines, setMachines] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stats, setStats] = useState({ makespan: 0, utilization: {} });
  const [viewMode, setViewMode] = useState('gantt'); 
  const [showAddModal, setShowAddModal] = useState(null); // 'job' or 'machine'
  const [optLogs, setOptLogs] = useState([
    { id: 1, time: '14:23:10', msg: 'Neural Sync: Loom #01 rotation adjusted (+7% throughput)', type: 'INFO' },
    { id: 2, time: '14:17:44', msg: 'Grid Alert: Peak load detected. Throttling Inspection #03.', type: 'WARNING' },
    { id: 3, time: '13:52:02', msg: 'Job J-103 Weaving Phase-02 initiated.', type: 'INFO' },
    { id: 4, time: '13:30:11', msg: 'Scheduler: GA Node finding makespan < 14.5h (Iteration 72).', type: 'INFO' }
  ]);
  const [convergenceData, setConvergenceData] = useState([]);

  // Form States
  const [newJob, setNewJob] = useState({ jobId: '', jobName: '', priority: 3, color: '#3b82f6', operations: [{ machineId: '', duration: 1, task: 'Op-1' }] });
  const [newMachine, setNewMachine] = useState({ machineId: '', machineName: '', status: 'idle' });

  useEffect(() => {
    fetchData();
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get('/iot/live');
        setStats({
          makespan: data.scheduler.makespan,
          utilization: data.machines.reduce((acc, m) => {
            acc[m.id] = m.health; // Use health/utilization drift
            return acc;
          }, {})
        });
        // Gradually update convergence data with a new point
        setConvergenceData(prev => {
          const last = prev[prev.length - 1];
          const nextTime = (parseInt(last.time) + 4) + 'h';
          return [...prev.slice(-10), { time: nextTime, efficiency: data.scheduler.unitUtilization }];
        });
        
        // Update machine statuses if they match existing ones
        setMachines(prev => prev.map(m => {
          const live = data.machines.find(lm => lm.name.includes(m.machineName) || m.machineName.includes(lm.name));
          return live ? { ...m, status: live.status.toLowerCase() } : m;
        }));

      } catch (err) {
        console.error("FYP live poll error:", err);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const jRes = await api.get('/fyp/jobs');
      const mRes = await api.get('/fyp/machines');
      const sRes = await api.get('/fyp/schedule');
      setJobs(jRes.data || []);
      setMachines(mRes.data || []);
      setSchedule(sRes.data || []);
      
      if (convergenceData.length === 0) {
        setConvergenceData([
          { time: '0h', efficiency: 72 }, { time: '4h', efficiency: 78 },
          { time: '8h', efficiency: 75 }, { time: '12h', efficiency: 82 },
          { time: '16h', efficiency: 80 }, { time: '20h', efficiency: 85 },
          { time: '24h', efficiency: 88 }
        ]);
      }
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  const runOptimizer = async () => {
    setIsOptimizing(true);
    addLog('Initiating Neural Swarm GA Optimizer...', 'INFO');
    try {
      const res = await api.post('/fyp/optimize');
      setSchedule(res.data.schedule);
      setStats({
        makespan: res.data.makespan,
        utilization: res.data.machineUtilization
      });
      setConvergenceData(res.data.history?.map(h => ({ time: `${h.gen}g`, efficiency: parseFloat(h.efficiency) })) || []);
      addLog(`Optimization Complete: Makespan reduced to ${res.data.makespan}h`, 'SUCCESS');
    } catch (err) {
      console.error(err);
      addLog('Optimization failed: Resource contention detected.', 'WARNING');
    } finally {
      setIsOptimizing(false);
    }
  };

  const addLog = (msg, type) => {
    setOptLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), msg, type: type.toUpperCase() }, ...prev]);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fyp/jobs', newJob);
      addLog(`Job ${newJob.jobId} registered to neural backlog.`, 'INFO');
      setShowAddModal(null);
      fetchData();
    } catch (err) { alert("Error adding job."); }
  };

  const handleCreateMachine = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fyp/machines', newMachine);
      addLog(`Asset ${newMachine.machineId} synchronized to resource cluster.`, 'INFO');
      setShowAddModal(null);
      fetchData();
    } catch (err) { alert("Error adding machine."); }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Production Orchestrator v4.0 - Schedule Report', 14, 20);
    const tableData = schedule.map(s => [s.jobId, s.jobName, s.machineId, s.task, `${s.start}h`, `${s.end}h`]);
    autoTable(doc, {
      startY: 30,
      head: [['Job', 'Name', 'Machine', 'Task', 'Start', 'End']],
      body: tableData,
    });
    doc.save('orchestrator-schedule.pdf');
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#030712] min-h-screen text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      {/* Header Panel */}
      <div className="flex justify-between items-center bg-[#111827]/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
            <Zap className="text-blue-500 fill-blue-500/20" size={32} />
            Production Orchestrator <span className="text-blue-500">v4.0</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[3px]">LIVE CLUSTER: BHILWARA TEXTILE CORE</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchData} className="px-5 py-2.5 bg-slate-800/40 hover:bg-emerald-500/20 text-[10px] font-black uppercase text-emerald-500 rounded-xl border border-emerald-500/20 transition-all flex items-center gap-2">
            <RefreshCw size={16} /> REFRESH
          </button>
          <button onClick={exportPDF} className="px-5 py-2.5 bg-slate-800/40 hover:bg-slate-700 text-[10px] font-black uppercase text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all flex items-center gap-2">
            <Download size={16} /> EXPORT
          </button>
          <button 
            onClick={runOptimizer} 
            disabled={isOptimizing}
            className={`px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 flex items-center gap-2 ${isOptimizing ? 'opacity-50' : ''}`}
          >
            <RefreshCw size={16} className={isOptimizing ? 'animate-spin' : ''} />
            {isOptimizing ? 'OPTIMIZING...' : 'RUN GA OPTIMIZER'}
          </button>
        </div>
      </div>

      {/* Stats Cards Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {[
          { 
            label: 'OVERALL UNIT UTILIZATION', 
            val: `${Object.values(stats.utilization || {}).length > 0 ? (Object.values(stats.utilization).reduce((a, b) => a + b, 0) / Object.values(stats.utilization).length).toFixed(1) : 0}%`, 
            change: '+1.2%', 
            icon: <Activity className="text-emerald-500" /> 
          },
          { 
            label: 'CURRENT MAKESPAN', 
            val: `${stats.makespan || 0}h`, 
            change: '-1.5%', 
            icon: <Clock className="text-blue-500" /> 
          },
          { 
            label: 'JOBS PROCESSED', 
            val: `${jobs.length}`, 
            change: '+2', 
            icon: <Zap className="text-yellow-500" /> 
          },
          { 
            label: 'RESOURCE CLUSTER', 
            val: `${machines.length} Units`, 
            change: 'Stable', 
            icon: <Cpu className="text-purple-500" /> 
          }
        ].map((s, i) => (
          <div key={i} className="bg-[#111827]/40 p-6 rounded-3xl border border-slate-800 shadow-xl relative group overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-[#1f2937] rounded-2xl border border-slate-800 shadow-inner">{s.icon}</div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${s.change.includes('+') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>{s.change}</span>
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-2xl font-black text-white">{s.val}</div>
            <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 relative z-10">
        
        {/* Left Utility Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Resource Cluster */}
          <div className="bg-[#111827]/40 p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-white uppercase tracking-[2px] flex items-center gap-3">
                <Cpu size={18} className="text-blue-500" /> RESOURCE CLUSTER
              </h3>
              <button onClick={() => setShowAddModal('machine')} className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-6">
              {machines.slice(0, 5).map((m, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-black text-white flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${m.status === 'idle' ? 'bg-slate-500' : 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]'}`}></div>
                      {m.machineName}
                    </span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-xs">{m.status.toUpperCase()}</span>
                  </div>
                  <div className="w-full bg-[#1f2937] h-2 rounded-full border border-slate-800 overflow-hidden p-0.5">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#2563eb]" style={{ width: `${stats.utilization[m.machineId] || 30}%` }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                    <span>UTILIZATION: {stats.utilization[m.machineId] || 0}%</span>
                    <span>HEALTH: 98.4%</span>
                  </div>
                </div>
              ))}
              {machines.length === 0 && <div className="text-center py-10 text-slate-600 font-black text-[10px] uppercase tracking-widest">No Machines Synced</div>}
            </div>
          </div>

          {/* Job Backlog */}
          <div className="bg-[#111827]/40 p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col h-[400px]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-white uppercase tracking-[2px] flex items-center gap-3">
                  <List size={18} className="text-blue-500" /> JOB BACKLOG
                </h3>
                <button onClick={() => setShowAddModal('job')} className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                  <Plus size={16} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                {jobs.map((j, i) => (
                  <div key={i} className="bg-[#1f2937]/50 p-5 rounded-3xl border border-slate-800/80 hover:border-blue-500/30 transition-all group relative">
                     <div className="flex justify-between items-start">
                        <div>
                           <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase leading-tight">{j.jobName}</h4>
                           <p className="text-[10px] font-bold text-slate-600 tracking-widest mt-1 opacity-60 uppercase">{j.jobId}</p>
                        </div>
                        <span className={`text-[8px] font-black px-3 py-1 rounded-lg ${j.priority >= 5 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'} uppercase tracking-widest`}>
                          {j.priority >= 5 ? 'HIGH' : j.priority >= 3 ? 'MID' : 'LOW'}
                        </span>
                     </div>
                     <div className="flex items-center gap-3 mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <Clock size={12} className="text-blue-500/50" /> {j.operations[0].duration}H PROCESS
                     </div>
                  </div>
                ))}
                {jobs.length === 0 && <div className="text-center py-20 text-slate-600 font-black text-[10px] uppercase tracking-widest">Backlog Empty</div>}
             </div>
          </div>
        </div>

        {/* Right Dynamic Visualization Panel */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-[#111827]/40 rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
             <div className="p-6 border-b border-slate-800/60 flex justify-between items-center bg-[#1f2937]/20 backdrop-blur-sm">
                <h3 className="text-xs font-black text-white uppercase tracking-[2px] flex items-center gap-3">
                  <Layout size={18} className="text-blue-500" /> PRODUCTION TIMELINE
                </h3>
                <div className="flex bg-[#030712] rounded-2xl p-1 border border-slate-800 shadow-inner">
                   <button 
                     onClick={() => setViewMode('gantt')} 
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${viewMode === 'gantt' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     GANTT
                   </button>
                   <button 
                     onClick={() => setViewMode('workload')} 
                     className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${viewMode === 'workload' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     WORKLOAD
                   </button>
                </div>
             </div>
             
             <div className="flex-1 p-8 relative overflow-x-auto custom-scrollbar">
                <div className="min-w-[900px]">
                  <div className="flex border-b border-slate-800/80 mb-8 pb-4">
                     <div className="w-48 shrink-0"></div>
                     <div className="flex-1 flex justify-between px-4 text-[9px] font-black text-slate-600 tracking-widest uppercase">
                       {Array.from({ length: 13 }).map((_, i) => <span key={i} className="text-center w-12">{i * 2}H</span>)}
                     </div>
                  </div>

                  <div className="space-y-8 relative">
                    <div className="absolute top-0 bottom-0 left-[48%] w-0.5 bg-blue-500 animate-pulse pointer-events-none z-10 shadow-[0_0_20px_#3b82f6]">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-blue-600 text-[8px] px-2 py-0.5 font-black text-white rounded mb-1 whitespace-nowrap">STATUS: OPTIMAL</div>
                    </div>

                    {machines.map((m, i) => (
                      <div key={i} className="flex items-center gap-8 h-12 group">
                        <div className="w-48 shrink-0">
                           <div className="text-[11px] font-black text-white tracking-[1px] uppercase group-hover:text-blue-500 transition-colors">{m.machineName}</div>
                           <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5">RESOURCE INFRA // {m.machineId}</div>
                        </div>
                        <div className="flex-1 h-12 bg-[#030712]/40 rounded-2xl relative border border-slate-800/50 shadow-inner group-hover:border-slate-700 transition-all overflow-hidden">
                           <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                              {Array.from({ length: 12 }).map((_, x) => <div key={x} className="border-r border-slate-800/30"></div>)}
                           </div>
                           
                           {schedule.filter(s => s.machineId === m.machineId).map((task, tidx) => {
                              const maxTime = Math.max(...schedule.map(s => s.end), 24);
                              return (
                                <div 
                                  key={tidx}
                                  style={{ 
                                    left: `${(task.start / maxTime) * 100}%`, 
                                    width: `${(task.duration / maxTime) * 100}%`,
                                    backgroundColor: (task.color || '#3b82f6') + '22',
                                    borderLeft: `4px solid ${task.color || '#3b82f6'}`,
                                    boxShadow: `inset 0 0 15px ${(task.color || '#3b82f6')}11`
                                  }}
                                  className="absolute top-2 bottom-2 rounded-xl flex items-center px-4 backdrop-blur-sm group/task hover:brightness-125 transition-all cursor-crosshair z-20 border border-slate-800/10"
                                >
                                  <span className="text-[10px] font-black text-white truncate drop-shadow-md tracking-tighter uppercase">{task.jobName}</span>
                                </div>
                              );
                           })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6 h-[300px]">
             <div className="bg-[#111827]/40 p-6 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-white uppercase tracking-[2px] flex items-center gap-3">
                    <BrainCircuit size={18} className="text-blue-500" /> NEURAL IMPACT ANALYSIS
                  </h3>
                  <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Inference Hub</div>
                </div>
                <div className="h-[180px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={convergenceData}>
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} opacity={0.3} />
                        <XAxis dataKey="time" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                        <YAxis hide domain={[60, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', fontSize: '10px' }}
                          labelStyle={{ color: '#6b7280', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#chartGlow)" dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#030712' }} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-[#111827]/40 p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-white uppercase tracking-[2px] flex items-center gap-3">
                    <Activity size={18} className="text-blue-500" /> OPTIMIZATION EVENT LOG
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                   {optLogs.map(log => (
                     <div key={log.id} className="relative pl-6 py-1 animate-fade-in group">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500/20 rounded-full group-hover:bg-blue-500 transition-all">
                           <div className={`absolute top-0 left-0 w-full h-1/2 rounded-full ${log.type === 'WARNING' ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'}`}></div>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] font-black text-slate-600 tracking-widest">{log.time}</span>
                           <span className={`text-[9px] font-black uppercase tracking-[2px] ${log.type === 'WARNING' ? 'text-orange-500' : 'text-blue-500'}`}>{log.type}</span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-200 leading-snug group-hover:text-white transition-colors">{log.msg}</p>
                     </div>
                   ))}
                </div>
                <button className="mt-6 w-full py-4 bg-[#1f2937]/50 hover:bg-[#374151]/50 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white transition-all border border-slate-800 uppercase tracking-widest shadow-lg">
                  View Full Diagnostic Report
                </button>
             </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60 animate-fade-in">
           <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]/20">
                 <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                   {showAddModal === 'job' ? <><Plus className="text-blue-500" /> Register Task</> : <><Cpu className="text-blue-500" /> Register Asset</>}
                 </h2>
                 <button onClick={() => setShowAddModal(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"><X /></button>
              </div>
              <form onSubmit={showAddModal === 'job' ? handleCreateJob : handleCreateMachine} className="p-8 space-y-6">
                 {showAddModal === 'job' ? (
                   <>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Serial Code</label>
                        <input className="w-full bg-[#030712] border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-blue-600" placeholder="e.g. JB-NEXT-01" required value={newJob.jobId} onChange={e => setNewJob({...newJob, jobId: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                        <input className="w-full bg-[#030712] border border-slate-800 rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-blue-600" placeholder="e.g. High-Temp Finish" required value={newJob.jobName} onChange={e => setNewJob({...newJob, jobName: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Machine</label>
                          <select className="w-full bg-[#030712] border border-slate-800 rounded-2xl p-4 text-sm outline-none" required onChange={e => {
                            const ops = [...newJob.operations]; 
                            ops[0].machineId = e.target.value;
                            setNewJob({...newJob, operations: ops});
                          }}>
                            <option value="">Select Asset</option>
                            {machines.map(m => <option key={m.machineId} value={m.machineId}>{m.machineName}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hours</label>
                          <input type="number" className="w-full bg-[#030712] border border-slate-800 rounded-2xl p-4 text-sm" value={newJob.operations[0].duration} onChange={e => {
                             const ops = [...newJob.operations];
                             ops[0].duration = parseInt(e.target.value);
                             setNewJob({...newJob, operations: ops});
                          }} />
                        </div>
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hardware ID</label>
                        <input className="w-full bg-[#030712] border border-slate-800 rounded-2xl p-4 text-sm outline-none" placeholder="e.g. MC-CL-01" required value={newMachine.machineId} onChange={e => setNewMachine({...newMachine, machineId: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Name</label>
                        <input className="w-full bg-[#030712] border border-slate-800 rounded-2xl p-4 text-sm outline-none" placeholder="e.g. Textile Master Unit" required value={newMachine.machineName} onChange={e => setNewMachine({...newMachine, machineName: e.target.value})} />
                     </div>
                   </>
                 )}
                 <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Enroll to Neural Cluster</button>
              </form>
           </div>
        </div>
      )}

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default FYPOptimizer;
