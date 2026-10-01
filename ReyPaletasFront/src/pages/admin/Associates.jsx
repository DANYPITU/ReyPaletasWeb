import { useState, useEffect } from 'react'
import { privateApi } from '../../services/api'
import { uploadImage } from '../../services/storage'
import { sileo } from 'sileo'
import { Icon } from '@iconify/react'
import { useConfirm } from '../../components/ConfirmDialog'

function AssociateForm({ onSave, editingAssociate, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (editingAssociate) {
      setFormData({
        name: editingAssociate.name || '',
      })
      setImagePreview(editingAssociate.logo_url || '')
      setImageFile(null)
    } else {
      setFormData({ name: '' })
      setImagePreview('')
      setImageFile(null)
    }
  }, [editingAssociate])

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result || '')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imagePreview) {
      setError('El logo es requerido')
      return
    }

    setSaving(true)
    setError('')
    try {
      let logoUrl = imagePreview

      if (imageFile) {
        setUploading(true)
        logoUrl = await uploadImage(imageFile, 'Associates')
        setUploading(false)
        if (!logoUrl) {
          setError('Error al subir el logo')
          setSaving(false)
          return
        }
      }

      const payload = {
        name: formData.name || null,
        logoUrl,
      }

      await onSave(payload)

      if (!editingAssociate) {
        setFormData({ name: '' })
        setImagePreview('')
        setImageFile(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">
        {editingAssociate ? 'Editar Asociado' : 'Nuevo Asociado'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre (opcional)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre de la empresa"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-gray-500 mt-1">
            Dejar en blanco si el logo ya incluye el nombre
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-2">
            {imagePreview ? (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-gray-50" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="text-center text-gray-400">
                  <Icon icon="mdi:image-plus" className="w-10 h-10 mx-auto mb-2" />
                  <span className="text-xs">Subir logo</span>
                </div>
              </label>
            )}
            {uploading && <span className="text-xs text-gray-500">Subiendo imagen...</span>}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
          >
            {saving || uploading ? '...' : editingAssociate ? 'Actualizar' : 'Guardar'}
          </button>
          {editingAssociate && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

function AssociateCard({ associate, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      <div className="relative aspect-square p-4 flex items-center justify-center bg-gray-50">
        <img
          src={associate.logo_url}
          alt={associate.name || 'Logo'}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
            title="Editar"
          >
            <Icon icon="mdi:pencil" className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
            title="Eliminar"
          >
            <Icon icon="mdi:trash-can" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-3 text-center">
        <span className="text-sm text-gray-700 font-medium">
          {associate.name || 'Sin nombre'}
        </span>
      </div>
    </div>
  )
}

export default function Associates() {
  const [associates, setAssociates] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingAssociate, setEditingAssociate] = useState(null)
  const [error, setError] = useState('')
  const { confirm, ConfirmDialog } = useConfirm()

  const fetchAssociates = async () => {
    try {
      const response = await privateApi.getAssociates()
      const associatesData = response?.data || response || []
      setAssociates(associatesData)
    } catch (err) {
      console.error('Error fetching associates:', err)
      setError('Error al cargar asociados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssociates()
  }, [])

  const handleSaveAssociate = async (formData) => {
    if (editingAssociate) {
      await privateApi.updateAssociate(editingAssociate.id, formData)
      sileo.success({ title: 'Asociado actualizado exitosamente' })
    } else {
      await privateApi.createAssociate(formData)
      sileo.success({ title: 'Asociado creado exitosamente' })
    }
    setEditingAssociate(null)
    await fetchAssociates()
  }

  const handleDeleteAssociate = async (id) => {
    confirm({
      title: '¿Eliminar este asociado?',
      message: 'Esta acción no se puede deshacer',
      onConfirm: async () => {
        try {
          await privateApi.deleteAssociate(id)
          sileo.success({ title: 'Asociado eliminado exitosamente' })
          await fetchAssociates()
        } catch {
          sileo.error({ title: 'Error al eliminar asociado' })
        }
      },
    })
  }

  const handleCancel = () => {
    setEditingAssociate(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Asociados</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <AssociateForm
            onSave={handleSaveAssociate}
            editingAssociate={editingAssociate}
            onCancel={handleCancel}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Lista de asociados ({associates.length})
            </h3>
            {associates.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No hay asociados configurados</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {associates.map((associate) => (
                  <AssociateCard
                    key={associate.id}
                    associate={associate}
                    onEdit={() => setEditingAssociate(associate)}
                    onDelete={() => handleDeleteAssociate(associate.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog />
    </div>
  )
}