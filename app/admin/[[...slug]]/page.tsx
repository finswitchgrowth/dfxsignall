import type { Metadata } from "next";
import AdminPayments from "@/components/admin/AdminPayments";
export const metadata:Metadata={title:"Administration · DFXSIGNALL",robots:{index:false,follow:false}};
export default function AdminPage(){return <AdminPayments/>;}
