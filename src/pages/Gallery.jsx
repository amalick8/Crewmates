import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function Gallery() {
  const navigate = useNavigate()
  const [crewmates, setCrewmates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCrewmates()
  }, [])

  const fetchCrewmates = async () => {
    const { data, error } = await supabase
      .from('crewmates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching crewmates:', error)
    } else {
      setCrewmates(data)
    }
    setLoading(false)
  }

  const calculateStats = () => {
    if (crewmates.length === 0) return null

    const speedStats = {}
    const colorStats = {}
    const categoryStats = {}

    crewmates.forEach(crew => {
      speedStats[crew.speed] = (speedStats[crew.speed] || 0) + 1
      colorStats[crew.color] = (colorStats[crew.color] || 0) + 1
      categoryStats[crew.category] = (categoryStats[crew.category] || 0) + 1
    })

    const total = crewmates.length
    const speedPercentages = {}
    const colorPercentages = {}
    const categoryPercentages = {}

    Object.keys(speedStats).forEach(key => {
      speedPercentages[key] = Math.round((speedStats[key] / total) * 100)
    })
    Object.keys(colorStats).forEach(key => {
      colorPercentages[key] = Math.round((colorStats[key] / total) * 100)
    })
    Object.keys(categoryStats).forEach(key => {
      categoryPercentages[key] = Math.round((categoryStats[key] / total) * 100)
    })

    return { speedPercentages, colorPercentages, categoryPercentages }
  }

  const calculateSuccessScore = () => {
    if (crewmates.length === 0) return 0

    let score = 0
    const speedsterCount = crewmates.filter(c => c.category === 'Speedster').length
    const tankCount = crewmates.filter(c => c.category === 'Tank').length
    const balancedCount = crewmates.filter(c => c.category === 'Balanced').length

    score += speedsterCount * 15
    score += tankCount * 20
    score += balancedCount * 10

    const diversity = new Set(crewmates.map(c => c.category)).size
    score += diversity * 10

    return Math.min(score, 100)
  }

  const getSuccessLevel = (score) => {
    if (score >= 80) return { text: 'Elite Squad', class: 'elite' }
    if (score >= 60) return { text: 'Strong Team', class: 'strong' }
    if (score >= 40) return { text: 'Growing Force', class: 'growing' }
    return { text: 'Rookie Team', class: 'rookie' }
  }

  if (loading) {
    return <div>Loading crewmates...</div>
  }

  const stats = calculateStats()
  const successScore = calculateSuccessScore()
  const successLevel = getSuccessLevel(successScore)

  if (crewmates.length === 0) {
    return (
      <div>
        <h2>Crewmate Gallery</h2>
        <p>No crewmates yet! Create one to get started.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Crewmate Gallery</h2>
      
      <div className={`success-metric ${successLevel.class}`}>
        <h3>Team Status: {successLevel.text}</h3>
        <div className="success-bar">
          <div className="success-fill" style={{ width: `${successScore}%` }}>
            {successScore}%
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Team Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Crewmates</h4>
            <p className="stat-number">{crewmates.length}</p>
          </div>
          
          <div className="stat-card">
            <h4>Category Distribution</h4>
            {stats && Object.entries(stats.categoryPercentages).map(([key, value]) => (
              <p key={key}>{key}: {value}%</p>
            ))}
          </div>

          <div className="stat-card">
            <h4>Speed Distribution</h4>
            {stats && Object.entries(stats.speedPercentages).map(([key, value]) => (
              <p key={key}>{key}: {value}%</p>
            ))}
          </div>

          <div className="stat-card">
            <h4>Color Distribution</h4>
            {stats && Object.entries(stats.colorPercentages).map(([key, value]) => (
              <p key={key}>{key}: {value}%</p>
            ))}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', color: 'white' }}>Your Crew</h3>
      <div className="gallery">
        {crewmates.map((crewmate) => (
          <div
            key={crewmate.id}
            className="crewmate-card"
            onClick={() => navigate(`/crewmate/${crewmate.id}`)}
          >
            <div className="category-badge">{crewmate.category}</div>
            <h3>{crewmate.name}</h3>
            <p>Speed: {crewmate.speed}</p>
            <p>Color: {crewmate.color}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery