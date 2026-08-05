import ClientsList from '@/components/ClientsList'

export default function PendingClientsPage() {
  return <ClientsList statusFilter="pending" title="Pending Clients" />
}
