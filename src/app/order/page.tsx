

import OrderPage from '@/components/order-page';
import { ProtectedRoute } from '@/contexts/auth-provider';

export default function Order() {
  return (
    <ProtectedRoute>
        <OrderPage />
    </ProtectedRoute>
  )
}

    