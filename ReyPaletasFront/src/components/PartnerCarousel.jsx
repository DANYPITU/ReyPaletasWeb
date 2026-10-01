/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { publicApi } from '../services/api'

const MIN_LOGOS_DESKTOP = 5
const MIN_LOGOS_MOBILE = 2

function LogoItem({ partner }) {
  return (
    <div className="flex justify-center items-center rounded-xl overflow-hidden shadow-lg">
      <div className="w-60 p-2 h-30 overflow-hidden flex flex-col justify-center items-center gap-3">
        <img
          src={partner.logoUrl}
          alt={partner.name || 'Partner logo'}
          className={`w-full  object-contain rounded-xl ${partner.name ? 'h-15' : 'h-25'}`}
        />
        {
          partner.name && (
            <strong className="text-lg text-gray-500">
              {partner.name}
            </strong>

          )
        }

      </div>
    </div>
  )
}

function CarouselRow({ partners, rowIndex, animate }) {
  if (!animate) {
    return (
      <div className="py-2 flex flex-wrap justify-center gap-8">
        {partners.map((partner) => (
          <LogoItem key={partner.id} partner={partner} />
        ))}
      </div>
    )
  }

  const duplicatedPartners = [...partners, ...partners, ...partners]
  const isOddRow = (rowIndex + 1) % 2 !== 0
  const delay = isOddRow ? '0.5s' : '0s'
  const duration = 50 + rowIndex * 5

  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex gap-30"
        animate={{ x: [0, -50 + '%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'linear',
            delay: parseFloat(delay),
          },
        }}
        style={{
          width: 'fit-content',
        }}
      >
        {duplicatedPartners.map((partner, idx) => (
          <LogoItem key={`${partner.id}-${idx}`} partner={partner} />
        ))}
      </motion.div>
    </div>
  )
}

export default function PartnerCarousel() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        const response = await publicApi.getAssociates()
        setPartners(response.data || [])
      } catch (err) {
        console.error('Error fetching associates:', err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAssociates()
  }, [])

  const totalPerRow = 10
  const numRows = Math.ceil(partners.length / totalPerRow)
  const imagesPerRow = Math.ceil(partners.length / numRows)

  const rows = []
  for (let i = 0; i < numRows; i++) {
    const start = i * imagesPerRow
    const end = start + imagesPerRow
    rows.push(partners.slice(start, end))
  }

  if (loading) return null

  if (error || partners.length === 0) return null

  const shouldAnimate = isMobile ? partners.length > MIN_LOGOS_MOBILE : partners.length > MIN_LOGOS_DESKTOP

  return (
    <section className="py-12 bg-white w-full ">
      <div className="flex flex-col  px-4 w-full">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className=" font-bold text-primary text-3xl text-center mb-8"
        >
          Empresas que confían en nosotros
        </motion.h3>

        <div className={shouldAnimate ? 'overflow-hidden' : ''}>
          {rows.map((rowPartners, rowIndex) => (
            <CarouselRow
              key={rowIndex}
              partners={rowPartners}
              rowIndex={rowIndex}
              animate={shouldAnimate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}