import { OutOfScope } from "@/widgets/out-of-scope/out-of-scope";

export const metadata = {
    title: "Страница не в демонстрации · Новый Коттедж",
};

export default function NotFound() {
    return <OutOfScope title="Этой страницы нет в демонстрации" />;
}
