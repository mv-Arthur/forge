import { OutOfScopePage } from "@/components/OutOfScopePage";

export const metadata = {
    title: "Страница не в демонстрации · Новый Коттедж",
};

export default function NotFound() {
    return (
        <OutOfScopePage title="Этой страницы нет в демонстрации" />
    );
}
