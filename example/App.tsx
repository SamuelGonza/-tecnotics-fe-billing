/**
 * Ejemplo de uso de @tecnotics/fe-billing
 */

import { TecnoticsProvider, BillingComponent } from '@tecnotics/fe-billing';

function App() {
  // Obtener desde variables de entorno o usar valores existentes
  const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || '691f6960b6208c83ccf58c7c';
  const SIMBA_TOKEN = import.meta.env.VITE_SIMBA_TOKEN || 'D4EB6304-9E1D-44CE-B377-7167F129713D';

  return (
    <TecnoticsProvider
        company_id={COMPANY_ID}
        simba_token={SIMBA_TOKEN}
      >
        {/* Puedes cambiar el theme a "classic", "clean" o "compact" */}
        <BillingComponent theme="clean" />
      </TecnoticsProvider>
  );
}

export default App;

