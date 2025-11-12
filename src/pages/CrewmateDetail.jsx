import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function CrewmateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [crewmate, setCrewmate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCrewmate()
  }, [id])

  const fetchCrewmate = async () => {
    const { data, error } = await supabase
      .from('crewmates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching crewmate:', error)
    } else {
      setCrewmate(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!crewmate) {
    return <div>Crewmate not found!</div>
  }

  return (
    <div className="detail-container">
      <div className="category-badge-large">{crewmate.category}</div>
      <h2>{crewmate.name}</h2>
      <p><strong>Category:</strong> {crewmate.category}</p>
      <p><strong>Speed:</strong> {crewmate.speed}</p>
      <p><strong>Color:</strong> {crewmate.color}</p>
      <p><strong>Created:</strong> {new Date(crewmate.created_at).toLocaleDateString()}</p>
      
      <div className="detail-actions">
        <button 
          className="edit-btn"
          onClick={() => navigate(`/edit/${crewmate.id}`)}
        >
          Edit Crewmate
        </button>
        <button 
          className="submit-btn"
          onClick={() => navigate('/gallery')}
        >
          Back to Gallery
        </button>
      </div>
    </div>
  )
}

export default CrewmateDetail