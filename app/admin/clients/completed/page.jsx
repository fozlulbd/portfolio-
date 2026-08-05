import ClientsList from '@/components/ClientsList'

export default function CompletedClientsPage() {
  return <ClientsList statusFilter="completed" title="Completed Clients" />
}
