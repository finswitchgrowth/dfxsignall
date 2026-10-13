/** Public plan catalogue: only Free and Elite are available. Paid access stays pending until payment is independently verified. */
export type PackageStatus = "coming-soon" | "available" | "paused";
export type SignalPackage = {
  id:string; name:string; tier:string; description:string; price:number; currency:"USD";
  duration:string; features:string[]; signalAccess:string; marketAccess:string;
  status:PackageStatus; featured:boolean; order:number;
};
export const packages:SignalPackage[]=[
 {id:"free",name:"DFX FREE",tier:"Free access",description:"A limited introduction to market signals and risk-aware market education.",price:0,currency:"USD",duration:"month",features:["Free-tier signal feed only","Selected market insights","Basic educational content","Signal status and risk notes"],signalAccess:"Free-tier signals",marketAccess:"Selected covered markets",status:"available",featured:false,order:1},
 {id:"elite",name:"DFX ELITE",tier:"Full signal access",description:"Expanded signal access and detailed market context for members with an active Elite entitlement.",price:49,currency:"USD",duration:"month",features:["All published Free signals","Elite-only signals","Detailed entry, invalidation and risk notes when available","Signal history and status updates","Market commentary"],signalAccess:"Free + Elite signals",marketAccess:"Covered markets",status:"available",featured:true,order:2},
];
export const sortedPackages=[...packages].sort((a,b)=>a.order-b.order);
