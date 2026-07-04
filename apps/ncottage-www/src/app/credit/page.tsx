import type { Metadata } from "next";
import { FinancePage, financeMetadata } from "../mortgage/FinancePage";

export function generateMetadata(): Promise<Metadata> {
    return financeMetadata("credit");
}

export default function CreditPage() {
    return <FinancePage pageKey="credit" />;
}
