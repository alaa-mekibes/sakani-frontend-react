// routes/properties/create.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { CreatePropertyForm } from '../../components/layout/CreatePropertyForm';

export const Route = createFileRoute('/properties/create')({
  component: CreatePropertyPage,
});

function CreatePropertyPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate({ to: '/properties' })}
          className="btn btn-ghost gap-2 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </button>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Create New Property
            </h2>
            <p className="text-base-content/70 mb-6">
              Fill in the details below to list your property
            </p>
            <CreatePropertyForm />
          </div>
        </div>
      </div>
    </div>
  );
}