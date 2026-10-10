/** Public plan catalogue. Paid access remains pending until a payment is independently verified. */
export type PackageStatus = "coming-soon" | "available" | "paused";
export type SignalPackage = {
  id:string; name:string; tier:string; description:string; price:number; currency:"USD";
  duration:string; features:string[]; signalAccess:string; marketAccess:string;
  status:PackageStatus; featured:boolean; order:number;
};
export const packages:SignalPackage[]=[
 {id:"free",name:"DFX FREE",tier:"Start here",description:"A simple introduction to market information and education.",price:0,currency:"USD",duration:"month",features:["Selected market insights","Basic educational content","Starter watchlist"],signalAccess:"Selected insights",marketAccess:"Majors watchlist",status:"available",featured:false,order:1},
 {id:"starter",name:"DFX STARTER",tier:"Build a routine",description:"A structured entry point for market-aware traders.",price:9,currency:"USD",duration:"month",features:["Expanded market insights","Starter alerts","Educational updates"],signalAccess:"Starter feed",marketAccess:"Major markets",status:"available",featured:false,order:2},
 {id:"pro",name:"DFX PRO",tier:"Most popular",description:"Structured signal information for a disciplined workflow.",price:25,currency:"USD",duration:"month",features:["Signal details when available","Risk notes and rationale","Signal history as available","Alert-ready updates"],signalAccess:"Pro feed",marketAccess:"Forex, metals and crypto information",status:"available",featured:true,order:3},
 {id:"elite",name:"DFX ELITE",tier:"Advanced",description:"More detailed commentary and account-support options.",price:49,currency:"USD",duration:"month",features:["Everything in Pro","Advanced market commentary","Risk review tools","Priority support requests"],signalAccess:"Elite feed",marketAccess:"Covered markets",status:"available",featured:false,order:4},
 {id:"auto-trading-tools",name:"AUTO TRADING TOOLS",tier:"Tools only",description:"A planned toolkit tier; live broker execution is not enabled.",price:199,currency:"USD",duration:"month",features:["Tool access subject to availability","Risk-control education","Demo-first workflow"],signalAccess:"Tools only",marketAccess:"Demo / educational",status:"available",featured:false,order:5},
 {id:"market-starter-pack",name:"MARKET STARTER PACK",tier:"One-time",description:"A one-time introductory market education pack.",price:19,currency:"USD",duration:"one-time",features:["Introductory market guide","Risk and terminology basics","Starter checklist"],signalAccess:"Education pack",marketAccess:"Educational",status:"available",featured:false,order:6},
];
export const sortedPackages=[...packages].sort((a,b)=>a.order-b.order);
