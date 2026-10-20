// Datos de contacto centralizados de Rey Paletas.
// `whatsapp` debe ir en formato wa.me: solo dígitos, con código de país y sin `+`.

export const CONTACT = {
  email: 'info@reypaletas.com',
  phone: '+593 99 804 4059',
  phoneHref: 'tel:+593998044059',
  whatsapp: '593998044059',
  location: 'Ambato, Ecuador',
}

export const getWhatsAppLink = (message = '') => {
  const base = `https://wa.me/${CONTACT.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
