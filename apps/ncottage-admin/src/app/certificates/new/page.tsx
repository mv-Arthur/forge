import { PageHeader } from "@/components/page-header";
import { CertificateForm } from "../CertificateForm";

export default function NewCertificatePage() {
    return (
        <div>
            <PageHeader
                title="Новый документ"
                description="Добавьте сертификат или лицензию"
            />
            <CertificateForm submitLabel="Создать" />
        </div>
    );
}
