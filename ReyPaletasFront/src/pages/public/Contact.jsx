import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { publicApi } from '../../services/api'
import { CONTACT, CONTACT_RATE_LIMIT } from '../../config/contact'

const formatCooldown = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes > 0
    ? `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
    : `${remainingSeconds}s`
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [rateLimitMessage, setRateLimitMessage] = useState('')
  const [rateLimit, setRateLimit] = useState(CONTACT_RATE_LIMIT)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    let cancelled = false

    publicApi.getContactRateLimit()
      .then((data) => {
        const max = Number(data?.max)
        const windowMinutes = Number(data?.windowMinutes)
        if (!cancelled && max > 0 && windowMinutes > 0) {
          setRateLimit({ max, windowMinutes })
        }
      })
      .catch(() => {
        // Keep the local fallback if the config endpoint is unavailable.
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setTimeout(() => {
      setCooldown(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [cooldown])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading || cooldown > 0) return

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Todos los campos son requeridos')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Ingresa un email válido')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    setRateLimitMessage('')

    try {
      await publicApi.sendContact(formData)
      setSuccess('¡Mensaje enviado! Te responderemos pronto.')
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      if (err.status === 429) {
        const retryAfter = Number(err.retryAfter) > 0
          ? Number(err.retryAfter)
          : rateLimit.windowMinutes * 60
        const message = err.message || 'Has alcanzado el límite de mensajes. Intenta de nuevo más tarde.'

        setCooldown(retryAfter)
        setRateLimitMessage(message)
      } else {
        const message = 'Error al enviar el mensaje. Intenta de nuevo.'
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contáctanos - Rey Paletas | Contacto</title>
        <meta name="description" content="Contáctanos para consultas, sugerencias o comentarios. Estamos disponibles para atenderte y resolver tus dudas sobre nuestros productos." />
        <meta property="og:title" content="Contáctanos - Rey Paletas" />
        <meta property="og:description" content="Contáctanos para consultas, sugerencias o comentarios." />
        <meta property="og:url" content="https://www.reypaletas.com/contactanos" />
        <link rel="canonical" href="https://www.reypaletas.com/contactanos" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Contáctanos</h1>
          <p className="text-gray-600">¿Tienes alguna pregunta? Escríbenos y te responderemos pronto.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {(error || (cooldown > 0 && rateLimitMessage)) && (
            <div role="alert" className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error || rateLimitMessage}
            </div>
          )}

          {success && (
            <div role="status" aria-live="polite" className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="¿En qué podemos ayudarte?"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? 'Enviando...'
                : cooldown > 0
                  ? `Espera ${formatCooldown(cooldown)}`
                  : 'Enviar Mensaje'}
            </button>

            <p className="text-xs text-center text-gray-500" aria-live="polite">
              {cooldown > 0
                ? `Podrás enviar otro mensaje en ${formatCooldown(cooldown)}.`
                : `Puedes enviar hasta ${rateLimit.max} mensajes cada ${rateLimit.windowMinutes} minutos.`}
            </p>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-500">
              También puedes llamarnos al <span className="font-medium text-primary">{CONTACT.phone}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
