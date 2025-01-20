import { PatientsListComponent } from './patients/patient-list-component'

export function PatientsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
      <PatientsListComponent />
    </div>
  )
}