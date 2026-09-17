import { CompanyForm } from "@/components/admin/trabajos/CompanyForm";

export default function NewCompanyPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Nueva empresa</h1>
      <div className="mt-8">
        <CompanyForm />
      </div>
    </div>
  );
}
