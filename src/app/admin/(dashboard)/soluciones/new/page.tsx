import { SolutionForm } from "@/components/admin/soluciones/SolutionForm";

export default function NewSolutionPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Nuevo proyecto</h1>
      <div className="mt-8">
        <SolutionForm />
      </div>
    </div>
  );
}
