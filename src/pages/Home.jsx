import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <h1>Welcome to Crewmate Creator!</h1>
      <p>Build your dream team of crewmates!</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/create">
          <button className="submit-btn home-create-btn">
            Create a New Crewmate
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home