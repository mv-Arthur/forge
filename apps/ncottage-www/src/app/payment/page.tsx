import type { Metadata } from "next";
import { FinancePage, financeMetadata } from "../mortgage/FinancePage";

export function generateMetadata(): Promise<Metadata> {
    return financeMetadata("payment");
}

export default function PaymentPage() {
    return <FinancePage pageKey="payment" />;
}
