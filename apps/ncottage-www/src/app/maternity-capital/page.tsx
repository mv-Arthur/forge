import type { Metadata } from "next";
import { FinancePage, financeMetadata } from "../mortgage/FinancePage";

export function generateMetadata(): Promise<Metadata> {
    return financeMetadata("maternity-capital");
}

export default function MaternityCapitalPage() {
    return <FinancePage pageKey="maternity-capital" />;
}
