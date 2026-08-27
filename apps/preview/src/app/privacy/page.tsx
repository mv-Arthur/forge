import { OutOfScope } from "@/widgets/out-of-scope/out-of-scope";

export const metadata = {
    title: "Политика конфиденциальности · демонстрация",
};

export default function PrivacyPage() {
    return (
        <OutOfScope
            title="Политика конфиденциальности"
            topic="Политика конфиденциальности"
        />
    );
}
