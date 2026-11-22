# -*- coding: utf-8 -*-
r"""
Bespoke screen HTML assembly for UPTIME Technician Web (apps/tech-web)
Screens: TW01 - TW28
"""

def get_cases_js():
    return r"""
    function getBespokeScreenHtml(code, s) {
      switch(code) {
        case 'TW01':
          return `
            <div class="max-w-xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <!-- Master Lockup -->
                <div class="text-center space-y-3">
                  <div class="w-16 h-16 mx-auto rounded-2xl bg-black flex items-center justify-center text-white shadow-lg border border-slate-800">
                    <svg class="w-10 h-10" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" rx="20" fill="#000000" />
                      <path d="M22 24 V 55 C 22 74, 78 74, 78 55 V 24" stroke="#FFFFFF" stroke-width="13" stroke-linecap="round" fill="none" />
                      <path d="M64 38 L78 20 L90 38" stroke="#F97316" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                      <circle cx="50" cy="46" r="11" stroke="#00D4AA" stroke-width="6" fill="none" stroke-dasharray="7 5" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-display font-black text-slate-900 tracking-tight">UPTIME FIELD SPECIALIST</h2>
                    <p class="text-xs text-slate-500 font-medium">Enterprise Engineering & Dispatch Workstation</p>
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-[11px] font-bold font-mono">
                    <span class="w-2 h-2 rounded-full bg-orange-500 pulse-live"></span>
                    2,840 CERTIFIED SPECIALISTS ONLINE
                  </div>
                </div>

                <!-- Demo Specialist Level Switcher -->
                <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Quick Demo Role Switcher</span>
                    <span class="text-emerald-600 font-bold">L2 Senior Active</span>
                  </div>
                  <div class="grid grid-cols-4 gap-1.5 text-xs font-bold">
                    <button class="px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-slate-400">L0 Novice</button>
                    <button class="px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-slate-400">L1 Junior</button>
                    <button class="px-2 py-1.5 rounded-xl bg-orange-500 text-white shadow-sm">L2 Senior</button>
                    <button class="px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-slate-400">L3 Master</button>
                  </div>
                </div>

                <!-- Form -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number / Specialist ID</label>
                    <div class="relative">
                      <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-mono font-bold text-slate-400">+91</span>
                      <input type="text" value="98765 43210" class="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold focus:bg-white focus:border-orange-500 outline-none" />
                    </div>
                  </div>
                  <button onclick="jumpToScreen('TW03')" class="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                    <span>Send Verification Code (OTP)</span>
                    <i class="fa-solid fa-arrow-right text-[11px] text-orange-400"></i>
                  </button>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="text-slate-500">New industrial specialist?</span>
                  <button onclick="jumpToScreen('TW02')" class="font-bold text-orange-600 hover:underline">Apply for Certification →</button>
                </div>
              </div>
            </div>`;

        case 'TW02':
          return `
            <div class="max-w-2xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Specialist Onboarding & KYC Registration</h2>
                  <p class="text-xs text-slate-500">Join Karnataka's premier certified industrial emergency repair network.</p>
                </div>

                <!-- Trade Selector -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-700">Select Primary Trade Discipline</label>
                  <div class="grid grid-cols-3 gap-3">
                    <div class="p-3.5 rounded-2xl border-2 border-orange-500 bg-orange-50/40 text-left space-y-1 cursor-pointer">
                      <i class="fa-solid fa-industry text-orange-600 text-base"></i>
                      <div class="text-xs font-bold text-slate-900">Industrial Machinery</div>
                      <div class="text-[10px] text-slate-500">CNC, Lathes, 415V Drives</div>
                    </div>
                    <div class="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 text-left space-y-1 cursor-pointer">
                      <i class="fa-solid fa-truck-moving text-blue-600 text-base"></i>
                      <div class="text-xs font-bold text-slate-900">Commercial Fleets</div>
                      <div class="text-[10px] text-slate-500">OBD-II, Diesel, EV Vans</div>
                    </div>
                    <div class="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-400 text-left space-y-1 cursor-pointer">
                      <i class="fa-solid fa-microchip text-emerald-600 text-base"></i>
                      <div class="text-xs font-bold text-slate-900">Power Electronics</div>
                      <div class="text-[10px] text-slate-500">Transformers, UPS, SMT</div>
                    </div>
                  </div>
                </div>

                <!-- Inputs Grid -->
                <div class="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Full Legal Name (as per Aadhaar)</label>
                    <input type="text" value="Raju Kumar Sharma" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold" />
                  </div>
                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Years of Practical Experience</label>
                    <input type="text" value="8 Years (Senior Grade)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold" />
                  </div>
                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Aadhaar Card Number</label>
                    <input type="text" value="5412 •••• •••• 9821" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold" />
                  </div>
                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Permanent Account Number (PAN)</label>
                    <input type="text" value="ABCPS1234F" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold" />
                  </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-certificate text-purple-600 text-lg"></i>
                    <div>
                      <div class="font-bold text-slate-900">ITI / Diploma Engineering Certificate</div>
                      <div class="text-[11px] text-slate-500">Uploaded: raju_iti_mechanical.pdf (1.8 MB)</div>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">READY</span>
                </div>

                <button onclick="jumpToScreen('TW03')" class="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg">
                  Submit Application & Verify Mobile →
                </button>
              </div>
            </div>`;

        case 'TW03':
          return `
            <div class="max-w-md mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-6">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl shadow-inner">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Security OTP Verification</h2>
                  <p class="text-xs text-slate-500 mt-1">We sent a 6-digit code to <span class="font-mono font-bold text-slate-800">+91 98765 43210</span></p>
                </div>

                <!-- OTP Cells -->
                <div class="flex justify-center gap-2">
                  <span class="w-12 h-14 rounded-2xl border-2 border-orange-500 bg-orange-50/30 text-xl font-mono font-black flex items-center justify-center text-slate-900">8</span>
                  <span class="w-12 h-14 rounded-2xl border-2 border-orange-500 bg-orange-50/30 text-xl font-mono font-black flex items-center justify-center text-slate-900">8</span>
                  <span class="w-12 h-14 rounded-2xl border-2 border-orange-500 bg-orange-50/30 text-xl font-mono font-black flex items-center justify-center text-slate-900">4</span>
                  <span class="w-12 h-14 rounded-2xl border-2 border-orange-500 bg-orange-50/30 text-xl font-mono font-black flex items-center justify-center text-slate-900">1</span>
                  <span class="w-12 h-14 rounded-2xl border border-slate-200 text-xl font-mono font-black flex items-center justify-center text-slate-900">9</span>
                  <span class="w-12 h-14 rounded-2xl border border-slate-200 text-xl font-mono font-black flex items-center justify-center text-slate-900">2</span>
                </div>

                <div class="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Expires in: <strong class="text-slate-800">00:48s</strong></span>
                  <button class="text-orange-600 font-bold hover:underline">Resend via WhatsApp</button>
                </div>

                <button onclick="jumpToScreen('TW05')" class="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-lg">
                  Verify & Enter Specialist Cockpit →
                </button>
              </div>
            </div>`;

        case 'TW04':
          return `
            <div class="max-w-2xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Field Toolbox & Calibration Inspection</h2>
                  <p class="text-xs text-slate-500">Confirm your calibrated tools before dispatch activation.</p>
                </div>

                <div class="space-y-3">
                  <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-bolt text-amber-500 text-lg"></i>
                      <div>
                        <div class="font-bold text-slate-900">Fluke 87V Industrial Multimeter (CAT IV 600V)</div>
                        <div class="text-[11px] font-mono text-slate-500">Calibrated till: 15-AUG-2027 • NABL Accredited</div>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</span>
                  </div>
                  <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-lock text-rose-500 text-lg"></i>
                      <div>
                        <div class="font-bold text-slate-900">415V OSHA Lockout-Tagout (LOTO) Safety Kit</div>
                        <div class="text-[11px] font-mono text-slate-500">Master Lock Red Padlocks + Hasps + Danger Tags</div>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">INSPECTED</span>
                  </div>
                  <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-wrench text-blue-500 text-lg"></i>
                      <div>
                        <div class="font-bold text-slate-900">SKF Bearing Induction Heater & Puller Set</div>
                        <div class="text-[11px] font-mono text-slate-500">TIH 030m portable induction heater ready in van</div>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</span>
                  </div>
                </div>

                <button onclick="jumpToScreen('TW05')" class="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg">
                  Confirm Toolbox & Go Online →
                </button>
              </div>
            </div>`;

        case 'TW05':
          return `
            <div class="space-y-6">
              <!-- Top Specialist Status Strip -->
              <div class="rounded-3xl bg-slate-900 text-white p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="relative">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-display font-black text-xl shadow-lg">
                      RK
                    </div>
                    <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 pulse-live"></span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h2 class="text-lg font-display font-black">Raju Kumar Sharma</h2>
                      <span class="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold">L2 SENIOR SPECIALIST</span>
                    </div>
                    <p class="text-xs text-slate-400 font-mono">Specialization: Industrial CNC & Spindle Drives • ID: #TECH-8841</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span class="text-xs font-mono font-bold text-emerald-400">DISPATCH READY (ONLINE)</span>
                  </div>
                  <button onclick="jumpToScreen('TW07')" class="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
                    <i class="fa-solid fa-bell"></i>
                    <span>Simulate Incoming Job (60s)</span>
                  </button>
                </div>
              </div>

              <!-- Metrics Row -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono font-bold text-slate-400 uppercase">Today's Net Earnings</div>
                  <div class="text-2xl font-display font-black text-slate-900">₹1,850</div>
                  <div class="text-[11px] text-emerald-600 font-bold">+₹450 emergency bonus</div>
                </div>
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono font-bold text-slate-400 uppercase">Jobs Completed Today</div>
                  <div class="text-2xl font-display font-black text-slate-900">4 <span class="text-xs font-normal text-slate-400">/ 5 target</span></div>
                  <div class="text-[11px] text-blue-600 font-bold">Avg repair: 42 mins</div>
                </div>
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono font-bold text-slate-400 uppercase">Specialist Rating</div>
                  <div class="text-2xl font-display font-black text-slate-900 flex items-center gap-1">
                    4.9 <span class="text-amber-500 text-base">★</span>
                  </div>
                  <div class="text-[11px] text-slate-500">142 verified client reviews</div>
                </div>
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono font-bold text-slate-400 uppercase">Acceptance Rate</div>
                  <div class="text-2xl font-display font-black text-slate-900">96.4%</div>
                  <div class="text-[11px] text-emerald-600 font-bold">Top 3% in Peenya Cluster</div>
                </div>
              </div>

              <!-- Active Job Banner -->
              <div class="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30 font-mono text-[10px] font-bold">ACTIVE JOB IN PROGRESS</span>
                    <span class="text-xs font-mono text-slate-300">#JOB-9821 • EMERGENCY CNC SPINDLE</span>
                  </div>
                  <h3 class="text-lg font-display font-black">Apex Precision Tools • Peenya Plant #1 (Bay 2)</h3>
                  <p class="text-xs text-slate-300">Issue: High-vibration spindle bearing seizure (415V). Client waiting on-site.</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <div class="text-[10px] font-mono text-slate-300 uppercase">Arrival OTP</div>
                    <div class="text-lg font-mono font-black text-amber-400">8841</div>
                  </div>
                  <button onclick="jumpToScreen('TW06')" class="px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg flex items-center gap-2">
                    <span>Open Execution Console</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <!-- Two Column Dashboard Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left 2 Cols: Weekly Earnings Trend -->
                <div class="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-sm font-display font-black text-slate-900">Weekly Earnings Performance (Recharts)</h4>
                      <p class="text-xs text-slate-500">Gross vs Net Payouts for Current Week (₹38,450 Gross)</p>
                    </div>
                    <button onclick="jumpToScreen('TW10')" class="text-xs font-bold text-blue-600 hover:underline">Full Financials →</button>
                  </div>

                  <!-- Mock Bar Visualizer -->
                  <div class="h-48 pt-6 flex items-end justify-between gap-3 px-2 border-b border-slate-100">
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-orange-400 rounded-t-xl" style="height: 60%"></div>
                      <span class="text-[10px] font-mono text-slate-400">Mon</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-orange-400 rounded-t-xl" style="height: 75%"></div>
                      <span class="text-[10px] font-mono text-slate-400">Tue</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-orange-400 rounded-t-xl" style="height: 50%"></div>
                      <span class="text-[10px] font-mono text-slate-400">Wed</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-orange-500 rounded-t-xl" style="height: 90%"></div>
                      <span class="text-[10px] font-mono text-slate-400 font-bold">Thu</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-orange-500 rounded-t-xl shadow-md" style="height: 95%"></div>
                      <span class="text-[10px] font-mono text-slate-900 font-bold">Fri</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-slate-200 rounded-t-xl" style="height: 30%"></div>
                      <span class="text-[10px] font-mono text-slate-400">Sat</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                      <div class="w-full bg-slate-100 rounded-t-xl" style="height: 10%"></div>
                      <span class="text-[10px] font-mono text-slate-400">Sun</span>
                    </div>
                  </div>
                </div>

                <!-- Right Col: Today's Schedule -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-display font-black text-slate-900">Today's Schedule</h4>
                    <span class="text-[10px] font-mono text-slate-400">4 of 5 Done</span>
                  </div>
                  <div class="space-y-3">
                    <div class="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs space-y-1">
                      <div class="flex items-center justify-between font-bold text-blue-900">
                        <span>Apex Tools • Bay 2</span>
                        <span class="text-[10px] font-mono text-orange-600">IN PROGRESS</span>
                      </div>
                      <p class="text-[11px] text-slate-600">11:30 AM • 415V Spindle Bearing</p>
                    </div>
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 opacity-70">
                      <div class="flex items-center justify-between font-bold text-slate-700">
                        <span>Bharat Forge • Unit 3</span>
                        <span class="text-[10px] font-mono text-emerald-600">COMPLETED</span>
                      </div>
                      <p class="text-[11px] text-slate-500">09:15 AM • Hydraulic Pressure Valve</p>
                    </div>
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div class="flex items-center justify-between font-bold text-slate-700">
                        <span>Kirloskar Motors • Bay 1</span>
                        <span class="text-[10px] font-mono text-slate-400">SCHEDULED</span>
                      </div>
                      <p class="text-[11px] text-slate-500">03:30 PM • 3-Phase Servo Motor Audit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>`;

        case 'TW06':
          return `
            <div class="max-w-4xl mx-auto space-y-6">
              <!-- Active Execution Header -->
              <div class="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">EMERGENCY SOS DISPATCH</span>
                    <span class="text-xs font-mono text-slate-400">#JOB-9821</span>
                  </div>
                  <h2 class="text-xl font-display font-black">Siemens Sinumerik 828D Spindle Bearing Replacement</h2>
                  <p class="text-xs text-slate-300">Apex Precision Tools • Peenya Plant #1, Floor 2, Bay 2</p>
                </div>
                <div class="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center">
                  <div class="text-[10px] font-mono text-slate-400 uppercase">Customer Handover OTP</div>
                  <div class="text-2xl font-mono font-black text-amber-400 tracking-wider">8841</div>
                </div>
              </div>

              <!-- LOTO Safety Gate (Mandatory) -->
              <div class="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-md">
                    <i class="fa-solid fa-lock"></i>
                  </div>
                  <div>
                    <h3 class="text-sm font-display font-black text-amber-950 uppercase">Mandatory 415V Lockout-Tagout (LOTO) Safety Protocol</h3>
                    <p class="text-xs text-amber-800">You must verify zero electrical voltage before opening the drive enclosure.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <label class="flex items-center gap-2 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked class="w-4 h-4 rounded text-orange-600" />
                    <span class="font-bold text-slate-800">Main 415V Isolator Switched OFF</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked class="w-4 h-4 rounded text-orange-600" />
                    <span class="font-bold text-slate-800">Fluke 87V Zero Energy Verified</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 rounded-xl bg-white border border-amber-200 cursor-pointer">
                    <input type="checkbox" checked class="w-4 h-4 rounded text-orange-600" />
                    <span class="font-bold text-slate-800">Red Padlock & Tag #98 Attached</span>
                  </label>
                </div>
              </div>

              <!-- Work Inspection & Evidence Logger -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left: Photographic Proof -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h4 class="text-sm font-display font-black text-slate-900">Photographic Inspection Proof</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <div class="text-[10px] font-mono font-bold text-rose-600">BEFORE REPAIR</div>
                      <div class="h-24 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                        <i class="fa-solid fa-camera text-2xl"></i>
                      </div>
                      <span class="text-[10px] font-mono text-slate-500">bearing_damage_macro.jpg</span>
                    </div>
                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                      <div class="text-[10px] font-mono font-bold text-emerald-600">AFTER REPAIR</div>
                      <div class="h-24 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <i class="fa-solid fa-circle-check text-2xl"></i>
                      </div>
                      <span class="text-[10px] font-mono text-slate-500">new_skf_fitted.jpg</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Replacement Parts Logged -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-display font-black text-slate-900">Parts Used (Van Inventory)</h4>
                    <button class="text-xs font-bold text-blue-600">+ Add Part</button>
                  </div>
                  <div class="space-y-2 text-xs">
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div class="font-bold text-slate-900">SKF Explorer 6208 Deep Groove Bearing</div>
                        <div class="text-[10px] font-mono text-slate-500">Serial: SKF-882194-IN • 18% GST</div>
                      </div>
                      <span class="font-mono font-bold text-slate-900">₹3,450</span>
                    </div>
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div class="font-bold text-slate-900">Klüber Isoflex NBU 15 High-Speed Grease (50g)</div>
                        <div class="text-[10px] font-mono text-slate-500">Batch: KLB-2026-X</div>
                      </div>
                      <span class="font-mono font-bold text-slate-900">₹850</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Completion & Handover Signature -->
              <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div class="text-sm font-display font-black text-slate-900">Digital Handover Sign-off</div>
                  <p class="text-xs text-slate-500">Enter customer OTP to release ₹1,400 payout into your wallet.</p>
                </div>
                <button onclick="jumpToScreen('TW09')" class="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center gap-2">
                  <i class="fa-solid fa-check-double"></i>
                  <span>Complete Job & Release Escrow →</span>
                </button>
              </div>
            </div>`;

        case 'TW07':
          return `
            <div class="max-w-xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-slate-950 text-white border-2 border-orange-500 shadow-2xl relative overflow-hidden space-y-6">
                <!-- Pulsing Countdown Ring -->
                <div class="text-center space-y-2">
                  <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-xs font-bold animate-pulse">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    FLASH EMERGENCY DISPATCH REQUEST
                  </div>
                  <div class="w-24 h-24 mx-auto rounded-full border-4 border-orange-500 flex flex-col items-center justify-center">
                    <span class="text-2xl font-mono font-black text-white">47s</span>
                    <span class="text-[9px] font-mono text-slate-400 uppercase">REMAINING</span>
                  </div>
                </div>

                <!-- Job Breakdown -->
                <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-mono text-slate-400">Apex Precision Tools (Peenya Bay 2)</span>
                    <span class="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold">2.8 KM AWAY</span>
                  </div>
                  <h3 class="text-lg font-display font-black text-white">CNC Spindle Drive 415V Bearing Seizure</h3>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="p-2.5 rounded-xl bg-slate-800/80">
                      <div class="text-[10px] font-mono text-slate-400">ESTIMATED PAYOUT</div>
                      <div class="text-base font-mono font-black text-emerald-400">₹1,400 + Parts</div>
                    </div>
                    <div class="p-2.5 rounded-xl bg-slate-800/80">
                      <div class="text-[10px] font-mono text-slate-400">ARRIVAL SLA</div>
                      <div class="text-base font-mono font-black text-amber-400">12 Mins ETA</div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                  <button onclick="jumpToScreen('TW06')" class="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-display font-black text-sm shadow-xl flex items-center justify-center gap-2">
                    <i class="fa-solid fa-bolt"></i>
                    <span>ACCEPT EMERGENCY DISPATCH NOW</span>
                  </button>
                  <button onclick="jumpToScreen('TW05')" class="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs border border-slate-800">
                    Decline Request (No Penalty)
                  </button>
                </div>
              </div>
            </div>`;

        case 'TW08':
          return `
            <div class="space-y-6">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Completed Jobs History Ledger</h2>
                  <p class="text-xs text-slate-500">TanStack Table of 142 completed industrial maintenance dispatches.</p>
                </div>
                <div class="flex items-center gap-2">
                  <input type="text" placeholder="Search plant, machine, or job ID..." class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs outline-none w-64" />
                  <button class="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm">Filter</button>
                </div>
              </div>

              <div class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-bold uppercase text-[10px]">
                    <tr>
                      <th class="p-4">Job ID</th>
                      <th class="p-4">Client Plant</th>
                      <th class="p-4">Equipment & Issue</th>
                      <th class="p-4">Date Completed</th>
                      <th class="p-4">Payout</th>
                      <th class="p-4">Rating</th>
                      <th class="p-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium">
                    <tr class="hover:bg-slate-50 cursor-pointer" onclick="jumpToScreen('TW09')">
                      <td class="p-4 font-mono font-bold text-blue-600">#JOB-9821</td>
                      <td class="p-4 font-bold text-slate-900">Apex Precision Tools (Peenya)</td>
                      <td class="p-4 text-slate-600">Siemens 828D Spindle Bearing</td>
                      <td class="p-4 font-mono text-slate-500">14-NOV-2026</td>
                      <td class="p-4 font-mono font-bold text-emerald-600">₹1,400</td>
                      <td class="p-4 font-bold text-amber-500">5.0 ★</td>
                      <td class="p-4 text-right"><span class="text-blue-600 font-bold hover:underline">PDF ↓</span></td>
                    </tr>
                    <tr class="hover:bg-slate-50 cursor-pointer" onclick="jumpToScreen('TW09')">
                      <td class="p-4 font-mono font-bold text-blue-600">#JOB-9804</td>
                      <td class="p-4 font-bold text-slate-900">Bharat Forge Unit #3</td>
                      <td class="p-4 text-slate-600">Hydraulic Pressure Valve Seal</td>
                      <td class="p-4 font-mono text-slate-500">14-NOV-2026</td>
                      <td class="p-4 font-mono font-bold text-emerald-600">₹950</td>
                      <td class="p-4 font-bold text-amber-500">4.8 ★</td>
                      <td class="p-4 text-right"><span class="text-blue-600 font-bold hover:underline">PDF ↓</span></td>
                    </tr>
                    <tr class="hover:bg-slate-50 cursor-pointer" onclick="jumpToScreen('TW09')">
                      <td class="p-4 font-mono font-bold text-blue-600">#JOB-9782</td>
                      <td class="p-4 font-bold text-slate-900">Karnataka Logistics Fleet</td>
                      <td class="p-4 text-slate-600">Ashok Leyland 2820 OBD-II DEF Sensor</td>
                      <td class="p-4 font-mono text-slate-500">13-NOV-2026</td>
                      <td class="p-4 font-mono font-bold text-emerald-600">₹1,200</td>
                      <td class="p-4 font-bold text-amber-500">5.0 ★</td>
                      <td class="p-4 text-right"><span class="text-blue-600 font-bold hover:underline">PDF ↓</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>`;

        case 'TW09':
          return `
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">COMPLETED & ESCROW RELEASED</span>
                    <h2 class="text-lg font-display font-black text-slate-900 mt-1">Forensic Handover Dossier • #JOB-9821</h2>
                    <p class="text-xs text-slate-500">Siemens Sinumerik 828D Spindle Drive (Bay 2)</p>
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] font-mono text-slate-400">NET PAYOUT</div>
                    <div class="text-xl font-mono font-black text-emerald-600">₹1,400</div>
                  </div>
                </div>

                <!-- Before / After Gallery -->
                <div class="space-y-2">
                  <div class="text-xs font-bold text-slate-700">Side-by-Side Photographic Proof</div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div class="text-[10px] font-mono font-bold text-rose-600">Before: Seized Spindle Bearing</div>
                      <div class="h-32 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-mono">
                        [Photo: Pit marks & heat discoloration]
                      </div>
                    </div>
                    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div class="text-[10px] font-mono font-bold text-emerald-600">After: New SKF 6208 Installed</div>
                      <div class="h-32 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-mono">
                        [Photo: Fluke acoustic vibration: 0.8 mm/s]
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Cryptographic Seal -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1 text-slate-600">
                  <div class="flex items-center justify-between font-bold text-slate-800">
                    <span>Tamper-Proof SHA-256 Certificate</span>
                    <span class="text-emerald-600">VERIFIED ON POLYGON</span>
                  </div>
                  <div class="text-[10px] text-slate-400 break-all">0x7f9a88219c00b2149e8a719cbb84128f73109aef882174c1</div>
                  <div class="text-[11px] pt-1">Signed by: Plant Manager Anish Rao (Verified OTP: 8841)</div>
                </div>

                <div class="flex gap-3">
                  <button class="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs">Download GST Invoice PDF</button>
                  <button onclick="jumpToScreen('TW08')" class="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Back to Ledger</button>
                </div>
              </div>
            </div>`;

        case 'TW10':
          return `
            <div class="space-y-6">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Financial Command Center & Earnings</h2>
                  <p class="text-xs text-slate-500">Transparent earnings accounting with 10% platform fee and 1% TDS deduction.</p>
                </div>
                <button onclick="jumpToScreen('TW11')" class="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center gap-2">
                  <i class="fa-solid fa-wallet"></i>
                  <span>Withdraw to Bank (₹12,450)</span>
                </button>
              </div>

              <!-- Summary Cards -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono text-slate-400 uppercase">Gross Earnings (Month)</div>
                  <div class="text-2xl font-mono font-black text-slate-900">₹38,450</div>
                  <div class="text-[11px] text-slate-500">28 completed jobs</div>
                </div>
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono text-slate-400 uppercase">Platform Service Fee (10%)</div>
                  <div class="text-2xl font-mono font-black text-slate-700">-₹3,845</div>
                  <div class="text-[11px] text-slate-400">Escrow & Insurance included</div>
                </div>
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono text-slate-400 uppercase">TDS Deducted (Sec 194C 1%)</div>
                  <div class="text-2xl font-mono font-black text-slate-700">-₹384</div>
                  <div class="text-[11px] text-blue-600 font-bold">Form 26AS credited</div>
                </div>
                <div class="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-1">
                  <div class="text-[10px] font-mono text-emerald-700 uppercase font-bold">Net Payouts Transferred</div>
                  <div class="text-2xl font-mono font-black text-emerald-700">₹34,221</div>
                  <div class="text-[11px] text-emerald-800 font-bold">100% Settled</div>
                </div>
              </div>

              <!-- Recharts Trend -->
              <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-display font-black text-slate-900">Daily Earnings Trend (30 Days)</h4>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">Daily</button>
                    <button class="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold">Monthly</button>
                  </div>
                </div>
                <div class="h-44 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-end justify-between gap-1">
                  <!-- 15 bar segments -->
                  <div class="flex-1 bg-orange-400 rounded-t" style="height: 40%"></div>
                  <div class="flex-1 bg-orange-400 rounded-t" style="height: 55%"></div>
                  <div class="flex-1 bg-orange-400 rounded-t" style="height: 70%"></div>
                  <div class="flex-1 bg-orange-400 rounded-t" style="height: 60%"></div>
                  <div class="flex-1 bg-orange-500 rounded-t" style="height: 85%"></div>
                  <div class="flex-1 bg-orange-500 rounded-t" style="height: 95%"></div>
                  <div class="flex-1 bg-orange-400 rounded-t" style="height: 65%"></div>
                  <div class="flex-1 bg-orange-400 rounded-t" style="height: 50%"></div>
                  <div class="flex-1 bg-orange-500 rounded-t" style="height: 75%"></div>
                  <div class="flex-1 bg-orange-500 rounded-t" style="height: 90%"></div>
                  <div class="flex-1 bg-orange-500 rounded-t" style="height: 100%"></div>
                </div>
              </div>
            </div>`;

        case 'TW11':
          return `
            <div class="max-w-md mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Instant Wallet Withdrawal</h2>
                  <p class="text-xs text-slate-500">Withdraw wallet earnings directly to your bank account via IMPS.</p>
                </div>

                <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-1">
                  <div class="text-[10px] font-mono text-slate-400 uppercase">Available for Withdrawal</div>
                  <div class="text-3xl font-mono font-black text-emerald-400">₹12,450</div>
                  <div class="text-[10px] text-slate-400 font-mono">Minimum withdrawal: ₹100 • Transfer Fee: ₹0</div>
                </div>

                <div class="space-y-3 text-xs">
                  <label class="block font-bold text-slate-700">Select Verified Bank Account</label>
                  <div class="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-building-columns text-emerald-600 text-base"></i>
                      <div>
                        <div class="font-bold text-slate-900">HDFC Bank • Peenya Branch</div>
                        <div class="text-[11px] font-mono text-slate-500">A/C: •••• •••• 4419 (IFSC: HDFC0001248)</div>
                      </div>
                    </div>
                    <i class="fa-solid fa-circle-check text-emerald-600"></i>
                  </div>

                  <div>
                    <label class="block font-bold text-slate-700 mb-1">Enter Withdrawal Amount</label>
                    <input type="text" value="₹12,450" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono font-black text-base outline-none" />
                  </div>
                </div>

                <button onclick="jumpToScreen('TW10')" class="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2">
                  <i class="fa-solid fa-paper-plane"></i>
                  <span>Transfer ₹12,450 via IMPS Now</span>
                </button>
              </div>
            </div>`;

        case 'TW12':
          return `
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-display font-black text-slate-900">Skill Badges & Polygon Blockchain NFTs</h2>
                <p class="text-xs text-slate-500">Verifiable on-chain credentials showcasing engineering mastery.</p>
              </div>

              <!-- Badges Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Badge 1: 50 Jobs Master -->
                <div class="p-6 rounded-3xl bg-white border-2 border-amber-400 shadow-lg space-y-4 text-center relative overflow-hidden">
                  <div class="absolute -top-6 -right-6 w-20 h-20 bg-amber-400/20 rounded-full blur-xl"></div>
                  <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md">
                    🏆
                  </div>
                  <div>
                    <h3 class="text-sm font-display font-black text-slate-900">50 CNC Jobs Completed</h3>
                    <p class="text-xs text-slate-500">Master of industrial machine repairs</p>
                  </div>
                  <div class="space-y-1">
                    <div class="flex justify-between text-[10px] font-mono font-bold text-slate-600">
                      <span>47 / 50 Completed</span>
                      <span class="text-amber-600">94%</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div class="h-full bg-amber-500 rounded-full" style="width: 94%"></div>
                    </div>
                  </div>
                  <span class="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold">IN PROGRESS</span>
                </div>

                <!-- Badge 2: 415V LOTO Safety -->
                <div class="p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-lg space-y-4 text-center relative overflow-hidden">
                  <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-2xl shadow-md">
                    ⚡
                  </div>
                  <div>
                    <h3 class="text-sm font-display font-black text-slate-900">415V Certified Safety Hero</h3>
                    <p class="text-xs text-slate-500">Zero safety incidents in 100+ jobs</p>
                  </div>
                  <div class="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-mono font-bold">
                    Polygon NFT Minted • Token #8841
                  </div>
                  <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">EARNED & ON-CHAIN</span>
                </div>

                <!-- Badge 3: 15m Express Response -->
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 text-center">
                  <div class="w-16 h-16 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center text-2xl">
                    ⏱️
                  </div>
                  <div>
                    <h3 class="text-sm font-display font-black text-slate-900">Rapid 15m Dispatch King</h3>
                    <p class="text-xs text-slate-500">Arrive within 15 minutes on 25 jobs</p>
                  </div>
                  <div class="space-y-1">
                    <div class="flex justify-between text-[10px] font-mono font-bold text-slate-600">
                      <span>18 / 25 Completed</span>
                      <span class="text-slate-600">72%</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div class="h-full bg-slate-400 rounded-full" style="width: 72%"></div>
                    </div>
                  </div>
                  <span class="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-mono font-bold">IN PROGRESS</span>
                </div>
              </div>
            </div>`;

        case 'TW13':
          return `
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <!-- Profile Header -->
                <div class="flex items-center gap-5">
                  <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-display font-black text-3xl shadow-xl">
                    RK
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <h2 class="text-2xl font-display font-black text-slate-900">Raju Kumar Sharma</h2>
                      <span class="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">GOVT & UPTIME VERIFIED</span>
                    </div>
                    <p class="text-xs text-slate-500">Industrial CNC Specialist • 8 Years Exp • Peenya Cluster Lead</p>
                    <div class="flex items-center gap-3 text-xs font-mono font-bold text-slate-700 pt-1">
                      <span class="text-amber-500">★ 4.9 (142 reviews)</span>
                      <span>•</span>
                      <span>142 Jobs Completed</span>
                      <span>•</span>
                      <span class="text-emerald-600">96.4% Acceptance</span>
                    </div>
                  </div>
                </div>

                <!-- Rating Breakdown -->
                <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
                  <div>
                    <div class="text-[10px] font-mono text-slate-400">PUNCTUALITY</div>
                    <div class="text-base font-bold text-slate-900">4.9 ★</div>
                  </div>
                  <div>
                    <div class="text-[10px] font-mono text-slate-400">TECHNICAL QUALITY</div>
                    <div class="text-base font-bold text-slate-900">5.0 ★</div>
                  </div>
                  <div>
                    <div class="text-[10px] font-mono text-slate-400">LOTO SAFETY</div>
                    <div class="text-base font-bold text-slate-900">4.8 ★</div>
                  </div>
                </div>

                <!-- Testimonial -->
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div class="flex items-center justify-between font-bold text-slate-800">
                    <span>Apex Precision Tools • Peenya Plant #1</span>
                    <span class="text-amber-500">★★★★★</span>
                  </div>
                  <p class="text-slate-600 italic">"Raju diagnosed our Siemens 828D spindle bearing in 10 minutes and had our production line running in under an hour. Outstanding professional."</p>
                </div>
              </div>
            </div>`;

        case 'TW14':
          return `
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-display font-black text-slate-900">Trade Skills & Competency Matrix</h2>
                <p class="text-xs text-slate-500">Configure machinery and electronic subsystems you are certified to service.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">Siemens Sinumerik 828D / 840D SL</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">MASTER (L3)</span>
                  </div>
                  <p class="text-xs text-slate-500">Spindle drives, servo motors, encoder alignment, PLC diagnostics.</p>
                </div>

                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">Fanuc 0i-MF Plus / 31i-B5</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">SENIOR (L2)</span>
                  </div>
                  <p class="text-xs text-slate-500">Alpha i series servo amplifiers, optical I/O link troubleshooting.</p>
                </div>

                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">415V 3-Phase Industrial Power Units</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">CERTIFIED</span>
                  </div>
                  <p class="text-xs text-slate-500">Transformer tap changers, capacitor banks, VFD harmonics.</p>
                </div>

                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900">Commercial Vehicle OBD-II & J1939</span>
                    <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">INTERMEDIATE (L1)</span>
                  </div>
                  <p class="text-xs text-slate-500">Common rail diesel injector calibration, DEF sensor replacement.</p>
                </div>
              </div>
            </div>`;

        case 'TW15':
          return `
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">KYC & Compliance Document Vault</h2>
                  <p class="text-xs text-slate-500">Official government documents and engineering trade certificates.</p>
                </div>

                <div class="space-y-3">
                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-id-card text-blue-600 text-lg"></i>
                      <div>
                        <div class="font-bold text-slate-900">Aadhaar Card (UIDAI Verified)</div>
                        <div class="text-[11px] font-mono text-slate-500">5412 •••• •••• 9821 • Linked to DigiLocker</div>
                      </div>
                    </div>
                    <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</span>
                  </div>

                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-file-invoice text-purple-600 text-lg"></i>
                      <div>
                        <div class="font-bold text-slate-900">Permanent Account Number (PAN Card)</div>
                        <div class="text-[11px] font-mono text-slate-500">ABCPS1234F • TDS 194C Compliant</div>
                      </div>
                    </div>
                    <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">VERIFIED</span>
                  </div>

                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-3">
                      <i class="fa-solid fa-user-shield text-emerald-600 text-lg"></i>
                      <div>
                        <div class="font-bold text-slate-900">Police Clearance Certificate (PCC)</div>
                        <div class="text-[11px] font-mono text-slate-500">Bengaluru City Police • Valid till Dec 2027</div>
                      </div>
                    </div>
                    <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">CLEAR</span>
                  </div>
                </div>
              </div>
            </div>`;

        case 'TW16':
          return `
            <div class="space-y-6">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Availability Calendar & Working Schedule</h2>
                  <p class="text-xs text-slate-500">Set your operational hours and emergency on-call shifts.</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-mono font-bold text-slate-700">Available</span>
                  <span class="w-3 h-3 rounded-full bg-rose-500 ml-2"></span>
                  <span class="text-xs font-mono font-bold text-slate-700">Busy</span>
                  <span class="w-3 h-3 rounded-full bg-slate-300 ml-2"></span>
                  <span class="text-xs font-mono font-bold text-slate-700">Off</span>
                </div>
              </div>

              <!-- Month Visualizer -->
              <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div class="flex items-center justify-between font-display font-black text-sm text-slate-900">
                  <span>November 2026</span>
                  <div class="flex gap-2">
                    <button class="px-3 py-1 rounded-lg bg-slate-100 text-xs">‹ Prev</button>
                    <button class="px-3 py-1 rounded-lg bg-slate-100 text-xs">Next ›</button>
                  </div>
                </div>

                <div class="grid grid-cols-7 gap-2 text-center text-xs">
                  <div class="font-mono text-slate-400 py-1">Mon</div>
                  <div class="font-mono text-slate-400 py-1">Tue</div>
                  <div class="font-mono text-slate-400 py-1">Wed</div>
                  <div class="font-mono text-slate-400 py-1">Thu</div>
                  <div class="font-mono text-slate-400 py-1">Fri</div>
                  <div class="font-mono text-slate-400 py-1">Sat</div>
                  <div class="font-mono text-slate-400 py-1">Sun</div>

                  <!-- Sample Days -->
                  <div class="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">10</div>
                  <div class="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">11</div>
                  <div class="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">12</div>
                  <div class="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">13</div>
                  <div class="p-3 rounded-xl bg-orange-500 text-white font-black shadow-md">14 (Today)</div>
                  <div class="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">15</div>
                  <div class="p-3 rounded-xl bg-slate-100 text-slate-400 font-bold">16 (Off)</div>
                </div>
              </div>
            </div>`;

        case 'TW17':
          return `
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-display font-black text-slate-900">Service Area Geofence & Radar</h2>
                <p class="text-xs text-slate-500">Draggable 1–25 km operational radius centered on your Peenya depot.</p>
              </div>

              <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <!-- Map Canvas Mock -->
                <div class="h-80 rounded-2xl bg-slate-900 relative overflow-hidden flex items-center justify-center text-white border border-slate-800">
                  <!-- Radar Rings -->
                  <div class="absolute w-64 h-64 rounded-full border border-orange-500/30"></div>
                  <div class="absolute w-96 h-96 rounded-full border border-orange-500/20"></div>
                  <div class="absolute w-[500px] h-[500px] rounded-full border border-orange-500/10"></div>
                  
                  <!-- Center Marker -->
                  <div class="z-10 text-center space-y-1">
                    <div class="w-10 h-10 mx-auto rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg font-bold">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div class="text-xs font-bold">Peenya Industrial Depot (HQ)</div>
                    <div class="text-[10px] font-mono text-orange-400">Current Radius: 15.0 km</div>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs font-mono">
                  <span>Radius: <strong>15.0 km</strong></span>
                  <input type="range" min="1" max="25" value="15" class="w-64" />
                  <span class="text-emerald-600 font-bold">48 Active Plant Clients Covered</span>
                </div>
              </div>
            </div>`;

        case 'TW18':
          return `
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-display font-black text-slate-900">Performance Analytics & KPIs</h2>
                <p class="text-xs text-slate-500">Real-time technician metrics compared to Bangalore industrial averages.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div class="text-xs font-mono text-slate-400 uppercase">On-Time Arrival Rate</div>
                  <div class="text-3xl font-display font-black text-slate-900">92.4%</div>
                  <p class="text-xs text-emerald-600 font-bold">Avg arrival time: 11.2 mins</p>
                </div>
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div class="text-xs font-mono text-slate-400 uppercase">First-Time Fix Rate</div>
                  <div class="text-3xl font-display font-black text-slate-900">94.8%</div>
                  <p class="text-xs text-emerald-600 font-bold">Zero 30-day warranty recalls</p>
                </div>
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div class="text-xs font-mono text-slate-400 uppercase">Client Safety Score</div>
                  <div class="text-3xl font-display font-black text-slate-900">100%</div>
                  <p class="text-xs text-emerald-600 font-bold">Full LOTO compliance on 142 jobs</p>
                </div>
              </div>
            </div>`;

        case 'TW19':
          return `
            <div class="space-y-6">
              <div>
                <h2 class="text-xl font-display font-black text-slate-900">Specialist Academy & Video Training</h2>
                <p class="text-xs text-slate-500">Certified courses to unlock higher dispatch tiers and hourly rates.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">MANDATORY</span>
                    <span class="text-xs font-mono text-slate-500">45 Mins</span>
                  </div>
                  <h3 class="text-sm font-display font-black text-slate-900">415V Arc Flash & High-Voltage Isolation Procedures</h3>
                  <p class="text-xs text-slate-500">OSHA standard lockout-tagout, Fluke multimeter calibration, PPE compliance.</p>
                  <button class="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">Resume Course (80%)</button>
                </div>

                <div class="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">ADVANCED</span>
                    <span class="text-xs font-mono text-slate-500">60 Mins</span>
                  </div>
                  <h3 class="text-sm font-display font-black text-slate-900">Commercial EV Inverter & High-Voltage Battery Pack Triage</h3>
                  <p class="text-xs text-slate-500">Insulation resistance megger tests and regenerative braking controllers.</p>
                  <button class="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs">Start Course →</button>
                </div>
              </div>
            </div>`;

        case 'TW20':
          return `
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Engineering Wiki & Schematics Directory</h2>
                  <p class="text-xs text-slate-500">2,400+ peer-verified wiring diagrams and OEM fault codes.</p>
                </div>
                <input type="text" placeholder="Search Siemens, Fanuc, ABB error code..." class="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs w-64 outline-none" />
              </div>

              <div class="space-y-3">
                <div onclick="jumpToScreen('TW21')" class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-500 shadow-sm flex items-center justify-between cursor-pointer">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-file-waveform text-orange-500 text-lg"></i>
                    <div>
                      <div class="font-bold text-xs text-slate-900">Siemens Sinumerik 828D Spindle Drive 415V Wiring Schematic</div>
                      <div class="text-[11px] text-slate-500">Includes terminal pinout, encoder feedback cable pinouts, and LOTO steps.</div>
                    </div>
                  </div>
                  <span class="text-xs font-mono font-bold text-orange-600">Open Article →</span>
                </div>

                <div class="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <i class="fa-solid fa-file-waveform text-blue-500 text-lg"></i>
                    <div>
                      <div class="font-bold text-xs text-slate-900">Fanuc Alpha i-Series Servo Amplifier Alarm 401 & 414 Triage</div>
                      <div class="text-[11px] text-slate-500">Optical link cable testing, emergency stop contactor checks.</div>
                    </div>
                  </div>
                  <span class="text-xs font-mono font-bold text-slate-400">View</span>
                </div>
              </div>
            </div>`;

        case 'TW21':
          return `
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div>
                  <span class="text-[10px] font-mono font-bold text-orange-600 uppercase">Siemens Sinumerik 828D</span>
                  <h2 class="text-xl font-display font-black text-slate-900 mt-1">Spindle Drive 415V 3-Phase Terminal Pinout & LOTO Guide</h2>
                  <p class="text-xs text-slate-500">Verified by 64 senior CNC specialists in Peenya Industrial Area.</p>
                </div>

                <!-- Schematic Diagram Container -->
                <div class="p-6 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-3">
                  <div class="text-slate-400 uppercase text-[10px] border-b border-slate-800 pb-2 flex justify-between">
                    <span>Power Terminal Block TB-415</span>
                    <span>Rated 600V CAT IV</span>
                  </div>
                  <div class="space-y-1">
                    <div>L1: 415V AC Phase R (Red Wire 10 AWG)</div>
                    <div>L2: 415V AC Phase Y (Yellow Wire 10 AWG)</div>
                    <div>L3: 415V AC Phase B (Blue Wire 10 AWG)</div>
                    <div>PE: Earth Grounding Lug (&lt;0.5 Ohm to frame)</div>
                  </div>
                </div>

                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
                  <div class="font-bold text-slate-900">Step-by-Step Diagnostic Check:</div>
                  <ol class="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Isolate main breaker and attach OSHA red padlock.</li>
                    <li>Verify DC Bus voltage has discharged below 50V DC before touching TB-415.</li>
                    <li>Check spindle encoder cable pin 4 to 8 resistance (nominal 120 Ohms).</li>
                  </ol>
                </div>

                <button onclick="jumpToScreen('TW20')" class="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Back to Wiki Directory</button>
              </div>
            </div>`;

        case 'TW22':
          return `
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Workshop Team & Apprentice Management</h2>
                  <p class="text-xs text-slate-500">Manage 6 active field technicians and assign incoming plant jobs.</p>
                </div>
                <button class="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs">+ Add Apprentice</button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-slate-900">Raju Kumar (Lead)</span>
                    <span class="text-[10px] font-mono text-emerald-600 font-bold">ACTIVE</span>
                  </div>
                  <p class="text-xs text-slate-500">Assigned: Apex Tools #JOB-9821</p>
                </div>
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-slate-900">Sunil Gowda (Junior)</span>
                    <span class="text-[10px] font-mono text-slate-400">STANDBY</span>
                  </div>
                  <p class="text-xs text-slate-500">Peenya Depot Workshop Bench</p>
                </div>
                <div class="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-slate-900">Kavita Murthy (Apprentice)</span>
                    <span class="text-[10px] font-mono text-blue-600 font-bold">ON-SITE</span>
                  </div>
                  <p class="text-xs text-slate-500">Assisting at Bharat Forge Unit #3</p>
                </div>
              </div>
            </div>`;

        case 'TW23':
          return `
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Van Toolkit & Spare Parts Stock</h2>
                  <p class="text-xs text-slate-500">Real-time mobile inventory tracked for instant on-site replacement.</p>
                </div>
                <button class="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">Reorder via Marketplace</button>
              </div>

              <div class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono font-bold uppercase text-[10px]">
                    <tr>
                      <th class="p-4">Part / Tool</th>
                      <th class="p-4">Manufacturer</th>
                      <th class="p-4">Van Stock</th>
                      <th class="p-4">Unit Price</th>
                      <th class="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td class="p-4 font-bold text-slate-900">SKF 6208 Deep Groove Bearing</td>
                      <td class="p-4 text-slate-500">SKF India Ltd</td>
                      <td class="p-4 font-mono">4 units</td>
                      <td class="p-4 font-mono font-bold">₹3,450</td>
                      <td class="p-4"><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">IN STOCK</span></td>
                    </tr>
                    <tr>
                      <td class="p-4 font-bold text-slate-900">Siemens 3RT2026 25A Contactor</td>
                      <td class="p-4 text-slate-500">Siemens AG</td>
                      <td class="p-4 font-mono">1 unit</td>
                      <td class="p-4 font-mono font-bold">₹1,850</td>
                      <td class="p-4"><span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">LOW STOCK</span></td>
                    </tr>
                    <tr>
                      <td class="p-4 font-bold text-slate-900">Fluke 87V Multimeter</td>
                      <td class="p-4 text-slate-500">Fluke Corp</td>
                      <td class="p-4 font-mono">1 unit</td>
                      <td class="p-4 font-mono font-bold">Calibrated</td>
                      <td class="p-4"><span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">CALIBRATED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>`;

        case 'TW24':
          return `
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h2 class="text-xl font-display font-black text-slate-900">Specialist Preferences & System Settings</h2>
                  <p class="text-xs text-slate-500">Configure language, audio alerts, and security credentials.</p>
                </div>

                <!-- 9 Indian Languages Switcher -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-700">Display Language (9 Indian Languages Supported)</label>
                  <div class="grid grid-cols-3 gap-2 text-xs font-bold">
                    <button class="p-2.5 rounded-xl bg-slate-900 text-white">English (Default)</button>
                    <button class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-400">ಕನ್ನಡ (Kannada)</button>
                    <button class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-400">हिंदी (Hindi)</button>
                    <button class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-400">தமிழ் (Tamil)</button>
                    <button class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-400">తెలుగు (Telugu)</button>
                    <button class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-400">मराठी (Marathi)</button>
                  </div>
                </div>

                <!-- Alert Volume -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold text-slate-700">Incoming Dispatch Alert Tone</label>
                  <select class="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold">
                    <option>Industrial Horn (High Decibel - Recommended for plant floor)</option>
                    <option>Standard UPTIME Chime</option>
                    <option>Subtle Vibration Only</option>
                  </select>
                </div>
              </div>
            </div>`;

        case 'TW25':
          return `
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 text-xs text-slate-600 leading-relaxed">
                <h2 class="text-lg font-display font-black text-slate-900">Technician Service Agreement & Escrow Charter</h2>
                <p>1. <strong>Escrow Release:</strong> Client funds are held in Razorpay Escrow and released into the technician wallet immediately upon customer OTP verification.</p>
                <p>2. <strong>T+1 Bank Settlement:</strong> Withdrawals to verified Indian bank accounts settle via IMPS instantly or via NEFT within 24 hours.</p>
                <p>3. <strong>Safety Non-Negotiable:</strong> Technicians must adhere to OSHA 415V LOTO protocols. Failure to observe safety results in platform delisting.</p>
              </div>
            </div>`;

        case 'TW26':
          return `
            <div class="max-w-3xl mx-auto space-y-6">
              <div class="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 text-xs text-slate-600 leading-relaxed">
                <h2 class="text-lg font-display font-black text-slate-900">Privacy Notice & DPDP Act 2023 Compliance</h2>
                <p>1. Background GPS telemetry is collected strictly during active dispatches to provide factory clients with accurate arrival ETAs.</p>
                <p>2. Location tracking ceases automatically once the job is marked complete or when the technician toggles to Offline mode.</p>
                <p>3. Aadhaar numbers are masked and stored with AES-256 encryption in compliance with Indian UIDAI guidelines.</p>
              </div>
            </div>`;

        case 'TW27':
          return `
            <div class="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
              <div class="text-5xl font-black font-display text-orange-600">404</div>
              <h3 class="text-lg font-display font-black text-slate-900">Technician Portal Screen Not Found</h3>
              <p class="text-xs text-slate-500">The requested technician workstation route does not exist.</p>
              <button onclick="jumpToScreen('TW05')" class="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs">Return to Dashboard</button>
            </div>`;

        case 'TW28':
          return `
            <div class="max-w-md mx-auto p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
              <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                <i class="fa-solid fa-wifi"></i>
              </div>
              <h3 class="text-lg font-display font-black text-slate-900">Offline Field Mode Active</h3>
              <p class="text-xs text-slate-500">Your phone or laptop is offline. All diagnostic photos and handover signatures are being cached in local SQLite storage.</p>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700">
                Queued Records: 2 Photos • 1 Handover Sign-off
              </div>
              <button onclick="jumpToScreen('TW05')" class="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Continue in Offline Mode</button>
            </div>`;

        default:
          return `<div class="p-8 text-center font-mono">Technician Screen Not Found</div>`;
      }
    }
    """
