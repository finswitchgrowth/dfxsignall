import type { Metadata } from "next";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
export const metadata:Metadata={title:"Client dashboard · DFXSIGNALL",robots:{index:false,follow:false}};
export default function DashboardPage(){return <CustomerDashboard/>;}
