const mercadoPagoPaymentsUrl = 'https://api.mercadopago.com/v1/payments'

export async function fetchMercadoPagoPayment(paymentId) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error('Mercado Pago access token is missing.')
  }

  const response = await fetch(`${mercadoPagoPaymentsUrl}/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const payment = await response.json()

  if (!response.ok) {
    throw new Error(payment.message || 'Nao foi possivel consultar o pagamento.')
  }

  return payment
}
