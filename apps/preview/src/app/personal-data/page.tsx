import { OutOfScope } from "@/widgets/out-of-scope/out-of-scope";

export const metadata = {
    title: "Согласие на обработку персональных данных · демонстрация",
};

export default function PersonalDataPage() {
    return (
        <OutOfScope
            title="Обработка персональных данных"
            topic="Согласие на обработку персональных данных"
        />
    );
}
