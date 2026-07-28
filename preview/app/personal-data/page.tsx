import { OutOfScopePage } from "@/components/OutOfScopePage";

export const metadata = {
    title: "Согласие на обработку персональных данных · демонстрация",
};

export default function PersonalDataPage() {
    return (
        <OutOfScopePage
            title="Обработка персональных данных"
            topic="Согласие на обработку персональных данных"
        />
    );
}
