import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

function CreateCrewmate() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [speed, setSpeed] = useState('')
  const [color, setColor] = useState('')

  const categories = {
    Speedster: {
      speeds: ['Very Fast', 'Fast'],
      colors: ['Red', 'Yellow', 'Orange']
    },
    Tank: {
      speeds: ['Slow', 'Medium'],
      colors: ['Blue', 'Green', 'Purple']
    },
    Balanced: {
      speeds: ['Medium', 'Fast'],
      colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']
    }
  }

  const availableSpeeds = category ? categories[category].speeds : []
  const availableColors = category ? categories[category].colors : []

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    setSpeed('')
    setColor('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name || !category || !speed || !color) {
      alert('Please fill in all fields!')
      return
    }

    const { data, error } = await supabase
      .from('crewmates')
      .insert([
        { name: name, category: category, speed: speed, color: color }
      ])

    if (error) {
      console.error('Error creating crewmate:', error)
      alert('Error creating crewmate!')
    } else {
      console.log('Crewmate created:', data)
      alert('Crewmate created successfully!')
      navigate('/gallery')
    }
  }

  return (
    <div className="form-container">
      <h2>Create a New Crewmate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter crewmate name"
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <div className="attribute-options">
            {Object.keys(categories).map((cat) => (
              <div
                key={cat}
                className={`attribute-option ${category === cat ? 'selected' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {category && (
          <>
            <div className="form-group">
              <label>Speed:</label>
              <div className="attribute-options">
                {availableSpeeds.map((option) => (
                  <div
                    key={option}
                    className={`attribute-option ${speed === option ? 'selected' : ''}`}
                    onClick={() => setSpeed(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Color:</label>
              <div className="attribute-options">
                {availableColors.map((option) => (
                  <div
                    key={option}
                    className={`attribute-option ${color === option ? 'selected' : ''}`}
                    onClick={() => setColor(option)}
                    style={{ backgroundColor: option.toLowerCase(), color: 'white' }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <button type="submit" className="submit-btn">
          Create Crewmate
        </button>
      </form>
    </div>
  )
}

export default CreateCrewmate