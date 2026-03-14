import { DashboardLayout } from '@/components/DashboardLayout';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground text-sm">This section is coming soon.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
