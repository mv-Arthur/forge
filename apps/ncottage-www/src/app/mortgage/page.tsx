import type { Metadata } from "next";
import { FinancePage, financeMetadata } from "./FinancePage";

export function generateMetadata(): Promise<Metadata> {
    return financeMetadata("mortgage");
}

export default function MortgagePage() {
    return <FinancePage pageKey="mortgage" />;
}
